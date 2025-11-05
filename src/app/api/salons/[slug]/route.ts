import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    // Fetch salon by slug with city join - UPDATED with all Excel columns
    const { data: salon, error } = await supabase
      .from('salons')
      .select(`
        id,
        name,
        slug,
        address,
        city_id,
        cities (
          name
        ),
        state,
        phone,
        website,
        email,
        description,
        rating,
        review_count,
        is_verified,
        is_featured,
        is_published,
        parking,
        accepts_walk_ins,
        wheelchair_accessible,
        opening_hours,
        latitude,
        longitude,
        manicure,
        gel_manicure,
        gel_extensions,
        acrylic_nails,
        pedicure,
        gel_pedicure,
        sns_dip_powder,
        builders_gel_biab,
        nail_art,
        massage,
        facials,
        lash_extensions,
        lash_lift_tint,
        brows,
        waxing,
        injectables,
        tanning,
        cosmetic_tattoo,
        haircuts,
        spa_hand_foot_treatment,
        english,
        spanish,
        vietnamese,
        chinese,
        korean,
        qualified_technicians,
        experienced_team,
        quick_service,
        award_winning_staff,
        master_nail_artist,
        bridal_nails,
        appointment_required,
        walk_ins_welcome,
        group_bookings,
        mobile_nails,
        child_friendly,
        adult_only,
        pet_friendly,
        lgbtqi_friendly,
        complimentary_drink,
        heated_massage_chairs,
        foot_spas,
        free_wifi,
        autoclave_sterilisation,
        led_curing,
        clean_ethical_products,
        vegan_polish,
        price_range,
        cover_image_url,
        gallery_images,
        about,
        review_summary,
        customers_saying,
        health_wellbeing_care,
        created_at
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Salon not found' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      )
    }

    if (!salon) {
      return NextResponse.json(
        { error: 'Salon not found' },
        { status: 404 }
      )
    }

    // Transform salon data with EXACT Excel mappings
    const transformedSalon = {
      ...salon,
      city: (salon as any).cities?.name || 'Unknown',
      // Build services array from boolean flags
      services: [
        { name: 'Manicure', available: salon.manicure, category: 'Manicures' },
        { name: 'Gel Manicure', available: salon.gel_manicure, category: 'Manicures' },
        { name: 'Gel Extensions', available: salon.gel_extensions, category: 'Extensions' },
        { name: 'Acrylic Nails', available: salon.acrylic_nails, category: 'Extensions' },
        { name: 'Pedicure', available: salon.pedicure, category: 'Pedicures' },
        { name: 'Gel Pedicure', available: salon.gel_pedicure, category: 'Pedicures' },
        { name: 'SNS Dip Powder', available: salon.sns_dip_powder, category: 'Manicures' },
        { name: 'Builders Gel / BIAB', available: salon.builders_gel_biab, category: 'Manicures' },
        { name: 'Nail Art', available: salon.nail_art, category: 'Nail Art' },
        { name: 'Massage', available: salon.massage, category: 'Other Services' },
        { name: 'Facials', available: salon.facials, category: 'Other Services' },
        { name: 'Lash Extensions', available: salon.lash_extensions, category: 'Other Services' },
        { name: 'Lash Lift and Tint', available: salon.lash_lift_tint, category: 'Other Services' },
        { name: 'Brows', available: salon.brows, category: 'Other Services' },
        { name: 'Waxing', available: salon.waxing, category: 'Other Services' },
        { name: 'Injectables', available: salon.injectables, category: 'Other Services' },
        { name: 'Tanning', available: salon.tanning, category: 'Other Services' },
        { name: 'Cosmetic Tattoo', available: salon.cosmetic_tattoo, category: 'Other Services' },
        { name: 'Haircuts', available: salon.haircuts, category: 'Other Services' },
        { name: 'Spa Hand and Foot Treatment', available: salon.spa_hand_foot_treatment, category: 'Treatments' }
      ].filter(service => service.available).map(service => ({
        id: service.name.toLowerCase().replace(/\s+/g, '-'),
        name: service.name,
        category: service.category,
        price: 45,
        duration: 60,
        description: `Professional ${service.name.toLowerCase()} service`,
        available: true
      })),
      // Build services_offered array
      services_offered: [
        salon.manicure && 'Manicure',
        salon.gel_manicure && 'Gel Manicure',
        salon.gel_extensions && 'Gel Extensions',
        salon.acrylic_nails && 'Acrylic Nails',
        salon.pedicure && 'Pedicure',
        salon.gel_pedicure && 'Gel Pedicure',
        salon.sns_dip_powder && 'SNS Dip Powder',
        salon.builders_gel_biab && 'Builders Gel / BIAB',
        salon.nail_art && 'Nail Art',
        salon.massage && 'Massage',
        salon.facials && 'Facials',
        salon.lash_extensions && 'Lash Extensions',
        salon.lash_lift_tint && 'Lash Lift and Tint',
        salon.brows && 'Brows',
        salon.waxing && 'Waxing',
        salon.injectables && 'Injectables',
        salon.tanning && 'Tanning',
        salon.cosmetic_tattoo && 'Cosmetic Tattoo',
        salon.haircuts && 'Haircuts',
        salon.spa_hand_foot_treatment && 'Spa Hand and Foot Treatment'
      ].filter(Boolean),
      // Build specialties array
      specialties: [
        salon.qualified_technicians && 'Qualified technicians',
        salon.experienced_team && 'Experienced Team',
        salon.quick_service && 'Quick Service',
        salon.award_winning_staff && 'Award winning staff',
        salon.master_nail_artist && 'Master Nail Artist',
        salon.bridal_nails && 'Bridal Nails'
      ].filter(Boolean),
      // Build amenities array
      amenities: [
        salon.child_friendly && 'Child Friendly',
        salon.adult_only && 'Adult Only',
        salon.pet_friendly && 'Pet Friendly',
        salon.lgbtqi_friendly && 'LGBTQI+ Friendly',
        salon.wheelchair_accessible && 'Wheelchair Accessible',
        salon.complimentary_drink && 'Complimentary drink',
        salon.heated_massage_chairs && 'Heated Massage Chairs',
        salon.foot_spas && 'Foot Spas',
        salon.free_wifi && 'Free Wi-fi',
        salon.parking && 'Parking',
        salon.autoclave_sterilisation && 'Autoclave Sterilisation',
        salon.led_curing && 'LED Curing',
        salon.clean_ethical_products && 'Clean & Ethical Products',
        salon.vegan_polish && 'Vegan Polish'
      ].filter(Boolean),
      // Build appointment types array
      appointment_types: [
        salon.appointment_required && 'Appointment Required',
        salon.walk_ins_welcome && 'Walk-ins Welcome',
        salon.group_bookings && 'Group Bookings',
        salon.mobile_nails && 'Mobile Nails'
      ].filter(Boolean),
      // Build languages array
      languages_spoken: [
        salon.english && 'English',
        salon.spanish && 'Spanish',
        salon.vietnamese && 'Vietnamese',
        salon.chinese && 'Chinese',
        salon.korean && 'Korean'
      ].filter(Boolean),
      // FAQ fields
      about: salon.about,
      review_summary: salon.review_summary,
      customers_saying: salon.customers_saying,
      health_wellbeing_care: salon.health_wellbeing_care,
      // NO FAKE DATA - only return what's in database
      average_rating: salon.rating,
      reviews: []
    }

    // Increment view count (fire and forget)
    supabase
      .from('salons')
      .update({ view_count: (salon as any).view_count + 1 || 1 })
      .eq('id', salon.id)
      .then()
      .catch(err => console.error('Failed to increment view count:', err))

    return NextResponse.json({
      salon: transformedSalon,
      success: true
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
