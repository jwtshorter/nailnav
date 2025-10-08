import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, salonName } = await request.json()
    
    console.log('Testing registration for:', email)
    
    // Test the same process as the registration form
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          role: 'vendor'
        }
      }
    })

    if (signUpError) {
      return NextResponse.json({
        success: false,
        error: 'Auth signup failed',
        details: signUpError.message,
        code: signUpError.status
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({
        success: false,
        error: 'No user returned from signup'
      }, { status: 400 })
    }

    // Test vendor application creation
    const vendorApplication = {
      user_id: authData.user.id,
      salon_name: salonName || 'Test Salon',
      business_address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      country: 'US',
      postal_code: '12345',
      owner_name: 'Test User',
      email: email,
      phone: '555-0123',
      website: 'https://test.com',
      status: 'pending'
    }

    const { data: applicationData, error: applicationError } = await supabase
      .from('vendor_applications')
      .insert(vendorApplication)
      .select()
      .single()

    if (applicationError) {
      return NextResponse.json({
        success: false,
        error: 'Database insertion failed',
        details: applicationError.message,
        code: applicationError.code,
        user_created: true,
        user_id: authData.user.id
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Registration test successful',
      user_id: authData.user.id,
      application_id: applicationData.id
    })

  } catch (error) {
    console.error('Registration test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}