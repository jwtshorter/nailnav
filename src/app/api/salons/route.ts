import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get('featured') === 'true'
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Geographic bounding box parameters for map-based search
    const bounds = searchParams.get('bounds')
    let boundingBox: { north: number; south: number; east: number; west: number } | null = null
    if (bounds) {
      try {
        boundingBox = JSON.parse(bounds)
      } catch (e) {
        console.error('Invalid bounds parameter:', e)
      }
    }
    
    // Filter parameters
    const services = searchParams.get('services')
    const specialties = searchParams.get('specialties')
    const amenities = searchParams.get('amenities')
    const languages = searchParams.get('languages')
    const priceRange = searchParams.get('priceRange')
    const walkIns = searchParams.get('walkIns') === 'true'
    const parking = searchParams.get('parking') === 'true'
    
    // Build query with city join - UPDATED with all Excel columns
    let query = supabase
      .from('salons')
      .select(`
        id,
        name,
        slug,
        city_id,
        cities (
          name
        ),
        state,
        address,
        phone,
        website,
        description,
        rating,
        review_count,
        is_verified,
        is_featured,
        is_published,
        parking,
        accepts_walk_ins,
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
        wheelchair_accessible,
        complimentary_drink,
        heated_massage_chairs,
        foot_spas,
        free_wifi,
        autoclave_sterilisation,
        led_curing,
        clean_ethical_products,
        vegan_polish,
        cover_image_url,
        gallery_images,
        price_range,
        about,
        review_summary,
        customers_saying,
        health_wellbeing_care,
        created_at
      `, { count: 'exact' })
      .eq('is_published', true)
    
    // Apply filters
    if (featured) {
      query = query.eq('is_featured', true)
    }
    
    if (city) {
      // Search by city name - check cities table first
      const cityResult = await supabase
        .from('cities')
        .select('id, name, state_id')
        .ilike('name', `%${city}%`)
      
      if (cityResult.data && cityResult.data.length > 0) {
        // Found matching city/cities - use city_id filter
        const cityIds = cityResult.data.map(c => c.id)
        query = query.in('city_id', cityIds)
      } else {
        // No city found - search in address field for suburbs
        // This handles searches like "Bondi", "Surry Hills", etc.
        query = query.ilike('address', `%${city}%`)
      }
    }
    
    if (state) {
      query = query.ilike('state', `%${state}%`)
    }
    
    // Service filters - map service names to database boolean columns (EXACT Excel match)
    if (services) {
      const serviceList = services.split(',')
      const serviceMap: Record<string, string> = {
        'Manicure': 'manicure',
        'Gel Manicure': 'gel_manicure',
        'Gel Extensions': 'gel_extensions',
        'Acrylic Nails': 'acrylic_nails',
        'Pedicure': 'pedicure',
        'Gel Pedicure': 'gel_pedicure',
        'SNS Dip Powder': 'sns_dip_powder',
        'Builders Gel / BIAB': 'builders_gel_biab',
        'Nail Art': 'nail_art',
        'Massage': 'massage',
        'Facials': 'facials',
        'Lash Exensions': 'lash_extensions',  // typo in Excel
        'Lash Lift and Tint': 'lash_lift_tint',
        'Brows': 'brows',
        'Waxing': 'waxing',
        'Injectables': 'injectables',
        'Tanning': 'tanning',
        'Cosmetic Tatoo': 'cosmetic_tattoo',  // typo in Excel
        'Haircuts': 'haircuts',
        'Spa Hand and Foot Treatment': 'spa_hand_foot_treatment'
      }
      
      // For multiple services, we want salons that have ANY of them (OR logic)
      // We'll filter in memory after fetching results for now
    }
    
    // Price range filter
    if (priceRange) {
      const ranges = priceRange.split(',')
      query = query.in('price_range', ranges)
    }
    
    // Specialty filters - map to database columns
    if (specialties) {
      const specialtyList = specialties.split(',')
      // Similar to services, these map to boolean columns
    }
    
    // Amenity filters
    if (walkIns) {
      query = query.eq('accepts_walk_ins', true)
    }
    
    if (parking) {
      query = query.eq('parking', true)
    }
    
    // Amenity mapping
    if (amenities) {
      const amenityList = amenities.split(',')
      const amenityMap: Record<string, string> = {
        'Child Friendly': 'child_friendly',
        'Adult Only': 'adult_only',
        'Pet Friendly': 'pet_friendly',
        'LGBTQI+ Friendly': 'lgbtqi_friendly',
        'Wheel Chair Accessable': 'wheelchair_accessible',  // typo in Excel
        'Complimentary drink': 'complimentary_drink',
        'Heated Massage Chairs': 'heated_massage_chairs',
        'Foot Spas': 'foot_spas',
        'Free Wi-fi': 'free_wifi',
        'Parking': 'parking',
        'Autoclave sterlisation': 'autoclave_sterilisation',  // typo in Excel
        'LED Curing': 'led_curing',
        'Clean & Ethical Products': 'clean_ethical_products',
        'Vegan Polish': 'vegan_polish'
      }
      
      // Apply each amenity filter
      amenityList.forEach(amenity => {
        const dbColumn = amenityMap[amenity]
        if (dbColumn) {
          query = query.eq(dbColumn, true)
        }
      })
    }
    
    // Geographic bounding box filter (map viewport)
    // This filters salons to only those visible in the current map area
    if (boundingBox) {
      query = query
        .gte('latitude', boundingBox.south)
        .lte('latitude', boundingBox.north)
        .gte('longitude', boundingBox.west)
        .lte('longitude', boundingBox.east)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
    }
    
    // Order and pagination
    query = query
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false })
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1)

    const { data: salons, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          error: 'Database query failed',
          details: error.message 
        },
        { status: 500 }
      )
    }

    // Post-process filters for services and specialties (OR logic)
    let filteredSalons = salons || []
    
    if (services) {
      const serviceList = services.split(',')
      const serviceMap: Record<string, string> = {
        'Manicure': 'manicure',
        'Gel Manicure': 'gel_manicure',
        'Gel Extensions': 'gel_extensions',
        'Acrylic Nails': 'acrylic_nails',
        'Pedicure': 'pedicure',
        'Gel Pedicure': 'gel_pedicure',
        'SNS Dip Powder': 'sns_dip_powder',
        'Builders Gel / BIAB': 'builders_gel_biab',
        'Nail Art': 'nail_art',
        'Massage': 'massage',
        'Facials': 'facials',
        'Lash Exensions': 'lash_extensions',
        'Lash Lift and Tint': 'lash_lift_tint',
        'Brows': 'brows',
        'Waxing': 'waxing',
        'Injectables': 'injectables',
        'Tanning': 'tanning',
        'Cosmetic Tatoo': 'cosmetic_tattoo',
        'Haircuts': 'haircuts',
        'Spa Hand and Foot Treatment': 'spa_hand_foot_treatment'
      }
      
      filteredSalons = filteredSalons.filter((salon: any) => {
        return serviceList.some(service => {
          const dbColumn = serviceMap[service]
          return dbColumn && salon[dbColumn] === true
        })
      })
    }
    
    if (specialties) {
      const specialtyList = specialties.split(',')
      const specialtyMap: Record<string, string> = {
        'Qualified technicians': 'qualified_technicians',
        'Experienced Team': 'experienced_team',
        'Quick Service': 'quick_service',
        'Award winning staff': 'award_winning_staff',
        'Master Nail Artist': 'master_nail_artist',
        'Bridal Nails': 'bridal_nails'
      }
      
      filteredSalons = filteredSalons.filter((salon: any) => {
        return specialtyList.some(specialty => {
          const dbColumn = specialtyMap[specialty]
          return dbColumn && salon[dbColumn] === true
        })
      })
    }
    
    if (languages) {
      const languageList = languages.split(',')
      const languageMap: Record<string, string> = {
        'en': 'english',
        'es': 'spanish',
        'vi': 'vietnamese',
        'zh': 'chinese',
        'ko': 'korean'
      }
      
      filteredSalons = filteredSalons.filter((salon: any) => {
        return languageList.some(language => {
          const dbColumn = languageMap[language]
          return dbColumn && salon[dbColumn] === true
        })
      })
    }

    // Transform data - ONLY REAL DATA FROM DATABASE
    const transformedSalons = (filteredSalons || []).map((salon: any) => ({
      id: salon.id,
      name: salon.name,
      slug: salon.slug,
      city: salon.cities?.name || null,
      state: salon.state,
      address: salon.address,
      phone: salon.phone,
      website: salon.website,
      description: salon.description,
      rating: salon.rating,
      review_count: salon.review_count || 0,
      is_verified: salon.is_verified,
      is_featured: salon.is_featured,
      parking: salon.parking,
      accepts_walk_ins: salon.accepts_walk_ins,
      appointment_only: salon.appointment_only,
      opening_hours: salon.opening_hours,
      latitude: salon.latitude,
      longitude: salon.longitude,
      cover_image_url: salon.cover_image_url,
      gallery_images: salon.gallery_images,
      price_range: salon.price_range,
      // Build services from actual database columns only - EXACT Excel mapping
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
      specialties: [
        salon.qualified_technicians && 'Qualified technicians',
        salon.experienced_team && 'Experienced Team',
        salon.quick_service && 'Quick Service',
        salon.award_winning_staff && 'Award winning staff',
        salon.master_nail_artist && 'Master Nail Artist',
        salon.bridal_nails && 'Bridal Nails'
      ].filter(Boolean),
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
      appointment_types: [
        salon.appointment_required && 'Appointment Required',
        salon.walk_ins_welcome && 'Walk-ins Welcome',
        salon.group_bookings && 'Group Bookings',
        salon.mobile_nails && 'Mobile Nails'
      ].filter(Boolean)
    }))

    return NextResponse.json({ 
      salons: transformedSalons,
      count: transformedSalons.length,
      total: transformedSalons.length,
      limit,
      offset,
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