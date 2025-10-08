#!/usr/bin/env node

// Test the sign-up flow to identify issues
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🧪 Testing sign-up flow...')
console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('Supabase Key:', supabaseKey ? '✅ Set' : '❌ Missing')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSignupFlow() {
  try {
    console.log('\n1️⃣ Testing database table access...')
    
    // Test if vendor_applications table exists and is accessible
    const { data: tableTest, error: tableError } = await supabase
      .from('vendor_applications')
      .select('id')
      .limit(1)
    
    if (tableError) {
      console.log('❌ Database table error:', tableError.message)
      if (tableError.message.includes('relation "vendor_applications" does not exist')) {
        console.log('🚨 ISSUE FOUND: vendor_applications table does not exist!')
        console.log('📋 SOLUTION: Run database migrations to create the table')
        return
      }
      if (tableError.message.includes('permission denied')) {
        console.log('🚨 ISSUE FOUND: Permission denied accessing vendor_applications table')
        console.log('📋 SOLUTION: Check Row Level Security policies')
        return
      }
    } else {
      console.log('✅ vendor_applications table is accessible')
      console.log('📊 Table has', tableTest?.length || 0, 'records (limited to 1 for test)')
    }

    console.log('\n2️⃣ Testing auth user creation (simulated)...')
    
    // Test creating a vendor application entry (without auth)
    const testApplication = {
      salon_name: 'Test Salon Flow',
      business_address: '123 Test Street',
      city: 'Test City',
      state: 'CA',
      country: 'US',
      postal_code: '12345',
      owner_name: 'Test Owner',
      email: 'test-flow-' + Date.now() + '@example.com',
      phone: '555-0123',
      website: 'https://testsalon.com',
      status: 'draft',
      draft_data: {
        description: 'Test salon for flow verification',
        services_offered: ['manicures', 'pedicures'],
        specialties: ['nail-care'],
        price_range: 'mid-range',
        price_from: 35.00,
        accepts_walk_ins: true,
        parking_available: false,
        operating_hours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '20:00' },
          saturday: { open: '09:00', close: '18:00' },
          sunday: { open: '10:00', close: '17:00' }
        }
      }
    }

    console.log('\n3️⃣ Testing vendor application creation...')
    const { data: applicationData, error: applicationError } = await supabase
      .from('vendor_applications')
      .insert(testApplication)
      .select()
      .single()

    if (applicationError) {
      console.log('❌ Error creating vendor application:', applicationError.message)
      console.log('🚨 ISSUE FOUND: Cannot create vendor applications')
      
      if (applicationError.message.includes('duplicate key')) {
        console.log('📋 SOLUTION: Email already exists, this is expected behavior')
      } else if (applicationError.message.includes('permission denied')) {
        console.log('📋 SOLUTION: Check RLS policies for INSERT permission')
      } else {
        console.log('📋 SOLUTION: Check database schema and constraints')
      }
      return
    }

    console.log('✅ Vendor application created successfully!')
    console.log('📋 Application ID:', applicationData.id)
    
    // Clean up test data
    console.log('\n4️⃣ Cleaning up test data...')
    const { error: deleteError } = await supabase
      .from('vendor_applications')
      .delete()
      .eq('id', applicationData.id)
    
    if (deleteError) {
      console.log('⚠️ Warning: Could not delete test data:', deleteError.message)
    } else {
      console.log('✅ Test data cleaned up')
    }
    
    console.log('\n🎉 RESULT: Sign-up flow should work correctly!')
    console.log('📋 The issue may be:')
    console.log('   - Timing issue between auth creation and application creation')
    console.log('   - User_id not being properly set during registration')
    console.log('   - User navigating to dashboard before application is fully created')

  } catch (error) {
    console.error('\n💥 Unexpected error:', error.message)
  }
}

testSignupFlow()