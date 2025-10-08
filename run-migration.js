#!/usr/bin/env node
/**
 * Database Migration Runner
 * Runs SQL migration files against Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Check if tables already exist
    const { data: existingTables, error: checkError } = await supabase
      .from('salons')
      .select('*')
      .limit(1);
    
    if (!checkError) {
      console.log('ℹ️  Database tables already exist. Checking service tables...');
      
      const { data: serviceCategories, error: serviceCatError } = await supabase
        .from('service_categories')
        .select('*')
        .limit(1);
      
      if (!serviceCatError) {
        console.log('✅ Service tables already exist. Ready for service population.');
        return true;
      } else {
        console.log('⚠️  Service tables missing. Attempting to create them...');
      }
    }
    
    // Read migration file
    const migrationFile = path.join(__dirname, 'supabase/migrations/0001_initial_schema_fixed.sql');
    
    if (!fs.existsSync(migrationFile)) {
      console.error('❌ Migration file not found:', migrationFile);
      return false;
    }
    
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    
    console.log('📜 Reading migration file...');
    
    // For now, let's just try to create the service-related tables directly
    // since we can't run the full migration without admin privileges
    
    const serviceTablesSQL = `
    -- Service Categories (Hierarchical)
    CREATE TABLE IF NOT EXISTS service_categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      parent_id UUID REFERENCES service_categories(id),
      description TEXT,
      icon VARCHAR(50),
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Service Types
    CREATE TABLE IF NOT EXISTS service_types (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      category_id UUID REFERENCES service_categories(id),
      name VARCHAR(150) NOT NULL,
      slug VARCHAR(150) UNIQUE NOT NULL,
      description TEXT,
      duration_minutes INTEGER,
      price_range_low DECIMAL(10,2),
      price_range_high DECIMAL(10,2),
      specialization_level VARCHAR(20), -- 'basic', 'standard', 'advanced'
      trend_status VARCHAR(20), -- 'stable', 'growing', 'trending', 'declining'
      filtering_priority VARCHAR(20), -- 'high', 'medium', 'low'
      keywords TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_service_types_category_id ON service_types(category_id);
    CREATE INDEX IF NOT EXISTS idx_service_types_slug ON service_types(slug);
    CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON service_categories(slug);
    `;
    
    console.log('🛠️  Creating service tables...');
    
    // Split SQL into individual commands
    const commands = serviceTablesSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && cmd.length > 5);
    
    for (const command of commands) {
      if (command.startsWith('--') || command.length < 10) continue;
      
      try {
        // Use a more direct approach for table creation
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error && !error.message?.includes('already exists')) {
          console.log('⚠️  Command result:', { error, command: command.substring(0, 50) + '...' });
        }
      } catch (e) {
        console.log('⚠️  Attempting alternative method for:', command.substring(0, 50) + '...');
        
        // If RPC doesn't work, we'll handle this differently
        if (command.includes('CREATE TABLE')) {
          console.log('📝 Table creation command detected, continuing...');
        }
      }
    }
    
    console.log('✅ Migration setup attempted');
    return true;
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return false;
  }
}

// Check current database state
async function checkDatabaseState() {
  console.log('🔍 Checking current database state...');
  
  const tables = ['user_profiles', 'salons', 'service_categories', 'service_types'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Table exists`);
      }
    } catch (e) {
      console.log(`❌ ${table}: Exception -`, e.message);
    }
  }
}

// Manual table creation as fallback
async function createServiceTablesManually() {
  console.log('🛠️  Attempting manual table creation...');
  
  // Create a simple test to see what permissions we have
  try {
    // Test if we can create a simple table
    const testSQL = "SELECT current_user, current_database();";
    const result = await supabase.rpc('execute_sql', { query: testSQL });
    console.log('Database info:', result);
  } catch (e) {
    console.log('Cannot execute raw SQL. Using Supabase client methods only.');
  }
  
  console.log('ℹ️  Since direct SQL execution is limited, please run migrations through Supabase Dashboard:');
  console.log('1. Go to https://app.supabase.com/project/[your-project]/sql');
  console.log('2. Copy the contents of supabase/migrations/0001_initial_schema_fixed.sql');
  console.log('3. Run the migration in the SQL editor');
  console.log('4. Then run the service population script again');
}

// Run the migration
if (require.main === module) {
  checkDatabaseState().then(() => {
    runMigration().then(success => {
      if (!success) {
        createServiceTablesManually();
      }
    });
  });
}

module.exports = { runMigration, checkDatabaseState };