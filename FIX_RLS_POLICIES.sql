-- =====================================================
-- FIX RLS POLICIES FOR USER REGISTRATION
-- =====================================================
-- This fixes the "Database error saving new user" issue during signup

-- The problem: The create_user_profile() trigger runs as SECURITY DEFINER
-- but RLS policies are blocking it from inserting into user_profiles
-- during auth.users creation.

-- =====================================================
-- 1. DROP EXISTING PROBLEMATIC POLICIES
-- =====================================================

-- Drop all existing policies on user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

-- =====================================================
-- 2. CREATE BETTER RLS POLICIES
-- =====================================================

-- Allow insert for the trigger function (bypass RLS for system operations)
CREATE POLICY "Allow system to create profiles" ON user_profiles
  FOR INSERT 
  WITH CHECK (true);  -- Allow all inserts (trigger will handle this)

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- 3. FIX VENDOR_APPLICATIONS POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own applications" ON vendor_applications;
DROP POLICY IF EXISTS "Users can create their own applications" ON vendor_applications;
DROP POLICY IF EXISTS "Users can update their pending applications" ON vendor_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON vendor_applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON vendor_applications;

-- Create better policies

-- Allow authenticated users to insert applications for themselves
CREATE POLICY "Users can create applications" ON vendor_applications
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own applications
CREATE POLICY "Users can view their applications" ON vendor_applications
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their pending applications
CREATE POLICY "Users can update pending applications" ON vendor_applications
  FOR UPDATE 
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND status IN ('pending', 'requires_changes')
  );

-- Admins can view all applications
CREATE POLICY "Admins can view all applications" ON vendor_applications
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Admins can update all applications
CREATE POLICY "Admins can update all applications" ON vendor_applications
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- 4. ENSURE PROPER PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON vendor_applications TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- 5. VERIFY THE FIX
-- =====================================================

-- Test that tables exist and are accessible
-- SELECT 'user_profiles table exists' as test, count(*) as count FROM user_profiles;
-- SELECT 'vendor_applications table exists' as test, count(*) as count FROM vendor_applications;

-- Test RLS policies
-- EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM user_profiles WHERE id = auth.uid();

-- =====================================================
-- 6. NOTES
-- =====================================================

/*
After running this:

1. The trigger function can now insert into user_profiles during auth signup
2. RLS policies are properly configured for normal operations
3. Vendor registration should work without "Database error saving new user"

To test:
1. Run this SQL in Supabase SQL Editor
2. Try vendor registration again
3. Should see successful account creation

If you still get errors, check:
- Trigger function exists: SELECT proname FROM pg_proc WHERE proname = 'create_user_profile';
- RLS is enabled: SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename IN ('user_profiles', 'vendor_applications');
*/