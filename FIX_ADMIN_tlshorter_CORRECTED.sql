-- =====================================================
-- FIX ADMIN ACCESS FOR tlshorter@gmail.com (CORRECTED)
-- =====================================================

-- First, check current status (fixed enum issue)
SELECT 'CHECKING CURRENT STATUS FOR tlshorter@gmail.com:' as info;
SELECT 
    u.email,
    u.id,
    u.email_confirmed_at,
    p.role as current_role,
    p.first_name,
    CASE WHEN p.id IS NULL THEN 'PROFILE_MISSING' ELSE 'PROFILE_EXISTS' END as profile_status
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'tlshorter@gmail.com';

-- Force update to admin role (for existing profiles)
UPDATE user_profiles 
SET 
    role = 'admin',
    first_name = 'Admin',
    last_name = 'User',
    email_verified = true,
    updated_at = NOW()
WHERE id = (
    SELECT id FROM auth.users 
    WHERE email = 'tlshorter@gmail.com'
);

-- Create profile if missing
INSERT INTO user_profiles (id, role, first_name, last_name, email_verified, created_at, updated_at)
SELECT 
    u.id,
    'admin'::user_role,
    'Admin',
    'User',
    true,
    NOW(),
    NOW()
FROM auth.users u
WHERE u.email = 'tlshorter@gmail.com'
AND u.id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO UPDATE SET
    role = 'admin'::user_role,
    first_name = 'Admin',
    last_name = 'User',
    email_verified = true,
    updated_at = NOW();

-- Verify the fix worked
SELECT 'VERIFICATION - tlshorter@gmail.com ADMIN STATUS:' as result;
SELECT 
    u.email,
    u.id,
    p.role,
    p.first_name,
    p.last_name,
    'ADMIN ACCESS GRANTED' as status
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'tlshorter@gmail.com';

-- Show vendor applications
SELECT 'VENDOR APPLICATIONS FOR REVIEW:' as apps;
SELECT 
    salon_name,
    owner_name,
    email,
    city || ', ' || state as location,
    status,
    created_at
FROM vendor_applications
ORDER BY created_at DESC;

SELECT 'SUCCESS! You can now login at /admin/login with tlshorter@gmail.com' as final_message;