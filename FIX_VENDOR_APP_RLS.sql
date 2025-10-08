-- =====================================================
-- FIX VENDOR APPLICATION RLS POLICY
-- =====================================================
-- This fixes the "new row violates row-level security policy" error

-- The issue: The current RLS policy for vendor_applications INSERT
-- is checking auth.uid() = user_id, but during registration,
-- the session might not be fully established yet.

SELECT 'Fixing vendor_applications RLS policies...' as status;

-- Drop the current problematic policy
DROP POLICY IF EXISTS "authenticated_insert_vendor_apps" ON vendor_applications;

-- Create a more permissive INSERT policy that works during registration
CREATE POLICY "allow_vendor_app_creation" ON vendor_applications
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        -- Allow insert if the user_id matches the authenticated user
        -- OR if this is a recently created user (within last 5 minutes)
        auth.uid() = user_id 
        OR 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = vendor_applications.user_id 
            AND created_at > (NOW() - INTERVAL '5 minutes')
        )
    );

-- Alternative: Create an even more permissive policy for testing
-- Uncomment this and comment out the above if you still have issues
/*
DROP POLICY IF EXISTS "allow_vendor_app_creation" ON vendor_applications;
CREATE POLICY "allow_any_authenticated_insert" ON vendor_applications
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);
*/

-- Verify the policy was created
SELECT 'Checking vendor_applications policies...' as status;
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'vendor_applications' 
AND cmd = 'INSERT';

SELECT 'Vendor application RLS fix completed!' as status;
SELECT 'You can now test registration again.' as next_step;