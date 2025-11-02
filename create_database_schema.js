const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function createSchema() {
  console.log('🏗️ Creating database schema...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  const sqlStatements = [
    // 1. Create countries table
    `CREATE TABLE IF NOT EXISTS countries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      code VARCHAR(2) NOT NULL UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    // 2. Create states table  
    `CREATE TABLE IF NOT EXISTS states (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      code VARCHAR(10) NOT NULL,
      country_id INTEGER REFERENCES countries(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(name, country_id)
    );`,
    
    // 3. Create cities table
    `CREATE TABLE IF NOT EXISTS cities (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      state_id INTEGER REFERENCES states(id),
      latitude DECIMAL(10,8),
      longitude DECIMAL(11,8),
      salon_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(name, state_id)
    );`,
    
    // 4. Create or modify salons table
    `CREATE TABLE IF NOT EXISTS salons (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address TEXT,
      city_id INTEGER REFERENCES cities(id),
      phone VARCHAR(20),
      website VARCHAR(255),
      latitude DECIMAL(10,8),
      longitude DECIMAL(11,8),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    // 5. Insert Australia
    `INSERT INTO countries (name, code) VALUES ('Australia', 'AU') ON CONFLICT (code) DO NOTHING;`,
    
    // 6. Insert Australian states
    `INSERT INTO states (name, code, country_id) 
     SELECT 'New South Wales', 'NSW', id FROM countries WHERE code = 'AU' 
     ON CONFLICT (name, country_id) DO NOTHING;`,
    
    `INSERT INTO states (name, code, country_id) 
     SELECT 'Victoria', 'VIC', id FROM countries WHERE code = 'AU' 
     ON CONFLICT (name, country_id) DO NOTHING;`,
     
    `INSERT INTO states (name, code, country_id) 
     SELECT 'Queensland', 'QLD', id FROM countries WHERE code = 'AU' 
     ON CONFLICT (name, country_id) DO NOTHING;`,
     
    `INSERT INTO states (name, code, country_id) 
     SELECT 'Western Australia', 'WA', id FROM countries WHERE code = 'AU' 
     ON CONFLICT (name, country_id) DO NOTHING;`,
     
    `INSERT INTO states (name, code, country_id) 
     SELECT 'South Australia', 'SA', id FROM countries WHERE code = 'AU' 
     ON CONFLICT (name, country_id) DO NOTHING;`,
     
    `INSERT INTO states (name, code, country_id) 
     SELECT 'Tasmania', 'TAS', id FROM countries WHERE code = 'AU' 
     ON CONFLICT (name, country_id) DO NOTHING;`,
     
    `INSERT INTO states (name, code, country_id) 
     SELECT 'Northern Territory', 'NT', id FROM countries WHERE code = 'AU' 
     ON CONFLICT (name, country_id) DO NOTHING;`,
     
    `INSERT INTO states (name, code, country_id) 
     SELECT 'Australian Capital Territory', 'ACT', id FROM countries WHERE code = 'AU' 
     ON CONFLICT (name, country_id) DO NOTHING;`
  ];
  
  // Execute each statement
  for (let i = 0; i < sqlStatements.length; i++) {
    const sql = sqlStatements[i];
    console.log(`⚡ Step ${i + 1}/${sqlStatements.length}: ${sql.split('\\n')[0].substring(0, 50)}...`);
    
    try {
      const { data, error } = await supabase.rpc('exec', { sql });
      
      if (error) {
        console.log(`❌ Error: ${error.message}`);
        // Continue for "already exists" errors
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate') ||
            error.code === '23505') {
          console.log('   ⚠️ Continuing (table/data already exists)...');
        } else {
          throw error;
        }
      } else {
        console.log('   ✅ Success');
      }
    } catch (err) {
      console.log(`❌ Failed at step ${i + 1}:`, err.message);
      return false;
    }
  }
  
  console.log('🎉 Schema creation completed!');
  return true;
}

createSchema().then(success => {
  if (success) {
    console.log('✅ Database is ready for data import!');
  } else {
    console.log('💥 Schema creation failed');
  }
  process.exit(success ? 0 : 1);
});