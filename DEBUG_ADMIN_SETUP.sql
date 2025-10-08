-- =====================================================
-- DEBUG ADMIN SETUP - COMPREHENSIVE CHECK
-- =====================================================

-- Check 1: All users in auth.users
SELECT 'USERS IN AUTH SYSTEM:' as check_name;
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.created_at,
    'auth_user' as source
FROM auth.users u
ORDER BY u.created_at DESC;

-- Check 2: All profiles in user_profiles
SELECT 'USERS IN PROFILES TABLE:' as check_name;
SELECT 
    p.id,
    p.role,
    p.first_name,
    p.last_name,
    p.email_verified,
    p.created_at,
    'user_profile' as source
FROM user_profiles p
ORDER BY p.created_at DESC;

-- Check 3: Combined view - users with their profiles
SELECT 'COMBINED USER DATA:' as check_name;
SELECT 
    u.email,
    u.id,
    u.email_confirmed_at,
    COALESCE(p.role, 'NO_PROFILE') as role,
    COALESCE(p.first_name, 'NO_NAME') as first_name,
    u.created_at
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Check 4: All vendor applications
SELECT 'VENDOR APPLICATIONS:' as check_name;
SELECT 
    va.salon_name,
    va.email,
    va.status,
    va.user_id,
    va.created_at
FROM vendor_applications va
ORDER BY va.created_at DESC;

-- Check 5: Find the most recent user (likely you)
SELECT 'MOST RECENT USER (PROBABLY YOU):' as check_name;
SELECT 
    u.email,
    u.id,
    COALESCE(p.role, 'NO_PROFILE') as current_role,
    u.created_at
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 1;

-- MANUAL FIX: Update the most recent user to admin
-- Run this after seeing the results above:

UPDATE user_profiles 
SET 
    role = 'admin',
    first_name = 'Admin',
    last_name = 'User',
    email_verified = true,
    updated_at = NOW()
WHERE id = (
    SELECT id FROM auth.users 
    ORDER BY created_at DESC 
    LIMIT 1
);

-- If no profile exists, create one for the most recent user:
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
WHERE u.id NOT IN (SELECT id FROM user_profiles)
ORDER BY u.created_at DESC
LIMIT 1
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    first_name = 'Admin',
    last_name = 'User',
    email_verified = true,
    updated_at = NOW();

-- Verify the update worked:
SELECT 'AFTER UPDATE - CHECKING ADMIN USER:' as final_check;
SELECT 
    u.email,
    u.id,
    p.role,
    p.first_name,
    p.last_name,
    p.email_verified
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE p.role = 'admin'
ORDER BY u.created_at DESC;

SELECT 'Admin setup complete! Check the results above.' as status;