const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log(`📡 URL: ${supabaseUrl}`);
  console.log(`🔑 Service Key: ${supabaseServiceKey ? 'Found' : 'Missing'}`);
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing credentials');
    return false;
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Test connection by checking tables
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log(`📊 Found ${data.length} existing tables:`, data.map(t => t.table_name));
    return true;
  } catch (err) {
    console.log('❌ Error:', err.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('🎉 Ready to proceed with migration!');
  } else {
    console.log('💥 Please check your credentials');
  }
  process.exit(success ? 0 : 1);
});