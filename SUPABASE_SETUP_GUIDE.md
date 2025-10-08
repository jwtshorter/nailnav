# Supabase Database Setup Guide

## Problem Diagnosis
You're experiencing a "security/ownership" issue because:
1. ✅ Your `.env.local` is correctly configured with new database credentials
2. ❌ Your new Supabase database (bmlvjgulciphdqyqucxv) doesn't have the required tables yet
3. ❌ Your app is trying to access non-existent tables, causing permission errors
4. ❌ The migration script exists but hasn't been executed

## Step-by-Step Solution

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Sign in with your account
3. Select your project: **bmlvjgulciphdqyqucxv**
4. You should see an empty database with no custom tables

### Step 2: Execute Database Migration
1. In your Supabase dashboard, navigate to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents from `SUPABASE_QUICK_MIGRATION.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute the migration

**If you get permission errors during execution:**
- You ARE the project owner, so this shouldn't happen
- If it does happen, try these troubleshooting steps:

### Step 3: Troubleshooting Permission Issues

#### 3A: Check Project Ownership
1. Go to **Settings** → **General** in your Supabase dashboard
2. Verify you're listed as the project owner
3. If not, check if you're signed in with the correct account

#### 3B: Check Database Access
1. Go to **Database** → **Tables** in sidebar
2. You should see `auth` schema tables (users, sessions, etc.)
3. If you can't see these, there's a dashboard access issue

#### 3C: Alternative Migration Method
If SQL Editor doesn't work, try the API approach:

```bash
# In your terminal, navigate to your project
cd /home/user/webapp

# Install Supabase CLI if needed
npm install -g supabase

# Login to Supabase (this will open browser for auth)
supabase login

# Link your project
supabase link --project-ref bmlvjgulciphdqyqucxv

# Apply migration using CLI
supabase db push
```

### Step 4: Verify Database Setup
After successful migration, you should see these tables:
- `user_profiles` - User profile information
- `vendor_applications` - Vendor registration applications

### Step 5: Add Service Role Key (For Admin Operations)
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the **service_role** key (not the anon key)
3. Add it to your `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key-here
```

### Step 6: Test Application
1. Restart your Next.js application
2. Try vendor registration again
3. Check database for new records

## Common Issues & Solutions

### Issue: "relation does not exist" errors
**Solution:** Tables haven't been created. Re-run the migration script.

### Issue: "permission denied for relation" errors
**Solution:** RLS policies are blocking access. Check if user is properly authenticated.

### Issue: "JWT expired" or auth errors
**Solution:** Clear browser storage, sign out and back in.

### Issue: Can't access Supabase dashboard
**Solution:** 
1. Check you're signed in with the correct account
2. Verify project URL: https://supabase.com/dashboard/project/bmlvjgulciphdqyqucxv
3. If access denied, check if project was accidentally deleted or transferred

## Expected Database Structure After Migration

```sql
-- These tables should exist after successful migration:

1. user_profiles (extends auth.users)
   - Stores user role, profile info
   - RLS enabled for user privacy

2. vendor_applications (new vendor registrations)  
   - Stores business info, application status
   - RLS enabled for vendor privacy

3. Extensions enabled:
   - uuid-ossp (for UUID generation)

4. Triggers:
   - Auto-create user profile on signup
```

## Next Steps After Database Setup
1. Test vendor registration flow
2. Set up admin user for approving applications
3. Build vendor dashboard for approved vendors
4. Implement full salon/listing management
5. Add payment integration (Stripe)

## Need Help?
If you're still having issues:
1. Check the browser console for specific error messages
2. Look at Network tab in DevTools for failed API calls
3. Verify environment variables are loaded correctly
4. Test Supabase connection with a simple query first