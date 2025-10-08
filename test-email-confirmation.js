#!/usr/bin/env node

/**
 * Test if email confirmation is causing signup failures
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testEmailConfirmation() {
  console.log('🧪 Testing Email Confirmation Settings...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Test 1: Try signup with email confirmation disabled
  console.log('1️⃣ Testing signup with different confirmation settings...');
  
  const testEmail = `test-${Date.now()}@example.com`;
  console.log('📧 Test email:', testEmail);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
      options: {
        emailRedirectTo: undefined, // Disable email confirmation
        data: {
          first_name: 'Test',
          last_name: 'User',
          role: 'vendor'
        }
      }
    });

    if (error) {
      console.log('   ❌ Signup failed:', error.message);
      console.log('   🔍 Error code:', error.status);
      console.log('   🔍 Full error:', JSON.stringify(error, null, 2));
      
      if (error.message.includes('Database error saving new user')) {
        console.log('\n💡 This confirms the issue is with the user_profiles trigger/RLS.');
        console.log('   Please run COMPREHENSIVE_DB_FIX.sql in your Supabase SQL Editor.');
        return false;
      }
    } else {
      console.log('   ✅ Signup successful!');
      console.log('   👤 User ID:', data.user?.id);
      console.log('   ✉️ Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
      console.log('   🔗 Session:', data.session ? 'Created' : 'Not created');
      return true;
    }

  } catch (err) {
    console.log('   💥 Unexpected error:', err.message);
    return false;
  }
}

// Test 2: Check database tables directly
async function checkDatabaseTables() {
  console.log('\n2️⃣ Checking Database Tables...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test user_profiles table
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });

    if (profileError) {
      console.log('   ❌ user_profiles error:', profileError.message);
    } else {
      console.log('   ✅ user_profiles accessible');
    }

    // Test vendor_applications table  
    const { data: applications, error: appError } = await supabase
      .from('vendor_applications')
      .select('count', { count: 'exact', head: true });

    if (appError) {
      console.log('   ❌ vendor_applications error:', appError.message);
    } else {
      console.log('   ✅ vendor_applications accessible');
    }

  } catch (err) {
    console.log('   💥 Table check failed:', err.message);
  }
}

// Run tests
testEmailConfirmation()
  .then(success => {
    return checkDatabaseTables().then(() => success);
  })
  .then(success => {
    if (success) {
      console.log('\n🎉 Email/Auth system is working!');
      console.log('The vendor registration should work now.');
    } else {
      console.log('\n❌ Still having issues.');
      console.log('\n🔧 Next steps:');
      console.log('1. Run COMPREHENSIVE_DB_FIX.sql in Supabase SQL Editor');
      console.log('2. Check Supabase Auth settings (disable email confirmation)');
      console.log('3. Verify user_profiles table exists and has proper permissions');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.log(`\n💥 Test failed: ${err.message}`);
    process.exit(1);
  });