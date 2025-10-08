#!/usr/bin/env node

// Test user_id mapping in vendor applications
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testUserIdMapping() {
  try {
    console.log('🔍 Testing user_id mapping issues...\n')

    // Check existing applications
    console.log('1️⃣ Checking existing vendor applications...')
    const { data: applications, error: appsError } = await supabase
      .from('vendor_applications')
      .select('id, email, user_id, salon_name, status')
      .order('created_at', { ascending: false })
      .limit(10)

    if (appsError) {
      console.log('❌ Error fetching applications:', appsError.message)
      return
    }

    console.log('📊 Recent applications:')
    applications.forEach((app, index) => {
      console.log(`   ${index + 1}. ${app.salon_name} (${app.email})`)
      console.log(`      User ID: ${app.user_id || 'NULL ⚠️'}`)
      console.log(`      Status: ${app.status}`)
    })

    // Check for applications with missing user_id
    const appsWithoutUserId = applications.filter(app => !app.user_id)
    if (appsWithoutUserId.length > 0) {
      console.log('\n🚨 ISSUE FOUND: Applications with missing user_id:')
      appsWithoutUserId.forEach(app => {
        console.log(`   - ${app.salon_name} (${app.email}) - ID: ${app.id}`)
      })
      console.log('\n📋 This explains why new signups see "No Application"!')
      console.log('💡 The registration creates the application but user_id is not set properly')
    }

    console.log('\n2️⃣ Testing auth user lookup...')
    
    // Simulate what happens when a user logs in
    console.log('🔄 Simulating dashboard access for user without proper user_id...')
    
    if (appsWithoutUserId.length > 0) {
      const testApp = appsWithoutUserId[0]
      console.log(`📧 Testing lookup by email: ${testApp.email}`)
      
      // This is what the dashboard does when user_id lookup fails
      const { data: emailLookup, error: emailError } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('email', testApp.email)
        .single()

      if (emailLookup) {
        console.log('✅ Email lookup successful - this should work in dashboard')
        console.log('🔧 Dashboard should update user_id automatically')
      } else {
        console.log('❌ Email lookup failed:', emailError?.message)
      }
    }

    console.log('\n3️⃣ Checking auth users...')
    try {
      // This will only work with service role key, but let's try
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authUsers) {
        console.log('✅ Auth users accessible:')
        authUsers.users.slice(0, 5).forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.email} - ID: ${user.id}`)
        })
      }
    } catch (authError) {
      console.log('⚠️ Cannot access auth users (expected with anon key)')
      console.log('   This is normal - need service role key for auth admin')
    }

    console.log('\n🎯 LIKELY ROOT CAUSE:')
    console.log('   1. Registration creates auth user successfully')
    console.log('   2. Registration creates vendor application with user_id')
    console.log('   3. But there might be an RLS policy preventing the user from seeing their own application')
    console.log('   4. OR the user_id is not being set correctly during registration')
    
    console.log('\n💡 SOLUTIONS:')
    console.log('   1. Check RLS policies on vendor_applications table')
    console.log('   2. Add delay before redirect in registration (increase from 500ms to 2000ms)')
    console.log('   3. Add better error handling in dashboard for sync delays')
    console.log('   4. Fix user_id mapping for existing applications')

  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

testUserIdMapping()