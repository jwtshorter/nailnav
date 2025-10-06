-- =====================================================
-- QUICK VENDOR SYSTEM MIGRATION - ESSENTIAL TABLES ONLY
-- =====================================================
-- Run this in Supabase SQL Editor to fix the immediate error

-- Enable extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USER ROLES & PROFILES SYSTEM
-- =====================================================

-- Add user roles enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'vendor', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'user',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- 2. VENDOR APPLICATIONS TABLE
-- =====================================================

-- Create vendor applications table
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
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Salon Draft Data (JSON for flexibility)
  draft_data JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- 3. ROW LEVEL SECURITY POLICIES
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

-- Vendor applications policies
DROP POLICY IF EXISTS "Vendors can view their applications" ON vendor_applications;
CREATE POLICY "Vendors can view their applications" ON vendor_applications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Vendors can update their pending applications" ON vendor_applications;
CREATE POLICY "Vendors can update their pending applications" ON vendor_applications
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND status IN ('pending', 'requires_changes')
  );

DROP POLICY IF EXISTS "Vendors can create applications" ON vendor_applications;
CREATE POLICY "Vendors can create applications" ON vendor_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 4. AUTO-CREATE USER PROFILE TRIGGER
-- =====================================================

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, role, email_verified)
  VALUES (NEW.id, 'user', COALESCE(NEW.email_confirmed_at IS NOT NULL, false))
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- =====================================================
-- 5. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON vendor_applications TO authenticated;

-- =====================================================
-- 6. CREATE A TEST ADMIN USER (OPTIONAL)
-- =====================================================

-- Uncomment and modify this after creating an admin user in Supabase Auth panel:
-- INSERT INTO user_profiles (id, role, first_name, last_name, email_verified)
-- VALUES (
--   'your-admin-user-id-here',  -- Replace with actual admin user ID from auth.users
--   'admin',
--   'Admin',
--   'User', 
--   true
-- ) ON CONFLICT (id) DO UPDATE SET
--   role = 'admin',
--   first_name = 'Admin',
--   last_name = 'User',
--   email_verified = true;