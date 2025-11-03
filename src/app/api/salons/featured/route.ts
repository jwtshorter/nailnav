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
        gallery_images
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

    // Transform salons
    const transformedSalons = (salons || []).map((salon: any) => ({
      ...salon,
      city: salon.cities?.name || 'Unknown',
      state: 'VIC', // Default to VIC for now
      country: 'Australia',
      postal_code: '3000',
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
      ].filter(Boolean),
      currency: 'AUD',
      languages_spoken: ['English'],
      price_range: 'mid-range',
      price_from: 35,
      average_rating: salon.rating,
      review_count: 0
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
