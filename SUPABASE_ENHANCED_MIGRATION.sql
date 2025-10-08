-- =====================================================
-- ENHANCED VENDOR SYSTEM MIGRATION WITH ADMIN SETUP
-- =====================================================
-- This script sets up the complete database schema and creates an admin user
-- Run this in Supabase SQL Editor after creating your first admin user account

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. ENUMS AND TYPES
-- =====================================================

-- User roles enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'vendor', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Application status enum
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM (
        'pending', 
        'under_review', 
        'approved', 
        'rejected', 
        'requires_changes'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 2. USER PROFILES SYSTEM
-- =====================================================

-- Create user profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'user',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON user_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email_verified ON user_profiles(email_verified);

-- =====================================================
-- 3. VENDOR APPLICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS vendor_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Business Information
  salon_name VARCHAR(200) NOT NULL,
  business_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  
  -- Contact Information
  owner_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  website VARCHAR(200),
  
  -- Application Status
  status application_status DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Business Details (JSON for flexibility)
  business_details JSONB DEFAULT '{}',
  
  -- Salon Draft Data (will become salon record when approved)
  draft_salon_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for vendor applications
CREATE INDEX IF NOT EXISTS idx_vendor_applications_user_id ON vendor_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_status ON vendor_applications(status);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_city ON vendor_applications(city);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_email ON vendor_applications(email);

-- =====================================================
-- 4. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;

-- User profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Vendor applications policies
DROP POLICY IF EXISTS "Users can view their own applications" ON vendor_applications;
CREATE POLICY "Users can view their own applications" ON vendor_applications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own applications" ON vendor_applications;
CREATE POLICY "Users can create their own applications" ON vendor_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their pending applications" ON vendor_applications;
CREATE POLICY "Users can update their pending applications" ON vendor_applications
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND status IN ('pending', 'requires_changes')
  );

DROP POLICY IF EXISTS "Admins can view all applications" ON vendor_applications;
CREATE POLICY "Admins can view all applications" ON vendor_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can update all applications" ON vendor_applications;
CREATE POLICY "Admins can update all applications" ON vendor_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- 5. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, role, email_verified, last_login_at)
  VALUES (
    NEW.id, 
    'user', 
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    last_login_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vendor_applications_updated_at ON vendor_applications;
CREATE TRIGGER update_vendor_applications_updated_at
  BEFORE UPDATE ON vendor_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. GRANT PERMISSIONS
-- =====================================================

-- Grant schema permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON vendor_applications TO authenticated;

-- Grant sequence permissions (for any auto-increment columns)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- 7. ADMIN USER SETUP INSTRUCTIONS
-- =====================================================

-- TO SET UP AN ADMIN USER:
-- 1. First, create a user account through your app's signup process
-- 2. Find the user ID from auth.users table
-- 3. Run this query with the actual user ID:

/*
UPDATE user_profiles 
SET role = 'admin', 
    first_name = 'Admin', 
    last_name = 'User',
    email_verified = true
WHERE id = 'YOUR_USER_ID_HERE';
*/

-- Example query to find your user ID:
-- SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- =====================================================
-- 8. VERIFICATION QUERIES
-- =====================================================

-- Run these queries after migration to verify setup:

-- Check if tables were created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('user_profiles', 'vendor_applications');

-- Check if RLS is enabled
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename IN ('user_profiles', 'vendor_applications');

-- Check if functions exist
-- SELECT proname FROM pg_proc WHERE proname IN ('create_user_profile', 'update_updated_at_column');

-- Check if triggers exist
-- SELECT tgname, tgrelid::regclass FROM pg_trigger WHERE tgname IN ('on_auth_user_created', 'update_user_profiles_updated_at', 'update_vendor_applications_updated_at');