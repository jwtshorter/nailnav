import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Test if vendor_applications table exists
    console.log('Testing vendor_applications table...')
    
    const { data, error } = await supabase
      .from('vendor_applications')
      .select('id')
      .limit(1)
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'vendor_applications table not found',
        details: error.message,
        suggestion: 'Run the SUPABASE_QUICK_MIGRATION.sql script in your Supabase SQL Editor',
        migration_steps: [
          '1. Go to your Supabase Dashboard: https://supabase.com/dashboard',
          '2. Navigate to SQL Editor',
          '3. Copy and paste the contents of SUPABASE_QUICK_MIGRATION.sql',
          '4. Click RUN to execute the migration',
          '5. Refresh this page to test again'
        ]
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'vendor_applications table exists and is accessible',
      table_ready: true
    })

  } catch (error) {
    console.error('Vendor setup test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Try to create the vendor_applications table with minimal schema
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS vendor_applications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        salon_name VARCHAR(255) NOT NULL,
        business_address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(100) DEFAULT 'US',
        postal_code VARCHAR(20),
        owner_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        website TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        draft_data JSONB,
        admin_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Enable RLS
      ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;

      -- Create basic policies
      DROP POLICY IF EXISTS "Vendors can create applications" ON vendor_applications;
      CREATE POLICY "Vendors can create applications" ON vendor_applications
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Vendors can view their applications" ON vendor_applications;
      CREATE POLICY "Vendors can view their applications" ON vendor_applications
        FOR SELECT TO authenticated
        USING (auth.uid() = user_id);

      -- Grant permissions
      GRANT SELECT, INSERT, UPDATE ON vendor_applications TO authenticated;
    `

    // Note: We can't execute raw SQL through the Supabase client
    // This endpoint serves as documentation and testing
    
    return NextResponse.json({
      success: false,
      error: 'Cannot create table via API',
      message: 'Please run the SQL migration manually in Supabase SQL Editor',
      sql_to_run: createTableSQL,
      instructions: [
        '1. Copy the SQL above',
        '2. Go to Supabase Dashboard > SQL Editor',
        '3. Paste and run the SQL',
        '4. Test registration again'
      ]
    }, { status: 400 })

  } catch (error) {
    console.error('Vendor setup error:', error)
    return NextResponse.json({
      success: false,
      error: 'Setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}