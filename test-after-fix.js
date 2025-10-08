#!/usr/bin/env node

/**
 * Test Script After API Key Fix
 * 
 * Run this after:
 * 1. Fixing your Supabase API key in .env.local
 * 2. Running the database migration in Supabase SQL Editor
 * 
 * Usage: node test-after-fix.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testEverything() {
  console.log('🧪 Testing Supabase After Fix...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Test 1: API Key Validation
  console.log('1️⃣ Testing API Key...');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key starts with: ${supabaseKey?.substring(0, 30)}...`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test basic connection
    const { data: schemaData, error: schemaError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1);

    if (schemaError) {
      if (schemaError.message.includes('Invalid API key')) {
        console.log('   ❌ API key is still invalid!');
        console.log('   🔧 Please get the correct key from Supabase Dashboard > Settings > API');
        return false;
      }
    }
    console.log('   ✅ API key is working!');
  } catch (err) {
    console.log(`   ❌ Connection failed: ${err.message}`);
    return false;
  }

  // Test 2: Database Tables
  console.log('\n2️⃣ Testing Database Tables...');
  
  try {
    // Test user_profiles
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });

    if (profileError) {
      console.log('   ❌ user_profiles table missing');
      console.log('   🔧 Please run SUPABASE_ENHANCED_MIGRATION.sql in SQL Editor');
      return false;
    }
    console.log('   ✅ user_profiles table exists');

    // Test vendor_applications  
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendor_applications')
      .select('count', { count: 'exact', head: true });

    if (vendorError) {
      console.log('   ❌ vendor_applications table missing');
      console.log('   🔧 Please run SUPABASE_ENHANCED_MIGRATION.sql in SQL Editor');
      return false;
    }
    console.log('   ✅ vendor_applications table exists');

  } catch (err) {
    console.log(`   ❌ Table test failed: ${err.message}`);
    return false;
  }

  // Test 3: API Endpoint
  console.log('\n3️⃣ Testing API Endpoint...');
  
  try {
    const response = await fetch('http://localhost:3000/api/vendor-setup');
    const result = await response.json();

    if (result.success) {
      console.log('   ✅ API endpoint working correctly!');
      console.log(`   📊 Response: ${result.message}`);
    } else {
      console.log('   ❌ API endpoint has issues:');
      console.log(`   📝 Error: ${result.error}`);
      console.log(`   💡 Details: ${result.details}`);
      return false;
    }

  } catch (err) {
    console.log(`   ❌ API test failed: ${err.message}`);
    console.log('   🔧 Make sure your Next.js app is running on port 3000');
    return false;
  }

  // Success!
  console.log('\n🎉 ALL TESTS PASSED!');
  console.log('\n✅ Your setup is now working correctly:');
  console.log('   • Supabase API key is valid');
  console.log('   • Database tables are created');
  console.log('   • API endpoints are responding');
  console.log('   • Ready for vendor registration testing');

  console.log('\n🚀 Next Steps:');
  console.log('   1. Test vendor registration: go to /vendor/register');
  console.log('   2. Create an admin user for approvals');
  console.log('   3. Build the admin dashboard');
  console.log('   4. Continue with payment integration');

  return true;
}

// Run the test
testEverything()
  .then(success => {
    if (!success) {
      console.log('\n❌ Some tests failed. Please fix the issues above and try again.');
      process.exit(1);
    }
    process.exit(0);
  })
  .catch(err => {
    console.log(`\n💥 Test script crashed: ${err.message}`);
    process.exit(1);
  });