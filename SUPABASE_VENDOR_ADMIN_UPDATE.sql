-- =====================================================
-- VENDOR MANAGEMENT & ADMIN SYSTEM UPDATE
-- =====================================================
-- Run this in Supabase SQL Editor to add vendor management features

-- =====================================================
-- 1. USER ROLES & PROFILES SYSTEM
-- =====================================================

-- Add user roles enum
CREATE TYPE user_role AS ENUM ('user', 'vendor', 'admin', 'super_admin');

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
-- 2. VENDOR ACCOUNTS & APPLICATIONS
-- =====================================================

-- Create vendor applications table (for the registration process)
CREATE TABLE vendor_applications (
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
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'under_review', 'approved', 'rejected', 'requires_changes'
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Salon Draft Data (JSON for flexibility before approval)
  draft_data JSONB, -- Stores draft salon profile data
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- 3. SALON STATUS MANAGEMENT
-- =====================================================

-- Add status tracking to salons table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='salons' AND column_name='status') THEN
        ALTER TABLE salons ADD COLUMN status VARCHAR(50) DEFAULT 'draft';
        -- 'draft', 'pending_review', 'approved', 'published', 'suspended', 'rejected'
    END IF;
END $$;

-- Add admin approval tracking
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='salons' AND column_name='approved_by') THEN
        ALTER TABLE salons ADD COLUMN approved_by UUID REFERENCES auth.users(id);
        ALTER TABLE salons ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE salons ADD COLUMN admin_notes TEXT;
    END IF;
END $$;

-- =====================================================
-- 4. ADMIN FUNCTIONS
-- =====================================================

-- Function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email TEXT,
  admin_password TEXT,
  admin_first_name TEXT DEFAULT 'Admin',
  admin_last_name TEXT DEFAULT 'User'
) RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- This would typically be called from a secure environment
  -- In practice, create admin through Supabase dashboard and then update role
  INSERT INTO user_profiles (id, role, first_name, last_name, email_verified)
  VALUES (
    (SELECT id FROM auth.users WHERE email = admin_email LIMIT 1),
    'admin',
    admin_first_name,
    admin_last_name,
    true
  ) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    first_name = admin_first_name,
    last_name = admin_last_name,
    email_verified = true;
    
  RETURN (SELECT id FROM auth.users WHERE email = admin_email LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve vendor application
CREATE OR REPLACE FUNCTION approve_vendor_application(
  application_id UUID,
  admin_user_id UUID
) RETURNS UUID AS $$
DECLARE
  salon_id UUID;
  app_data RECORD;
BEGIN
  -- Get application data
  SELECT * INTO app_data FROM vendor_applications WHERE id = application_id;
  
  -- Create salon from application
  INSERT INTO salons (
    owner_id, name, slug, description, address, city, state, country, postal_code,
    latitude, longitude, operating_hours, services_offered, specialties,
    accepts_walk_ins, parking_available, price_range, price_from,
    is_published, is_verified, status, approved_by, approved_at
  )
  SELECT 
    app_data.user_id,
    app_data.salon_name,
    lower(regexp_replace(regexp_replace(app_data.salon_name || '-' || app_data.city || '-' || app_data.state, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g')),
    COALESCE((app_data.draft_data->>'description'), 'Professional nail salon services'),
    app_data.business_address,
    app_data.city,
    app_data.state,
    app_data.country,
    app_data.postal_code,
    COALESCE((app_data.draft_data->>'latitude')::DECIMAL, 40.7128), -- Default to NYC
    COALESCE((app_data.draft_data->>'longitude')::DECIMAL, -74.0060),
    COALESCE(app_data.draft_data->'operating_hours', '{"monday": {"open": "09:00", "close": "19:00"}, "tuesday": {"open": "09:00", "close": "19:00"}, "wednesday": {"open": "09:00", "close": "19:00"}, "thursday": {"open": "09:00", "close": "19:00"}, "friday": {"open": "09:00", "close": "20:00"}, "saturday": {"open": "09:00", "close": "18:00"}, "sunday": {"open": "10:00", "close": "17:00"}}'::jsonb),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(app_data.draft_data->'services_offered')), ARRAY['manicures', 'pedicures']),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(app_data.draft_data->'specialties')), ARRAY['nail-care']),
    COALESCE((app_data.draft_data->>'accepts_walk_ins')::BOOLEAN, true),
    COALESCE((app_data.draft_data->>'parking_available')::BOOLEAN, false),
    COALESCE(app_data.draft_data->>'price_range', 'mid-range'),
    COALESCE((app_data.draft_data->>'price_from')::DECIMAL, 35.00),
    true, -- is_published
    true, -- is_verified 
    'approved',
    admin_user_id,
    now()
  RETURNING id INTO salon_id;
  
  -- Update application status
  UPDATE vendor_applications 
  SET status = 'approved', reviewed_by = admin_user_id, reviewed_at = now()
  WHERE id = application_id;
  
  -- Update user role to vendor
  UPDATE user_profiles SET role = 'vendor' WHERE id = app_data.user_id;
  
  RETURN salon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject vendor application
