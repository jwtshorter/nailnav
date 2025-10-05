import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection by fetching salons
    const { data: salons, error } = await supabase
      .from('salons')
      .select(`
        id,
        name,
        slug,
        city,
        state,
        address,
        website,
        specialties,
        is_verified,
        is_featured,
        price_from,
        currency,
        latitude,
        longitude
      `)
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('name', { ascending: true })
      .limit(20)

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

    return NextResponse.json({ 
      salons: salons || [],
      count: salons?.length || 0,
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