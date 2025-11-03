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

    // Fetch salon by slug with city join
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
        phone,
        website,
        email,
        description,
        detailed_description,
        rating,
        is_verified,
        is_featured,
        is_published,
        parking,
        accepts_walk_ins,
        wheelchair_accessible,
        kid_friendly,
        appointment_only,
        online_booking,
        credit_cards_accepted,
        opening_hours,
        latitude,
        longitude,
        manicure,
        pedicure,
        gel_nails,
        acrylic_nails,
        nail_art,
        dip_powder,
        shellac,
        nail_extensions,
        nail_repair,
        cuticle_care,
        master_artist,
        certified_technicians,
        experienced_staff,
        luxury_experience,
        relaxing_atmosphere,
        modern_facilities,
        clean_hygienic,
        friendly_service,
        quick_service,
        premium_products,
        cover_image_url,
        gallery_images,
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

    // Transform salon data
    const transformedSalon = {
      ...salon,
      city: (salon as any).cities?.name || 'Unknown',
      // Build services array from boolean flags
      services: [
        { name: 'Manicure', available: salon.manicure, category: 'Manicures' },
        { name: 'Pedicure', available: salon.pedicure, category: 'Pedicures' },
        { name: 'Gel Nails', available: salon.gel_nails, category: 'Manicures' },
        { name: 'Acrylic Nails', available: salon.acrylic_nails, category: 'Extensions' },
        { name: 'Nail Art', available: salon.nail_art, category: 'Nail Art' },
        { name: 'Dip Powder', available: salon.dip_powder, category: 'Manicures' },
        { name: 'Shellac', available: salon.shellac, category: 'Manicures' },
        { name: 'Nail Extensions', available: salon.nail_extensions, category: 'Extensions' },
        { name: 'Nail Repair', available: salon.nail_repair, category: 'Treatments' },
        { name: 'Cuticle Care', available: salon.cuticle_care, category: 'Treatments' }
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
        salon.pedicure && 'Pedicure',
        salon.gel_nails && 'Gel Nails',
        salon.acrylic_nails && 'Acrylic Nails',
        salon.nail_art && 'Nail Art',
        salon.dip_powder && 'Dip Powder',
        salon.shellac && 'Shellac',
        salon.nail_extensions && 'Nail Extensions',
        salon.nail_repair && 'Nail Repair',
        salon.cuticle_care && 'Cuticle Care'
      ].filter(Boolean),
      // Build specialties array
      specialties: [
        salon.master_artist && 'Master Nail Artist',
        salon.certified_technicians && 'Certified Technicians',
        salon.experienced_staff && 'Experienced Team',
        salon.luxury_experience && 'Luxury Experience',
        salon.relaxing_atmosphere && 'Relaxing Atmosphere',
        salon.modern_facilities && 'Modern Facilities',
        salon.clean_hygienic && 'Clean & Hygienic',
        salon.quick_service && 'Quick Service',
        salon.premium_products && 'Premium Products'
      ].filter(Boolean),
      // Add default values
      currency: 'AUD',
      country: 'Australia',
      state: 'VIC', // Default, will be updated from cities table
      languages_spoken: ['English'],
      price_range: 'mid-range',
      price_from: 35,
      average_rating: salon.rating,
      review_count: 0,
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
