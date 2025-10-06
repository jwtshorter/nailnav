# ⚠️ Database Setup Required

## The Issue
You're seeing this error because the Supabase database doesn't have the required tables for the vendor management system:

```
ERROR: 42P01: relation "user_profiles" does not exist
```

## Quick Fix - Run Database Migration

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project
3. Click **SQL Editor** in the sidebar

### Step 2: Run the Migration Script
1. Copy the **entire contents** of `SUPABASE_VENDOR_ADMIN_UPDATE.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute

### Step 3: Verify Tables Created
After running the script, you should see these new tables:
- `user_profiles`
- `vendor_applications`

## What Happens After Setup
- ✅ Vendor registration will work properly
- ✅ Admin dashboard will be functional  
- ✅ Vendor dashboard will load correctly
- ✅ All authentication features will work

## Temporary Workaround
Until you run the database migration:
- Vendor accounts can still be created (Supabase Auth works)
- Application data is stored in browser localStorage as fallback
- Login will work but dashboard features may be limited

## Need Help?
See the complete setup guide: [`VENDOR_ADMIN_SETUP.md`](./VENDOR_ADMIN_SETUP.md)