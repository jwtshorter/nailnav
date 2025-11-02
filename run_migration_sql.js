const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  console.log('🚀 Running database migration...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Try creating client with service role
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  try {
    // Read the migration SQL file
    const migrationSQL = fs.readFileSync('supabase/migrations/20241102000001_add_directory_structure.sql', 'utf8');
    
    console.log('📄 Migration SQL loaded, size:', migrationSQL.length, 'characters');
    
    // Split into individual statements (rough split by semicolon + newline)
    const statements = migrationSQL
      .split(';\n')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      .map(stmt => stmt.endsWith(';') ? stmt : stmt + ';');
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt.trim().length < 10) continue; // Skip tiny statements
      
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
      console.log(`   Preview: ${stmt.substring(0, 80)}${stmt.length > 80 ? '...' : ''}`);
      
      const { data, error } = await supabase.rpc('exec_sql', { sql_statement: stmt });
      
      if (error) {
        console.log(`❌ Error in statement ${i + 1}:`, error.message);
        console.log(`   Statement: ${stmt.substring(0, 200)}...`);
        
        // Some errors are OK (like "table already exists")
        if (error.message.includes('already exists') || 
            error.message.includes('does not exist') ||
            error.message.toLowerCase().includes('duplicate')) {
          console.log('   ⚠️ Continuing despite error (likely safe)...');
          continue;
        } else {
          console.log('   🛑 Stopping due to serious error');
          return false;
        }
      } else {
        console.log(`   ✅ Success`);
      }
    }
    
    console.log('🎉 Migration completed successfully!');
    return true;
    
  } catch (err) {
    console.log('❌ Migration failed:', err.message);
    return false;
  }
}

runMigration().then(success => {
  if (success) {
    console.log('✅ Database schema is ready!');
    console.log('🔄 Next: Import salon data');
  } else {
    console.log('💥 Migration failed - will try alternative approach');
  }
  process.exit(success ? 0 : 1);
});