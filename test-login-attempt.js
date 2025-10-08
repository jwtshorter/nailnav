#!/usr/bin/env node

// Test actual login attempt with the Test Salon6 credentials
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testLogin() {
  try {
    console.log('🔍 Testing login attempt...')
    
    // Try logging in with the Test Salon6 user
    const email = 'test6789@gmail.com'  // From the vendor_applications table
    const password = 'TestPassword123!'  // Common test password
    
    console.log(`1️⃣ Attempting login with: ${email}`)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    
    if (error) {
      console.log('❌ Login failed:', error.message)
      console.log('Error code:', error.code)
      console.log('Error details:', error.details)
      
      // Try different common passwords
      const commonPasswords = ['Password123!', 'TestPass123!', 'Test123!']
      
      for (const pass of commonPasswords) {
        console.log(`\n2️⃣ Trying password: ${pass}`)
        const { data: data2, error: error2 } = await supabase.auth.signInWithPassword({
          email: email,
          password: pass,
        })
        
        if (!error2) {
          console.log('✅ Login successful with password:', pass)
          console.log('User ID:', data2.user?.id)
          return
        } else {
          console.log('❌ Failed:', error2.message)
        }
      }
    } else {
      console.log('✅ Login successful!')
      console.log('User ID:', data.user?.id)
      console.log('User email:', data.user?.email)
      console.log('Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No')
      
      // Check if user has vendor application
      const { data: app, error: appError } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('user_id', data.user.id)
        .single()
      
      if (appError) {
        console.log('No vendor application found:', appError.message)
      } else {
        console.log('✅ Vendor application found:', app.salon_name)
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testLogin()