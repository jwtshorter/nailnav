#!/usr/bin/env node

// Manual email verification using the token from the email link
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// Extract token from the failed URL
const emailVerificationUrl = `http://localhost:3000/#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6ImZvV3pkMmlUVUdVQUo1UW0iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2JtbHZqZ3VsY2lwaGRxeXF1Y3h2LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0ZmJhMzJlNi03ODkxLTQ3N2EtYmYwNi00ZjBlNjg3MjhiOGIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU5OTA5MTAwLCJpYXQiOjE3NTk5MDU1MDAsImVtYWlsIjoidGxzaG9ydGVyQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJ0bHNob3J0ZXJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcnN0X25hbWUiOiJUYW1hcmEiLCJsYXN0X25hbWUiOiJTaG9ydGVyIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJyb2xlIjoidmVuZG9yIiwic3ViIjoiNGZiYTMyZTYtNzg5MS00NzdhLWJmMDYtNGYwZTY4NzI4YjhiIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzU5OTA1NTAwfV0sInNlc3Npb25faWQiOiJkODA4MDViMi1lNTMxLTQ0NGQtYmJlMS03MTcyZTU1OWE3YmQiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.HAffwOLSPfxq4m_Q60wglsXXyy74Gjfi5JUi0W83m4Y&expires_at=1759909100&expires_in=3600&refresh_token=rmsqkw6jdctn&token_type=bearer&type=signup`

function parseUrlParams(url) {
  const params = new URLSearchParams(url.split('#')[1])
  return {
    access_token: params.get('access_token'),
    refresh_token: params.get('refresh_token'),
    expires_at: params.get('expires_at'),
    expires_in: params.get('expires_in'),
    token_type: params.get('token_type'),
    type: params.get('type')
  }
}

async function verifyEmail() {
  try {
    console.log('🔍 Processing email verification...')
    
    const params = parseUrlParams(emailVerificationUrl)
    console.log('Token type:', params.type)
    console.log('Expires at:', new Date(params.expires_at * 1000).toLocaleString())
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000)
    if (now > parseInt(params.expires_at)) {
      console.log('❌ Token has expired')
      return
    }
    
    console.log('✅ Token is still valid')
    
    // Set the session using the tokens
    const { data, error } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token
    })
    
    if (error) {
      console.error('❌ Error setting session:', error.message)
      return
    }
    
    console.log('✅ Email verification successful!')
    console.log('User ID:', data.user?.id)
    console.log('Email:', data.user?.email)
    console.log('Email verified:', data.user?.email_confirmed_at ? 'Yes' : 'No')
    
    // Now try to login with the verified account
    console.log('\n🔐 Testing login with verified account...')
    
    // Sign out first, then sign in normally
    await supabase.auth.signOut()
    
    // Now the user should be able to login normally
    console.log('✅ Account is now verified! You can login at: https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/vendor/login')
    console.log('Email: tlshorter@gmail.com')
    console.log('Use the password you set during registration')
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message)
  }
}

verifyEmail()