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
        address,
        phone,
        website,
        latitude,
        longitude,
        manicure,
        pedicure,
        gel_nails,
        acrylic_nails,
        nail_art,
        cities (
          id,
          name,
          states (
            id,
            name,
            code
          )
        )
      `)
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