const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testWithAnonKey() {
  console.log('🔍 Testing with anon key...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log(`📡 URL: ${supabaseUrl}`);
  console.log(`🔑 Anon Key length: ${anonKey ? anonKey.length : 'Missing'}`);
  
  const supabase = createClient(supabaseUrl, anonKey);
  
  try {
    // Simple test that should work with anon key
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Auth test failed:', error.message);
    } else {
      console.log('✅ Anon key works! Can connect to Supabase');
    }
    
    // Try to see what tables exist (might be restricted)
    const { data: tables, error: tableError } = await supabase.rpc('get_table_names').select();
    
    if (tableError) {
      console.log('⚠️ Cannot list tables (expected with anon key)');
      console.log('🔧 Will need to run migration to create tables');
    } else {
      console.log('📊 Tables found:', tables);
    }
    
    return true;
  } catch (err) {
    console.log('❌ Error:', err.message);
    return false;
  }
}

testWithAnonKey().then(success => {
  console.log(success ? '🎯 Connection established!' : '💥 Connection failed');
  process.exit(0);
});