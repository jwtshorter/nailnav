# 🚨 URGENT: Fix Your Supabase API Key

## **Problem Identified**
Your anon key in `.env.local` is corrupted. It contains invalid characters that break the JWT token format.

**Corrupted key (current):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHZqZ3VsY2lwaGRxeXF1Y3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTlcG9\184ODI5LCJleHAiOjIwNzU0NzA4Mjl9.XT4I3AkBgbxIiu7zkore1i1QHNxrB3Ofs6dWmodSqeI
```
Notice the `\G9\` - this should not be there!

## **How to Fix**

### **Step 1: Get Correct Keys**
1. Go to https://supabase.com/dashboard/project/bmlvjgulciphdqyqucxv
2. Click **Settings** → **API**
3. Copy the **anon public** key (the long JWT token)
4. Copy the **service_role** key (also a long JWT token)

### **Step 2: Update .env.local**
Replace the corrupted key with the correct one. The format should look like:

```env
# Supabase Configuration - NEW DATABASE 
NEXT_PUBLIC_SUPABASE_URL=https://bmlvjgulciphdqyqucxv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.CORRECT_LONG_TOKEN_HERE.SIGNATURE_HERE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.CORRECT_SERVICE_ROLE_TOKEN_HERE.SIGNATURE_HERE
```

### **Step 3: Test Connection**
After fixing the key, run:
```bash
cd /home/user/webapp
node simple-db-test.js
```

### **Step 4: Run Database Migration**
Once the connection works:
1. Go to Supabase Dashboard → **SQL Editor**
2. Copy contents from `SUPABASE_ENHANCED_MIGRATION.sql`
3. Paste and run in SQL Editor

## **Expected Results After Fix**

✅ **Connection Test Should Show:**
- Auth system: working
- Basic database access: no "Invalid API key" error
- Schema check: can access tables

✅ **After Migration:**
- `user_profiles` table exists
- `vendor_applications` table exists
- RLS policies active
- Triggers working

## **Why This Happened**
The key likely got corrupted when copying/pasting from the Supabase dashboard. JWT tokens are very sensitive to any character changes.

## **Next Steps After Fix**
1. Test vendor registration flow
2. Create first admin user
3. Test admin approval workflow
4. Continue with business platform development