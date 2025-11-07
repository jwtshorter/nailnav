import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const state = searchParams.get('state') // Filter by state code
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('cities')
      .select(`
        id,
        name,
        state_id
      `)
      .order('name', { ascending: true })
      .limit(limit)

    // If search query provided, filter cities
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    // If state filter provided, get state ID first
    if (state) {
      const { data: stateData } = await supabase
        .from('states')
        .select('id')
        .ilike('code', state)
        .single()
      
      if (stateData) {
        query = query.eq('state_id', stateData.id)
      }
    }

    const { data: cities, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      )
    }

    // Fetch state names for the cities
    const stateIds = [...new Set(cities?.map(c => c.state_id) || [])]
    const { data: states } = await supabase
      .from('states')
      .select('id, code, name')
      .in('id', stateIds)

    const stateMap = new Map(states?.map(s => [s.id, s]) || [])

    // Transform cities with state info
    const transformedCities = (cities || []).map(city => ({
      id: city.id,
      name: city.name,
      state_id: city.state_id,
      state: stateMap.get(city.state_id)?.code || 'Unknown'
    }))

    return NextResponse.json({
      cities: transformedCities,
      count: transformedCities.length,
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
