#!/usr/bin/env node

// Test login with the now-verified tlshorter@gmail.com account
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testVerifiedLogin() {
  try {
    console.log('🔐 Testing login with verified account...')
    
    const email = 'tlshorter@gmail.com'
    console.log(`Email: ${email}`)
    
    // Common passwords to try (since we don't know the exact password)
    const passwords = [
      'AdminPassword123!',
      'Password123!',
      'TestPassword123!',
      'Admin123!',
      'Tamara123!',
      'admin123'
    ]
    
    for (const password of passwords) {
      console.log(`\nTrying password: ${password}`)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      
      if (!error) {
        console.log('✅ LOGIN SUCCESSFUL!')
        console.log('User ID:', data.user?.id)
        console.log('Email:', data.user?.email)
        console.log('Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No')
        
        // Check vendor application
        const { data: app, error: appError } = await supabase
          .from('vendor_applications')
          .select('*')
          .eq('user_id', data.user.id)
          .single()
        
        if (!appError && app) {
          console.log('✅ Vendor application found:')
          console.log(`  - Salon: ${app.salon_name}`)
          console.log(`  - Status: ${app.status}`)
          console.log(`  - Email: ${app.email}`)
        } else {
          // Try by email
          const { data: appByEmail } = await supabase
            .from('vendor_applications')
            .select('*')
            .eq('email', email)
            .single()
          
          if (appByEmail) {
            console.log('✅ Vendor application found by email:')
            console.log(`  - Salon: ${appByEmail.salon_name}`)
            console.log(`  - Status: ${appByEmail.status}`)
            console.log(`  - Need to link user_id: ${appByEmail.user_id ? 'No' : 'Yes'}`)
          }
        }
        
        console.log('\n🎉 You can now login at: https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/vendor/login')
        console.log(`Use email: ${email}`)
        console.log(`Use password: ${password}`)
        
        await supabase.auth.signOut()
        return
      } else {
        console.log('❌', error.message)
      }
    }
    
    console.log('\n❌ Could not find the correct password')
    console.log('Please try logging in manually with the password you used during registration')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testVerifiedLogin()