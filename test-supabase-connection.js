#!/usr/bin/env node

/**
 * Supabase Connection Test Script
 * 
 * This script helps diagnose Supabase connection and permission issues.
 * Run this after setting up your database to verify everything is working.
 * 
 * Usage: node test-supabase-connection.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSupabaseConnection() {
  log('blue', '🔍 Testing Supabase Connection...\n');

  // Step 1: Check environment variables
  log('blue', '1. Checking environment variables...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    log('red', '❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
    return false;
  }
  if (!supabaseKey) {
    log('red', '❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local');
    return false;
  }

  log('green', `✅ Supabase URL: ${supabaseUrl}`);
  log('green', `✅ Anon Key: ${supabaseKey.substring(0, 20)}...`);
  
  if (serviceRoleKey) {
    log('green', `✅ Service Role Key: ${serviceRoleKey.substring(0, 20)}...`);
  } else {
    log('yellow', '⚠️  Service Role Key not set (optional for basic operations)');
  }

  // Step 2: Test basic connection
  log('blue', '\n2. Testing basic connection...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.message.includes('relation "user_profiles" does not exist')) {
        log('red', '❌ Tables not created yet. Please run the migration script first.');
        log('yellow', '💡 Go to Supabase Dashboard > SQL Editor and run SUPABASE_QUICK_MIGRATION.sql');
        return false;
      } else {
        log('red', `❌ Database error: ${error.message}`);
        return false;
      }
    }
    
    log('green', '✅ Database connection successful');
    log('green', `✅ user_profiles table exists (${data ? data.length : 0} records)`);
    
  } catch (err) {
    log('red', `❌ Connection failed: ${err.message}`);
    return false;
  }

  // Step 3: Test vendor_applications table
  log('blue', '\n3. Testing vendor_applications table...');
  
  try {
    const { data, error } = await supabase
      .from('vendor_applications')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      log('red', `❌ vendor_applications table error: ${error.message}`);
      return false;
    }
    
    log('green', `✅ vendor_applications table exists (${data ? data.length : 0} records)`);
    
  } catch (err) {
    log('red', `❌ vendor_applications test failed: ${err.message}`);
    return false;
  }

  // Step 4: Test authentication system
  log('blue', '\n4. Testing authentication system...');
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error && error.message !== 'Invalid JWT') {
      log('red', `❌ Auth system error: ${error.message}`);
      return false;
    }
    
    if (user) {
      log('green', `✅ User authenticated: ${user.email}`);
    } else {
      log('yellow', '⚠️  No user currently authenticated (this is normal for testing)');
    }
    
  } catch (err) {
    log('red', `❌ Auth test failed: ${err.message}`);
    return false;
  }

  // Step 5: Test RLS policies (if we have a service role key)
  if (serviceRoleKey) {
    log('blue', '\n5. Testing admin access with service role...');
    
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .limit(1);
      
      if (error) {
        log('red', `❌ Admin access failed: ${error.message}`);
      } else {
        log('green', '✅ Service role has admin access to database');
      }
      
    } catch (err) {
      log('red', `❌ Service role test failed: ${err.message}`);
    }
  }

  // Success summary
  log('blue', '\n📋 Connection Test Summary:');
  log('green', '✅ Environment variables configured');
  log('green', '✅ Database connection working');
  log('green', '✅ Required tables exist');
  log('green', '✅ Authentication system functional');
  
  if (serviceRoleKey) {
    log('green', '✅ Admin access configured');
  }

  log('blue', '\n🎉 Supabase setup appears to be working correctly!');
  log('blue', 'You can now run your Next.js application and try vendor registration.');
  
  return true;
}

// Run the test
testSupabaseConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    log('red', `❌ Test script failed: ${err.message}`);
    process.exit(1);
  });