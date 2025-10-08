const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('URL:', supabaseUrl);
  console.log('Key starts with:', supabaseKey?.substring(0, 20));

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test 1: Simple auth check
    console.log('\n1. Testing auth system...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Auth result:', { user: user?.email || 'none', error: authError?.message || 'none' });

    // Test 2: Try to access user_profiles table
    console.log('\n2. Testing user_profiles table...');
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true });
    console.log('Query result:', { data, error: error?.message || 'none' });

    // Test 3: Try a different approach - check if schema exists
    console.log('\n3. Testing basic database access...');
    const { data: schemaData, error: schemaError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    console.log('Schema check:', { tables: schemaData?.length || 0, error: schemaError?.message || 'none' });

  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

testConnection();