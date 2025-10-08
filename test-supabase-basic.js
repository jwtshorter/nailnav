#!/usr/bin/env node

// Test basic Supabase connection and auth
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection')
console.log('URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT FOUND')
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 30)}...` : 'NOT FOUND')
console.log('')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables not loaded properly')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...')
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error && error.code !== '42P01') {
      throw error
    }
    console.log('✅ Basic connection works (table exists or expected 404)')
    
    // Test 2: Auth status
    console.log('2️⃣ Testing auth status...')
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Current session:', session ? 'Active' : 'None')
    
    // Test 3: Try signing up a test user
    console.log('3️⃣ Testing auth signup...')
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    })
    
    if (signUpError) {
      console.log('Signup error (expected):', signUpError.message)
    } else {
      console.log('✅ Signup works, user ID:', signUpData.user?.id)
    }
    
    console.log('')
    console.log('🎉 Supabase connection test completed')
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    console.error('Full error:', error)
  }
}

testConnection()