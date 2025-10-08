-- =====================================================
-- CREATE ADMIN USER SETUP
-- =====================================================
-- This will help you create and configure an admin user

-- First, let's check what users exist in the system
SELECT 'Current users in the system:' as info;
SELECT 
    u.id,
    u.email,
    u.created_at,
    p.role,
    p.first_name,
    p.last_name
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

-- Check existing vendor applications
SELECT 'Current vendor applications:' as info;
SELECT 
    id,
    salon_name,
    owner_name,
    email,
    status,
    created_at
FROM vendor_applications
ORDER BY created_at DESC
LIMIT 10;

-- Instructions for creating admin user:
SELECT 'TO CREATE AN ADMIN USER:' as instructions;
SELECT '1. Register a new account at /vendor/register' as step1;
SELECT '2. Use an email you want to be your admin email' as step2;
SELECT '3. After registration, come back here and run the update below' as step3;
SELECT '4. Replace YOUR_EMAIL_HERE with your actual admin email' as step4;

-- AFTER you register, run this command with your email:
-- UPDATE user_profiles 
-- SET role = 'admin', 
--     first_name = 'Admin', 
--     last_name = 'User'
-- WHERE id = (
--     SELECT id FROM auth.users 
--     WHERE email = 'YOUR_EMAIL_HERE@example.com'
-- );

SELECT 'After updating your role, you can login at /admin/login' as final_step;