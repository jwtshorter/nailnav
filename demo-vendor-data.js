#!/usr/bin/env node

// Demo script to populate vendor with sample menu and filter data
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const sampleMenuItems = [
  { id: 'item-1', category: 'Manicures', service: 'Classic Manicure', duration: 45, price: 35, description: 'Traditional nail care with cuticle treatment and polish', isActive: true },
  { id: 'item-2', category: 'Manicures', service: 'Gel Manicure', duration: 60, price: 55, description: 'Long-lasting gel polish that stays chip-free for up to 3 weeks', isActive: true },
  { id: 'item-3', category: 'Manicures', service: 'French Manicure', duration: 50, price: 45, description: 'Classic white-tip French style manicure', isActive: true },
  { id: 'item-4', category: 'Pedicures', service: 'Classic Pedicure', duration: 60, price: 50, description: 'Relaxing foot treatment with exfoliation and polish', isActive: true },
  { id: 'item-5', category: 'Pedicures', service: 'Gel Pedicure', duration: 75, price: 70, description: 'Long-lasting gel polish pedicure with foot massage', isActive: true },
  { id: 'item-6', category: 'Nail Art', service: 'Simple Nail Art', duration: 30, price: 20, description: 'Basic designs and decorations per nail', isActive: true },
  { id: 'item-7', category: 'Nail Art', service: 'Complex Nail Art', duration: 60, price: 45, description: 'Detailed artistic designs and patterns', isActive: true },
  { id: 'item-8', category: 'Extensions', service: 'Acrylic Extensions', duration: 120, price: 85, description: 'Full set of acrylic nail extensions', isActive: false },
  { id: 'item-9', category: 'Add-ons', service: 'Hand Massage', duration: 15, price: 12, description: 'Relaxing hand and arm massage', isActive: true },
  { id: 'item-10', category: 'Add-ons', service: 'Paraffin Treatment', duration: 20, price: 15, description: 'Moisturizing paraffin wax treatment', isActive: true }
]

const sampleFilters = {
  masterNailArtist: true,
  bridalNails: true,
  kidFriendly: true,
  freeWifi: true,
  parkingAvailable: true,
  wheelchairAccessible: false,
  complimentaryBeverage: true,
  heatedMassageChairs: true,
  footSpas: true,
  womanOwned: true,
  nonToxicTreatments: true,
  veganPolish: true,
  equipmentSterilisation: true,
  organicProducts: false,
  ledCuring: true,
  openSaturday: true,
  openSunday: true,
  walkInsWelcome: true,
  appointmentOnly: false,
  groupBookings: true,
  flexibleCancellation: true,
  fixedPricing: true,
  loyaltyDiscounts: true,
  // Set other filters to false
  childPlayArea: false,
  adultOnly: false,
  petFriendly: false,
  lgbtqiFriendly: false,
  minorityOwned: false,
  openLate: false,
  mobileNails: false,
  depositRequired: false
}

async function updateVendorWithSampleData() {
  try {
    console.log('🎯 Adding sample menu and filter data to existing vendor applications...\n')

    // Get existing vendor applications (excluding admin)
    const { data: applications, error } = await supabase
      .from('vendor_applications')
      .select('*')
      .neq('salon_name', 'NailNav Admin')
      .limit(5)

    if (error) {
      console.error('❌ Error fetching applications:', error.message)
      return
    }

    if (!applications || applications.length === 0) {
      console.log('⚠️ No vendor applications found to update')
      return
    }

    console.log(`📋 Found ${applications.length} vendor application(s) to update`)

    for (const app of applications) {
      console.log(`\n🏪 Updating ${app.salon_name}...`)

      const updatedDraftData = {
        ...app.draft_data,
        menu_items: sampleMenuItems,
        filters: sampleFilters,
        description: `Welcome to ${app.salon_name}! We're a full-service nail salon offering premium manicures, pedicures, and nail art in a relaxing spa environment. Our master nail artists use only the highest quality products including non-toxic treatments and vegan polishes. We pride ourselves on cleanliness with full equipment sterilization between each client.`,
        services_offered: ['manicures', 'pedicures', 'gel-polish', 'nail-art', 'extensions'],
        specialties: ['Master Nail Artist', 'Bridal Nails', 'Organic Products'],
        price_range: 'mid-range',
        price_from: 35,
        accepts_walk_ins: true,
        parking_available: true,
        operating_hours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '20:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '10:00', close: '18:00' }
        }
      }

      const { error: updateError } = await supabase
        .from('vendor_applications')
        .update({ 
          draft_data: updatedDraftData,
          updated_at: new Date().toISOString()
        })
        .eq('id', app.id)

      if (updateError) {
        console.log(`❌ Error updating ${app.salon_name}:`, updateError.message)
      } else {
        console.log(`✅ ${app.salon_name} updated successfully!`)
        console.log(`   - Added ${sampleMenuItems.length} menu items`)
        console.log(`   - Added ${Object.values(sampleFilters).filter(Boolean).length} active filters`)
        console.log(`   - Enhanced description and features`)
      }
    }

    console.log('\n🎉 Sample data update complete!')
    console.log('\n📋 What was added:')
    console.log('✅ 10 menu items across 5 categories (Manicures, Pedicures, Nail Art, Extensions, Add-ons)')
    console.log('✅ 31 filter options with realistic salon features enabled')
    console.log('✅ Enhanced salon descriptions')
    console.log('✅ Updated operating hours and pricing')
    
    console.log('\n🌐 To see the changes:')
    console.log('1. Visit the vendor dashboard: /vendor/dashboard')
    console.log('2. Check the menu management: /vendor/menu') 
    console.log('3. View public salon pages to see filters and menu displayed')

  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

updateVendorWithSampleData()