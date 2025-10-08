-- =====================================================
-- SAFE DATABASE FIX FOR VENDOR REGISTRATION
-- =====================================================
-- This version handles existing policies safely

-- Step 1: Check current state
SELECT 'Starting database fix...' as status;

-- Step 2: Clean up user_profiles policies safely
DO $$ 
BEGIN
    -- Drop policies if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Allow trigger to create profiles') THEN
        DROP POLICY "Allow trigger to create profiles" ON user_profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Allow system to create profiles') THEN
        DROP POLICY "Allow system to create profiles" ON user_profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can view their own profile') THEN
        DROP POLICY "Users can view their own profile" ON user_profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update their own profile') THEN
        DROP POLICY "Users can update their own profile" ON user_profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Admins can view all profiles') THEN
        DROP POLICY "Admins can view all profiles" ON user_profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Admins can update all profiles') THEN
        DROP POLICY "Admins can update all profiles" ON user_profiles;
    END IF;
END $$;

-- Step 3: Create new policies for user_profiles
CREATE POLICY "system_insert_user_profiles" ON user_profiles
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "users_select_own_profile" ON user_profiles
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON user_profiles
    FOR UPDATE 
    USING (auth.uid() = id);

-- Step 4: Clean up vendor_applications policies safely  
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendor_applications' AND policyname = 'Users can create applications') THEN
        DROP POLICY "Users can create applications" ON vendor_applications;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendor_applications' AND policyname = 'Allow authenticated users to insert applications') THEN
        DROP POLICY "Allow authenticated users to insert applications" ON vendor_applications;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendor_applications' AND policyname = 'Users can view their applications') THEN
        DROP POLICY "Users can view their applications" ON vendor_applications;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendor_applications' AND policyname = 'Users can update their pending applications') THEN
        DROP POLICY "Users can update their pending applications" ON vendor_applications;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vendor_applications' AND policyname = 'Users can update pending applications') THEN
        DROP POLICY "Users can update pending applications" ON vendor_applications;
    END IF;
END $$;

-- Step 5: Create new policies for vendor_applications
CREATE POLICY "authenticated_insert_vendor_apps" ON vendor_applications
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_select_own_applications" ON vendor_applications
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "users_update_own_pending_applications" ON vendor_applications
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id AND status IN ('pending', 'requires_changes'));

-- Step 6: Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER 
SECURITY DEFINER
LANGUAGE plpgsql AS $$
BEGIN
    -- Insert user profile with conflict handling
    INSERT INTO user_profiles (id, role, email_verified, last_login_at)
    VALUES (
        NEW.id, 
        'user', 
        COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
        last_login_at = NOW(),
        updated_at = NOW();
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail auth creation
    RAISE WARNING 'Failed to create user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 7: Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- Step 8: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON vendor_applications TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Step 9: Test the setup
SELECT 'Checking RLS status...' as test;
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('user_profiles', 'vendor_applications');

SELECT 'Checking policies...' as test;
SELECT 
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'vendor_applications')
ORDER BY tablename, policyname;

SELECT 'Checking trigger...' as test;
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgenabled as enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

SELECT 'Database fix completed successfully!' as status;