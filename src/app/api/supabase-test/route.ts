import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Test basic Supabase connection
    console.log('Testing Supabase connection...')
    
    // Test 1: Check if we can connect to Supabase
    const connectionTest = await supabase
      .from('vendor_tiers')
      .select('count')
      .limit(1)
    
    if (connectionTest.error) {
      return NextResponse.json({
        success: false,
        error: 'Connection failed',
        details: connectionTest.error.message,
        step: 'connection'
      }, { status: 500 })
    }

    // Test 2: Check if tables exist by querying vendor_tiers
    const { data: tiers, error: tiersError } = await supabase
      .from('vendor_tiers')
      .select('*')
      .limit(5)

    if (tiersError) {
      return NextResponse.json({
        success: false,
        error: 'Tables not found or not accessible',
        details: tiersError.message,
        step: 'tables',
        suggestion: 'Please run the database migrations in Supabase SQL Editor'
      }, { status: 500 })
    }

    // Test 3: Check if sample data exists
    const { data: salons, error: salonsError } = await supabase
      .from('salons')
      .select('id, name, city')
      .limit(5)

    const tests = {
      connection: true,
      tables_exist: true,
      vendor_tiers_count: tiers?.length || 0,
      salons_count: salonsError ? 0 : (salons?.length || 0),
      sample_data: !salonsError && salons && salons.length > 0
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      tests,
      sample_tiers: tiers,
      sample_salons: salonsError ? null : salons,
      environment: {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
        supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing'
      }
    })

  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      step: 'general'
    }, { status: 500 })
  }
}