CREATE OR REPLACE FUNCTION reject_vendor_application(
  application_id UUID,
  admin_user_id UUID,
  rejection_reason TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE vendor_applications 
  SET 
    status = 'rejected',
    admin_notes = rejection_reason,
    reviewed_by = admin_user_id,
    reviewed_at = now()
  WHERE id = application_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Vendor applications policies
CREATE POLICY "Vendors can view their applications" ON vendor_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Vendors can update their pending applications" ON vendor_applications
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND status IN ('pending', 'requires_changes')
  );

CREATE POLICY "Vendors can create applications" ON vendor_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all applications" ON vendor_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Update salon policies for new status system
DROP POLICY IF EXISTS "Owners can manage their salons" ON salons;
CREATE POLICY "Owners can manage their draft salons" ON salons
  FOR ALL USING (
    auth.uid() = owner_id 
    AND status IN ('draft', 'pending_review')
  );

CREATE POLICY "Owners can view their salons" ON salons
  FOR SELECT USING (auth.uid() = owner_id);

-- =====================================================
-- 6. TRIGGERS & FUNCTIONS
-- =====================================================

-- Auto-create user profile on signup
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
-- 7. ADMIN SETUP (Run after creating admin user manually)
-- =====================================================

-- Create default admin user profile (update email to match your admin account)
-- You'll need to create the actual auth user first through Supabase dashboard
-- Then run this with the correct email:

-- UPDATE user_profiles 
-- SET role = 'admin', first_name = 'Admin', last_name = 'User', email_verified = true
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com');

-- =====================================================
-- 8. SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample vendor application (for testing)
-- INSERT INTO vendor_applications (
--   user_id, salon_name, business_address, city, state, country, 
--   owner_name, email, status, draft_data
-- ) VALUES (
--   (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user ID
--   'Test Salon Application',
--   '123 Test Street',
--   'Test City', 
--   'Test State',
--   'US',
--   'Test Owner',
--   'test@example.com',
--   'pending',
--   '{
--     "description": "A beautiful nail salon",
--     "services_offered": ["manicures", "pedicures", "nail-art"],
--     "specialties": ["gel-polish", "nail-art"],
--     "price_range": "mid-range",
--     "price_from": 35.00,
--     "accepts_walk_ins": true,
--     "parking_available": true
--   }'::jsonb
-- );

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON user_profiles, vendor_applications TO authenticated;
GRANT ALL ON user_profiles, vendor_applications TO authenticated;
GRANT EXECUTE ON FUNCTION create_admin_user TO authenticated;
GRANT EXECUTE ON FUNCTION approve_vendor_application TO authenticated;
GRANT EXECUTE ON FUNCTION reject_vendor_application TO authenticated;