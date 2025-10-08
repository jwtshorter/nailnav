#!/usr/bin/env node

// Test if there are existing users and try login with Test Salon6 account
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testExistingUser() {
  try {
    console.log('🔍 Testing existing user login...')
    
    // Check if user_profiles table exists and has any records
    console.log('1️⃣ Checking user_profiles table...')
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(5)
    
    if (profileError) {
      console.log('Profile error:', profileError.message)
    } else {
      console.log('Found profiles:', profiles?.length || 0)
      profiles?.forEach(profile => {
        console.log(`  - ID: ${profile.id}, Role: ${profile.role}`)
      })
    }
    
    // Check vendor_applications table
    console.log('2️⃣ Checking vendor_applications table...')
    const { data: applications, error: appError } = await supabase
      .from('vendor_applications')
      .select('*')
      .limit(5)
    
    if (appError) {
      console.log('Application error:', appError.message)
    } else {
      console.log('Found applications:', applications?.length || 0)
      applications?.forEach(app => {
        console.log(`  - Email: ${app.email}, Salon: ${app.salon_name}, Status: ${app.status}`)
      })
    }
    
    // Try to get all auth users (if we have permissions)
    console.log('3️⃣ Checking auth users...')
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.log('Cannot list auth users (expected, no admin access):', userError.message)
    } else {
      console.log('Found auth users:', users?.length || 0)
      users?.forEach(user => {
        console.log(`  - Email: ${user.email}, Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
      })
    }
    
    console.log('')
    console.log('🎉 Database check completed')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testExistingUser()