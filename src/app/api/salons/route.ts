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
    
    // Build query with city join
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
        appointment_only,
        opening_hours,
        latitude,
        longitude,
        manicure,
        gel_manicure,
        pedicure,
        gel_pedicure,
        gel_nails,
        gel_x,
        gel_extensions,
        acrylic_nails,
        nail_art,
        nail_extensions,
        dip_powder,
        builders_gel,
        nail_repair,
        massage,
        facials,
        eyelashes,
        brows,
        waxing,
        hair_cuts,
        hand_foot_treatment,
        basic_english,
        fluent_english,
        spanish,
        vietnamese,
        chinese,
        korean,
        master_artist,
        certified_technicians,
        experienced_staff,
        quick_service,
        award_winning_staff,
        bridal_nails,
        appointment_only,
        group_bookings,
        mobile_nails,
        kid_friendly,
        child_play_area,
        adult_only,
        pet_friendly,
        lgbtqi_friendly,
        wheelchair_accessible,
        female_owned,
        minority_owned,
        complimentary_drink,
        heated_massage_chairs,
        foot_spas,
        free_wifi,
        autoclave_sterilisation,
        led_curing,
        non_toxic_treatments,
        eco_friendly_products,
        cruelty_free_products,
        vegan_polish,
        cover_image_url,
        gallery_images,
        price_range,
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
    
    // Service filters - map service names to database boolean columns
    if (services) {
      const serviceList = services.split(',')
      const serviceMap: Record<string, string> = {
        'Manicure': 'manicure',
        'Gel Manicure': 'gel_manicure',
        'Pedicure': 'pedicure',
        'Gel Pedicure': 'gel_pedicure',
        'Gel X': 'gel_x',
        'Gel Extensions': 'gel_extensions',
        'Acrylic Nails': 'acrylic_nails',
        'Nail Art': 'nail_art',
        'Dip Powder': 'dip_powder',
        'Builders Gel': 'builders_gel',
        'Massage': 'massage',
        'Facials': 'facials',
        'Eyelashes': 'eyelashes',
        'Brows': 'brows',
        'Waxing': 'waxing',
        'Hair cuts': 'hair_cuts'
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
        'Kid Friendly': 'kid_friendly',
        'Child Play Area': 'child_play_area',
        'Adult Only': 'adult_only',
        'Pet Friendly': 'pet_friendly',
        'LGBTQI+ Friendly': 'lgbtqi_friendly',
        'Wheelchair Accessible': 'wheelchair_accessible',
        'Female Owned': 'female_owned',
        'Minority Owned': 'minority_owned',
        'Complimentary Drink': 'complimentary_drink',
        'Heated Massage Chairs': 'heated_massage_chairs',
        'Foot Spas': 'foot_spas',
        'Free WiFi': 'free_wifi',
        'Autoclave Sterilisation': 'autoclave_sterilisation',
        'LED Curing': 'led_curing',
        'Non-Toxic Treatments': 'non_toxic_treatments',
        'Eco-Friendly Products': 'eco_friendly_products',
        'Cruelty-Free Products': 'cruelty_free_products',
        'Vegan Polish': 'vegan_polish',
        'Group Bookings': 'group_bookings',
        'Mobile Nails': 'mobile_nails'
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
        'Pedicure': 'pedicure',
        'Gel Pedicure': 'gel_pedicure',
        'Gel X': 'gel_x',
        'Gel Extensions': 'gel_extensions',
        'Acrylic Nails': 'acrylic_nails',
        'Nail Art': 'nail_art',
        'Dip Powder': 'dip_powder',
        'Builders Gel': 'builders_gel',
        'Massage': 'massage',
        'Facials': 'facials',
        'Eyelashes': 'eyelashes',
        'Brows': 'brows',
        'Waxing': 'waxing',
        'Hair cuts': 'hair_cuts'
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
        'Master Nail Artist': 'master_artist',
        'Qualified technicians': 'certified_technicians',
        'Experienced Team': 'experienced_staff',
        'Quick Service': 'quick_service',
        'Award winning staff': 'award_winning_staff',
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
        'Spanish': 'spanish',
        'Vietnamese': 'vietnamese',
        'Chinese': 'chinese',
        'Korean': 'korean'
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
      // Build services from actual database columns only
      services_offered: [
        salon.manicure && 'Manicure',
        salon.pedicure && 'Pedicure',
        salon.gel_nails && 'Gel Nails',
        salon.acrylic_nails && 'Acrylic Nails',
        salon.nail_art && 'Nail Art',
        salon.nail_extensions && 'Nail Extensions',
        salon.dip_powder && 'Dip Powder',
        salon.nail_repair && 'Nail Repair'
      ].filter(Boolean),
      specialties: [
        salon.master_artist && 'Master Nail Artist',
        salon.award_winning_staff && 'Award winning staff',
        salon.experienced_staff && 'Experienced Team',
        salon.certified_technicians && 'Qualified technicians',
        salon.quick_service && 'Quick Service',
        salon.bridal_nails && 'Bridal Nails'
      ].filter(Boolean),
      amenities: [
        salon.complimentary_drink && 'Complimentary drink',
        salon.pet_friendly && 'Pet friendly',
        salon.kid_friendly && 'Kid friendly',
        salon.heated_massage_chairs && 'Heated Massage Chairs',
        salon.eco_friendly_products && 'Eco-friendly products',
        salon.foot_spas && 'Foot Spas',
        salon.free_wifi && 'Free Wi-fi',
        salon.vegan_polish && 'Vegan polish',
        salon.cruelty_free_products && 'Cruelty free products',
        salon.non_toxic_treatments && 'Non-toxic treatments'
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