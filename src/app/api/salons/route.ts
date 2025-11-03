import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get('featured') === 'true'
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const verified = searchParams.get('verified') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
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
        pedicure,
        gel_nails,
        acrylic_nails,
        nail_art,
        master_artist,
        certified_technicians,
        experienced_staff,
        cover_image_url,
        gallery_images,
        created_at
      `, { count: 'exact' })
      .eq('is_published', true)
    
    // Apply filters
    if (featured) {
      query = query.eq('is_featured', true)
    }
    
    if (city) {
      // Search by city name - need to join with cities table
      const cityResult = await supabase
        .from('cities')
        .select('id')
        .ilike('name', `%${city}%`)
      
      if (cityResult.data && cityResult.data.length > 0) {
        const cityIds = cityResult.data.map(c => c.id)
        query = query.in('city_id', cityIds)
      }
    }
    
    if (state) {
      query = query.ilike('state', `%${state}%`)
    }
    
    if (verified) {
      query = query.eq('is_verified', true)
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

    // Transform data - ONLY REAL DATA FROM DATABASE
    const transformedSalons = (salons || []).map((salon: any) => ({
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
      // Build services from actual database
      services_offered: [
        salon.manicure && 'Manicure',
        salon.pedicure && 'Pedicure',
        salon.gel_nails && 'Gel Nails',
        salon.acrylic_nails && 'Acrylic Nails',
        salon.nail_art && 'Nail Art'
      ].filter(Boolean),
      specialties: [
        salon.master_artist && 'Master Nail Artist',
        salon.certified_technicians && 'Certified Technicians',
        salon.experienced_staff && 'Experienced Team'
      ].filter(Boolean)
    }))

    return NextResponse.json({ 
      salons: transformedSalons,
      count: count || 0,
      total: count || 0,
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