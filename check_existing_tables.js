const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkTables() {
  console.log('🔍 Checking existing database structure...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const supabase = createClient(supabaseUrl, anonKey);
  
  try {
    // Check if salons table exists
    const { data: salons, error: salonsError } = await supabase
      .from('salons')
      .select('id')
      .limit(1);
    
    if (salonsError) {
      if (salonsError.code === 'PGRST116' || salonsError.message.includes('does not exist')) {
        console.log('❌ Salons table does not exist - need to run migration');
        return false;
      } else {
        console.log('⚠️ Error checking salons table:', salonsError.message);
      }
    } else {
      console.log('✅ Salons table exists');
    }
    
    // Check if countries table exists
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('id')
      .limit(1);
    
    if (countriesError) {
      if (countriesError.code === 'PGRST116' || countriesError.message.includes('does not exist')) {
        console.log('❌ Countries table does not exist - need to run migration');
        return false;
      }
    } else {
      console.log('✅ Countries table exists');
    }
    
    // Check if states table exists
    const { data: states, error: statesError } = await supabase
      .from('states')
      .select('id')
      .limit(1);
    
    if (statesError) {
      if (statesError.code === 'PGRST116' || statesError.message.includes('does not exist')) {
        console.log('❌ States table does not exist - need to run migration');
        return false;
      }
    } else {
      console.log('✅ States table exists');
    }
    
    console.log('🎉 All required tables exist!');
    return true;
    
  } catch (err) {
    console.log('❌ Error:', err.message);
    return false;
  }
}

checkTables().then(exists => {
  if (exists) {
    console.log('🚀 Database is ready! Can proceed with data import.');
  } else {
    console.log('🔧 Need to create database schema first.');
    console.log('💡 This requires service_role access or manual SQL execution.');
  }
  process.exit(0);
});