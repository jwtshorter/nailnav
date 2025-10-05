import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      salon_id,
      visitor_name,
      visitor_email,
      visitor_phone = null,
      subject = null,
      message,
      service_interest = null,
      preferred_contact_method = 'email'
    } = body

    // Validate required fields
    if (!salon_id || !visitor_name || !visitor_email || !message) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['salon_id', 'visitor_name', 'visitor_email', 'message']
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(visitor_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate salon exists and is published
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id, name')
      .eq('id', salon_id)
      .eq('is_published', true)
      .single()

    if (salonError || !salon) {
      return NextResponse.json(
        { error: 'Salon not found or not available' },
        { status: 404 }
      )
    }

    // Submit contact form using the database function
    const { data: submissionId, error } = await supabase
      .rpc('submit_salon_contact_form', {
        p_salon_id: salon_id,
        p_visitor_name: visitor_name,
        p_visitor_email: visitor_email,
        p_visitor_phone: visitor_phone,
        p_subject: subject,
        p_message: message,
        p_service_interest: service_interest,
        p_preferred_contact_method: preferred_contact_method
      })

    if (error) {
      console.error('Contact form submission error:', error)
      return NextResponse.json(
        { 
          error: 'Failed to submit contact form',
          details: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Contact form submitted successfully',
      submission_id: submissionId,
      salon_name: salon.name
    })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}