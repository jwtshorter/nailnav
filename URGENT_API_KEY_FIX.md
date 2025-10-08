# 🚨 URGENT: Fix Your Supabase API Key

## Current Status
Your `/api/vendor-setup` endpoint returns:
```json
{
  "success": false,
  "error": "vendor_applications table not found",
  "details": "Invalid API key"  <-- THIS IS THE PROBLEM
}
```

## How To Fix

### 1. Get Correct API Key
1. Go to: https://supabase.com/dashboard/project/bmlvjgulciphdqyqucxv
2. Click **Settings** → **API**
3. Copy the **anon public** key (should be a very long JWT token)
4. Make sure you copy the ENTIRE key without any line breaks or extra characters

### 2. Update .env.local
Replace line 3 in your `.env.local` file:

**CURRENT (corrupted):**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHZqZ3VsY2lwaGRxeXF1Y3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTlcG9\184ODI5LCJleHAiOjIwNzU0NzA4Mjl9.XT4I3AkBgbxIiu7zkore1i1QHNxrB3Ofs6dWmodSqeI
```

**NEW (correct format):**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.PASTE_YOUR_CORRECT_KEY_HERE.SIGNATURE_PART
```

### 3. Test The Fix
After updating the key, test it:
```bash
cd /home/user/webapp
node simple-db-test.js
```

You should see:
- ✅ No "Invalid API key" error
- ❌ Still "user_profiles table not found" (this is expected - we'll fix this next)

### 4. Run Database Migration
Once the API key works:

1. Go to: https://supabase.com/dashboard/project/bmlvjgulciphdqyqucxv
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents from `SUPABASE_ENHANCED_MIGRATION.sql`
5. Paste it into the SQL Editor
6. Click **RUN**

### 5. Verify Everything Works
After migration:
```bash
curl http://localhost:3000/api/vendor-setup
```

Should return:
```json
{
  "success": true,
  "message": "vendor_applications table exists and is accessible",
  "table_ready": true
}
```

## Why This Happened
JWT tokens are very sensitive to character changes. Your key got corrupted when copying/pasting, likely with escaped characters (`\G9\`) that broke the token format.

## Next Steps
1. Fix the API key first
2. Run the database migration
3. Test vendor registration
4. Continue with your business platform development