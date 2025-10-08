#!/usr/bin/env node

/**
 * Test Script for Vendor Registration Process
 * 
 * This simulates the exact steps that happen during vendor registration
 * to identify where the "Database configuration issue" occurs.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testRegistrationProcess() {
  console.log('🧪 Testing Vendor Registration Process...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Test data - same format as the form
  const testFormData = {
    salonName: 'Test Nail Salon',
    address: '123 Test Street',
    city: 'Test City',
    state: 'CA',
    country: 'US',
    zip: '90210',
    ownerName: 'Test Owner',
    email: `test-${Date.now()}@example.com`, // Unique email
    password: 'TestPassword123!',
    phone: '555-123-4567',
    website: 'testsalon.com'
  };

  console.log('📧 Test email:', testFormData.email);

  try {
    // Step 1: Test creating auth user (this should work)
    console.log('\n1️⃣ Testing Auth User Creation...');
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: testFormData.email,
      password: testFormData.password,
      options: {
        data: {
          first_name: testFormData.ownerName.split(' ')[0],
          last_name: testFormData.ownerName.split(' ').slice(1).join(' '),
          role: 'vendor'
        }
      }
    });

    if (signUpError) {
      console.log('   ❌ Auth signup failed:', signUpError.message);
      return false;
    }

    if (!authData.user) {
      console.log('   ❌ No user returned from signup');
      return false;
    }

    console.log('   ✅ Auth user created:', authData.user.id);
    console.log('   📧 User email confirmed:', authData.user.email_confirmed_at ? 'Yes' : 'No');

    // Step 2: Test if we can access vendor_applications table after auth
    console.log('\n2️⃣ Testing Table Access After Auth...');
    
    // Get current session to check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    console.log('   🔐 Session exists:', session ? 'Yes' : 'No');

    // Test simple select on vendor_applications (should work with RLS)
    const { data: selectTest, error: selectError } = await supabase
      .from('vendor_applications')
      .select('count', { count: 'exact', head: true });

    if (selectError) {
      console.log('   ❌ Table select failed:', selectError.message);
    } else {
      console.log('   ✅ Table select works, count:', selectTest);
    }

    // Step 3: Test inserting vendor application (this is likely failing)
    console.log('\n3️⃣ Testing Vendor Application Insert...');
    
    const vendorApplication = {
      user_id: authData.user.id,
      salon_name: testFormData.salonName,
      business_address: testFormData.address,
      city: testFormData.city,
      state: testFormData.state,
      country: testFormData.country,
      postal_code: testFormData.zip,
      owner_name: testFormData.ownerName,
      email: testFormData.email,
      phone: testFormData.phone,
      website: testFormData.website.startsWith('http') ? testFormData.website : `https://${testFormData.website}`,
      status: 'pending'
    };

    console.log('   📝 Attempting to insert:', {
      user_id: vendorApplication.user_id,
      salon_name: vendorApplication.salon_name,
      email: vendorApplication.email
    });

    const { data: applicationData, error: applicationError } = await supabase
      .from('vendor_applications')
      .insert(vendorApplication)
      .select()
      .single();

    if (applicationError) {
      console.log('   ❌ INSERT FAILED:', applicationError.message);
      console.log('   🔍 Error details:', JSON.stringify(applicationError, null, 2));
      
      // This is likely the "Database configuration issue" error
      return false;
    }

    console.log('   ✅ Application inserted successfully:', applicationData.id);

    // Step 4: Verify the data was inserted
    console.log('\n4️⃣ Verifying Data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('vendor_applications')
      .select('*')
      .eq('id', applicationData.id)
      .single();

    if (verifyError) {
      console.log('   ❌ Verification failed:', verifyError.message);
    } else {
      console.log('   ✅ Data verified:', verifyData.salon_name);
    }

    console.log('\n🎉 REGISTRATION PROCESS SUCCESSFUL!');
    console.log('   • Auth user created');
    console.log('   • Application inserted');
    console.log('   • Data verified');

    return true;

  } catch (err) {
    console.log('\n💥 Process crashed:', err.message);
    return false;
  }
}

// Run the test
testRegistrationProcess()
  .then(success => {
    if (!success) {
      console.log('\n❌ Registration process has issues that need to be fixed.');
      console.log('💡 Common issues:');
      console.log('   • RLS policies blocking unauthenticated inserts');
      console.log('   • Missing database tables');
      console.log('   • Email confirmation required');
      console.log('   • Invalid foreign key constraints');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.log(`\n💥 Test script failed: ${err.message}`);
    process.exit(1);
  });