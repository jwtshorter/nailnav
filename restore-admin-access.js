#!/usr/bin/env node

// Restore admin access for tlshorter@gmail.com after delete/recreate
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function restoreAdminAccess() {
  try {
    console.log('🔧 Restoring admin access for tlshorter@gmail.com...')
    
    const adminEmail = 'tlshorter@gmail.com'
    const adminUserId = '4fba32e6-7891-477a-bf06-4f0e68728b8b' // Known user ID
    
    // Check current state
    console.log('1️⃣ Checking current application state...')
    const { data: currentApp, error: currentError } = await supabase
      .from('vendor_applications')
      .select('*')
      .eq('email', adminEmail)
      .single()
    
    if (currentError && currentError.code !== 'PGRST116') {
      console.error('❌ Error checking current state:', currentError.message)
      return
    }
    
    if (currentApp) {
      console.log('✅ Found existing application:')
      console.log(`   ID: ${currentApp.id}`)
      console.log(`   Email: ${currentApp.email}`)
      console.log(`   Salon: ${currentApp.salon_name}`)
      console.log(`   Status: ${currentApp.status}`)
      console.log(`   User ID: ${currentApp.user_id || 'NOT SET'}`)
      
      // If user_id is missing, update it
      if (!currentApp.user_id) {
        console.log('2️⃣ Updating user_id for existing application...')
        const { error: updateError } = await supabase
          .from('vendor_applications')
          .update({ user_id: adminUserId })
          .eq('id', currentApp.id)
        
        if (updateError) {
          console.error('❌ Error updating user_id:', updateError.message)
          return
        }
        
        console.log('✅ User ID updated successfully')
      }
      
      // Ensure it's marked as admin and approved
      if (!currentApp.salon_name?.toLowerCase().includes('admin') || currentApp.status !== 'approved') {
        console.log('2️⃣ Updating application to admin status...')
        const { error: adminUpdateError } = await supabase
          .from('vendor_applications')
          .update({
            salon_name: 'NailNav Admin',
            status: 'approved',
            admin_notes: 'Administrator account - restored admin access',
            updated_at: new Date().toISOString()
          })
          .eq('id', currentApp.id)
        
        if (adminUpdateError) {
          console.error('❌ Error updating to admin status:', adminUpdateError.message)
          return
        }
        
        console.log('✅ Application updated to admin status')
      }
      
      console.log('\n🎉 Admin access restored!')
      
    } else {
      console.log('❌ No application found for', adminEmail)
      console.log('2️⃣ Creating new admin application...')
      
      // Create new admin application
      const newAdminApp = {
        user_id: adminUserId,
        salon_name: 'NailNav Admin',
        business_address: '123 Admin Street',
        city: 'Nundah',
        state: 'QLD',
        country: 'AU',
        postal_code: '4012',
        owner_name: 'Tamara Shorter',
        email: adminEmail,
        phone: '+61 400 000 000',
        website: 'https://nailnav.com',
        status: 'approved',
        admin_notes: 'Administrator account - recreated after deletion',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data: newApp, error: createError } = await supabase
        .from('vendor_applications')
        .insert(newAdminApp)
        .select()
        .single()
      
      if (createError) {
        console.error('❌ Error creating admin application:', createError.message)
        return
      }
      
      console.log('✅ New admin application created:')
      console.log(`   ID: ${newApp.id}`)
      console.log(`   Salon: ${newApp.salon_name}`)
      console.log(`   Status: ${newApp.status}`)
      
      console.log('\n🎉 Admin access fully restored!')
    }
    
    // Verify access
    console.log('\n3️⃣ Verifying admin access...')
    const { data: verifyApp } = await supabase
      .from('vendor_applications')
      .select('*')
      .eq('email', adminEmail)
      .single()
    
    if (verifyApp && verifyApp.user_id === adminUserId && verifyApp.status === 'approved') {
      console.log('✅ Admin access verification successful!')
      console.log('\n🚀 You can now login at:')
      console.log('   URL: https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/vendor/login')
      console.log('   Email: tlshorter@gmail.com')
      console.log('   Will auto-redirect to admin dashboard')
    } else {
      console.log('❌ Admin access verification failed')
    }
    
  } catch (error) {
    console.error('❌ Error restoring admin access:', error.message)
  }
}

restoreAdminAccess()