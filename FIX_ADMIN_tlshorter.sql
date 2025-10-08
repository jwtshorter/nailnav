-- =====================================================
-- FIX ADMIN ACCESS FOR tlshorter@gmail.com
-- =====================================================

-- First, check current status
SELECT 'CHECKING CURRENT STATUS FOR tlshorter@gmail.com:' as info;
SELECT 
    u.email,
    u.id,
    u.email_confirmed_at,
    COALESCE(p.role, 'NO_PROFILE') as current_role,
    COALESCE(p.first_name, 'NO_NAME') as first_name
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'tlshorter@gmail.com';

-- Force update to admin role
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

-- If no profile exists, create one
INSERT INTO user_profiles (id, role, first_name, last_name, email_verified, created_at, updated_at)
SELECT 
    u.id,
    'admin' as role,
    'Admin' as first_name,
    'User' as last_name,
    true as email_verified,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users u
WHERE u.email = 'tlshorter@gmail.com'
AND u.id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    first_name = 'Admin',
    last_name = 'User',
    email_verified = true,
    updated_at = NOW();

-- Verify the fix worked
SELECT 'AFTER FIX - VERIFICATION:' as result;
SELECT 
    u.email,
    u.id,
    p.role,
    p.first_name,
    p.last_name,
    p.email_verified,
    'SUCCESS: You can now login as admin' as status
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'tlshorter@gmail.com'
AND p.role = 'admin';

-- Show all vendor applications waiting for review
SELECT 'VENDOR APPLICATIONS WAITING FOR YOUR REVIEW:' as apps_info;
SELECT 
    salon_name,
    owner_name,
    email,
    city,
    state,
    status,
    created_at
FROM vendor_applications
ORDER BY created_at DESC;

SELECT 'Run complete! tlshorter@gmail.com should now have admin access.' as final_status;