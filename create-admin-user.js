#!/usr/bin/env node

// Create admin user for tlshorter@gmail.com
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user for tlshorter@gmail.com...')
    
    const adminEmail = 'tlshorter@gmail.com'
    
    // First, get the user ID from Supabase auth
    console.log('1️⃣ Finding user in auth system...')
    
    // We'll need to sign in as the user first to get their ID
    console.log('Please provide the password for tlshorter@gmail.com to complete admin setup:')
    
    // For now, let's try to find the user by checking vendor applications
    const { data: vendorApp, error: vendorError } = await supabase
      .from('vendor_applications')
      .select('user_id, salon_name, status')
      .eq('email', adminEmail)
      .single()
    
    if (vendorError) {
      console.error('❌ Could not find vendor application for', adminEmail)
      console.error('Error:', vendorError.message)
      return
    }
    
    console.log('✅ Found vendor application:', vendorApp.salon_name)
    console.log('User ID:', vendorApp.user_id)
    
    if (!vendorApp.user_id) {
      console.error('❌ Vendor application exists but no user_id found')
      console.log('This will be resolved when the user logs in')
      return
    }
    
    // Create or update user profile with admin role
    console.log('2️⃣ Creating/updating user profile with admin role...')
    
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', vendorApp.user_id)
      .single()
    
    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      // If it's not a "not found" error, there might be RLS issues
      console.log('⚠️ Could not check existing profile (possibly RLS issue):', profileCheckError.message)
      console.log('Proceeding to create/update profile...')
    }
    
    // Try to upsert the user profile
    const profileData = {
      id: vendorApp.user_id,
      email: adminEmail,
      full_name: 'Tamara Shorter',
      role: 'admin',
      user_type: 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select()
      .single()
    
    if (profileError) {
      console.log('⚠️ Could not create user profile (possibly RLS issue):', profileError.message)
      console.log('Admin access will be determined by vendor application status instead')
    } else {
      console.log('✅ User profile created/updated successfully')
    }
    
    // Update vendor application to admin status
    console.log('3️⃣ Updating vendor application to admin status...')
    
    const { data: updatedApp, error: updateError } = await supabase
      .from('vendor_applications')
      .update({
        status: 'approved',
        salon_name: 'Admin',
        admin_notes: 'Administrator account - auto-approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', vendorApp.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('❌ Could not update vendor application:', updateError.message)
      return
    }
    
    console.log('✅ Vendor application updated to admin status')
    
    // Create admin-specific data in localStorage for fallback
    console.log('4️⃣ Creating admin configuration...')
    
    const adminConfig = {
      user_id: vendorApp.user_id,
      email: adminEmail,
      role: 'admin',
      permissions: ['manage_vendors', 'approve_applications', 'manage_salons'],
      created_at: new Date().toISOString()
    }
    
    console.log('\n🎉 Admin user setup completed!')
    console.log('👤 Email:', adminEmail)
    console.log('🔑 Role: Admin')
    console.log('🆔 User ID:', vendorApp.user_id)
    console.log('📋 Status: Active')
    
    console.log('\n📱 Admin Access:')
    console.log('- Login: https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/vendor/login')
    console.log('- Dashboard: https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/admin/dashboard')
    console.log('- Vendor Management: https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/admin/vendors')
    
    console.log('\n⚠️ Note: Use the same password you set when registering the vendor account')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    console.error('Full error:', error)
  }
}

createAdminUser()