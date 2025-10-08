#!/usr/bin/env node

// Fix admin setup for tlshorter@gmail.com
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAdminSetup() {
  try {
    console.log('🔧 Fixing admin setup for tlshorter@gmail.com...')
    
    const adminEmail = 'tlshorter@gmail.com'
    
    // Get all vendor applications to see the current state
    console.log('1️⃣ Checking existing vendor applications...')
    
    const { data: allApps, error: allAppsError } = await supabase
      .from('vendor_applications')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (allAppsError) {
      console.error('❌ Could not fetch vendor applications:', allAppsError.message)
      return
    }
    
    console.log('Found applications:')
    allApps.forEach((app, index) => {
      console.log(`  ${index + 1}. Email: ${app.email}, Salon: ${app.salon_name}, Status: ${app.status}, ID: ${app.id}`)
    })
    
    // Find the tlshorter@gmail.com application
    const adminApp = allApps.find(app => app.email === adminEmail)
    
    if (!adminApp) {
      console.error('❌ No application found for', adminEmail)
      return
    }
    
    console.log('\n2️⃣ Found admin application:')
    console.log('  ID:', adminApp.id)
    console.log('  Email:', adminApp.email)
    console.log('  Salon:', adminApp.salon_name)
    console.log('  Status:', adminApp.status)
    console.log('  User ID:', adminApp.user_id)
    
    // Update this application to admin status
    console.log('\n3️⃣ Updating application to admin status...')
    
    const updateData = {
      status: 'approved',
      salon_name: 'NailNav Admin',
      admin_notes: 'Administrator account - auto-approved for system management',
      updated_at: new Date().toISOString()
    }
    
    const { data: updatedApp, error: updateError } = await supabase
      .from('vendor_applications')
      .update(updateData)
      .eq('id', adminApp.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('❌ Could not update application:', updateError.message)
      return
    }
    
    console.log('✅ Application updated successfully!')
    console.log('  New status:', updatedApp.status)
    console.log('  New salon name:', updatedApp.salon_name)
    
    // Create simple admin config file
    console.log('\n4️⃣ Creating admin configuration file...')
    
    const adminConfigContent = `# NailNav Admin Configuration
# Generated: ${new Date().toISOString()}

ADMIN_USER_ID=${adminApp.user_id || 'pending'}
ADMIN_EMAIL=${adminEmail}
ADMIN_ROLE=admin
ADMIN_PERMISSIONS=manage_vendors,approve_applications,manage_salons,system_admin

# Application Details
ADMIN_APPLICATION_ID=${adminApp.id}
ADMIN_STATUS=approved
ADMIN_SETUP_DATE=${new Date().toISOString()}

# Access URLs
ADMIN_LOGIN_URL=https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/vendor/login
ADMIN_DASHBOARD_URL=https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/admin/dashboard
VENDOR_MANAGEMENT_URL=https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/admin/vendors
`
    
    require('fs').writeFileSync('/home/user/webapp/ADMIN_CONFIG.env', adminConfigContent)
    
    console.log('✅ Admin configuration saved to ADMIN_CONFIG.env')
    
    console.log('\n🎉 ADMIN SETUP COMPLETED!')
    console.log('👤 Admin User: tlshorter@gmail.com')
    console.log('🔑 Role: System Administrator') 
    console.log('📋 Status: Approved & Active')
    console.log('🆔 Application ID:', adminApp.id)
    
    console.log('\n🚀 Next Steps:')
    console.log('1. Login at: https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/vendor/login')
    console.log('2. Use email: tlshorter@gmail.com')
    console.log('3. Use your existing password')
    console.log('4. You will be redirected to admin dashboard automatically')
    
    console.log('\n📱 Admin Features Available:')
    console.log('- Manage vendor applications')
    console.log('- Approve/reject salon listings')
    console.log('- System administration')
    console.log('- User management')
    
  } catch (error) {
    console.error('❌ Error in admin setup:', error.message)
  }
}

fixAdminSetup()