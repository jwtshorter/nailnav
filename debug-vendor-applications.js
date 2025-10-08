#!/usr/bin/env node

// Debug vendor applications to see current state
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugApplications() {
  try {
    console.log('🔍 Debugging vendor applications...')
    
    // Get all vendor applications
    const { data: allApps, error: appsError } = await supabase
      .from('vendor_applications')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (appsError) {
      console.error('❌ Error fetching applications:', appsError.message)
      return
    }
    
    console.log('\n📋 Current Vendor Applications:')
    console.log('='.repeat(80))
    
    if (allApps.length === 0) {
      console.log('No applications found in database')
      return
    }
    
    allApps.forEach((app, index) => {
      console.log(`\n${index + 1}. Application Details:`)
      console.log(`   ID: ${app.id}`)
      console.log(`   Email: ${app.email}`)
      console.log(`   User ID: ${app.user_id || 'NOT SET'}`)
      console.log(`   Salon Name: ${app.salon_name}`)
      console.log(`   Status: ${app.status}`)
      console.log(`   Owner: ${app.owner_name}`)
      console.log(`   Location: ${app.city}, ${app.state}`)
      console.log(`   Created: ${new Date(app.created_at).toLocaleString()}`)
      console.log(`   Updated: ${new Date(app.updated_at || app.created_at).toLocaleString()}`)
      if (app.admin_notes) {
        console.log(`   Admin Notes: ${app.admin_notes}`)
      }
    })
    
    console.log('\n🔍 Checking for missing user_id links...')
    const appsWithoutUserId = allApps.filter(app => !app.user_id)
    
    if (appsWithoutUserId.length > 0) {
      console.log(`\n⚠️  Found ${appsWithoutUserId.length} applications without user_id:`)
      appsWithoutUserId.forEach((app, index) => {
        console.log(`   ${index + 1}. ${app.email} - ${app.salon_name} (ID: ${app.id})`)
      })
      console.log('\n💡 These will be linked automatically when the users log in.')
    } else {
      console.log('✅ All applications have user_id links')
    }
    
    console.log('\n🎯 Admin Applications:')
    const adminApps = allApps.filter(app => 
      app.salon_name?.toLowerCase().includes('admin') || 
      app.email === 'tlshorter@gmail.com'
    )
    
    if (adminApps.length > 0) {
      adminApps.forEach(app => {
        console.log(`   ✅ Admin: ${app.email} - ${app.salon_name} (Status: ${app.status})`)
      })
    } else {
      console.log('   ❌ No admin applications found')
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message)
  }
}

debugApplications()