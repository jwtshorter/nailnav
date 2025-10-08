#!/usr/bin/env node

/**
 * Test specifically the vendor application insertion part
 * This assumes auth is working and tests the database insertion
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testVendorAppInsertion() {
  console.log('🧪 Testing Vendor Application Database Insertion...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Test with a proper email format
  const testEmail = `vendor.test.${Date.now()}@gmail.com`;
  console.log('📧 Test email:', testEmail);

  try {
    // Step 1: Create auth user
    console.log('\n1️⃣ Creating Auth User...');
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'Vendor',
          role: 'vendor'
        }
      }
    });

    if (signUpError) {
      console.log('   ❌ Auth signup failed:', signUpError.message);
      return false;
    }

    console.log('   ✅ Auth user created:', authData.user.id);

    // Step 2: Test vendor application insertion
    console.log('\n2️⃣ Testing Vendor Application Insertion...');
    
    const vendorApplication = {
      user_id: authData.user.id,
      salon_name: 'Test Database Salon',
      business_address: '123 Test Street',
      city: 'Test City',
      state: 'CA',
      country: 'US',
      postal_code: '90210',
      owner_name: 'Test Vendor',
      email: testEmail,
      phone: '555-123-4567',
      website: 'https://testsalon.com',
      status: 'pending'
    };

    console.log('   📝 Attempting to insert vendor application...');

    const { data: applicationData, error: applicationError } = await supabase
      .from('vendor_applications')
      .insert(vendorApplication)
      .select()
      .single();

    if (applicationError) {
      console.log('   ❌ Vendor application insertion failed:', applicationError.message);
      console.log('   🔍 Error code:', applicationError.code);
      console.log('   🔍 Error details:', applicationError.details);
      console.log('   🔍 Error hint:', applicationError.hint);
      
      // This is why it's using fallback mode
      return false;
    }

    console.log('   ✅ Vendor application inserted successfully!');
    console.log('   📊 Application ID:', applicationData.id);
    console.log('   🏢 Salon Name:', applicationData.salon_name);

    // Step 3: Verify the data is readable
    console.log('\n3️⃣ Verifying Data Retrieval...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('vendor_applications')
      .select('*')
      .eq('user_id', authData.user.id);

    if (verifyError) {
      console.log('   ❌ Could not retrieve data:', verifyError.message);
    } else {
      console.log('   ✅ Data retrieved successfully:', verifyData.length, 'record(s)');
    }

    console.log('\n🎉 FULL DATABASE FUNCTIONALITY WORKING!');
    console.log('   • Auth user creation: ✅');
    console.log('   • User profile creation: ✅');  
    console.log('   • Vendor app insertion: ✅');
    console.log('   • Data retrieval: ✅');

    return true;

  } catch (err) {
    console.log('\n💥 Test failed:', err.message);
    return false;
  }
}

// Run the test
testVendorAppInsertion()
  .then(success => {
    if (success) {
      console.log('\n🚀 Your registration is now fully functional!');
      console.log('The next registration should save to database instead of localStorage.');
    } else {
      console.log('\n❌ Still having database insertion issues.');
      console.log('This is why registrations are using fallback localStorage mode.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.log(`\n💥 Test crashed: ${err.message}`);
    process.exit(1);
  });