import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '8')

    // Fetch featured salons (top rated salons) with city join
    const { data: salons, error } = await supabase
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
        is_verified,
        is_featured,
        parking,
        accepts_walk_ins,
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
        price_range,
        review_count
      `)
      .eq('is_published', true)
      .order('rating', { ascending: false })
      .order('name', { ascending: true })
      .limit(limit)

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

    // If no salons found, return empty array
    if (!salons || salons.length === 0) {
      console.log('No salons found in database')
      return NextResponse.json({
        salons: [],
        count: 0,
        success: true
      })
    }

    // Transform salons - ONLY RETURN REAL DATA FROM DATABASE
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
      is_verified: salon.is_verified,
      is_featured: salon.is_featured,
      parking: salon.parking,
      accepts_walk_ins: salon.accepts_walk_ins,
      latitude: salon.latitude,
      longitude: salon.longitude,
      cover_image_url: salon.cover_image_url,
      gallery_images: salon.gallery_images,
      price_range: salon.price_range,
      review_count: salon.review_count,
      // Build service arrays from actual database flags
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
      count: transformedSalons.length,
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
