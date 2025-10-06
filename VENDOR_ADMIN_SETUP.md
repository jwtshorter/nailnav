# 🔧 Vendor Management & Admin System Setup

This guide covers setting up the complete vendor management system with admin oversight and proper workflow.

## 🚀 Quick Summary

**Yes, you need to update Supabase** with the new database schema to enable:
- Vendor account creation with passwords
- Draft/pending listing states  
- Admin dashboard for vendor management
- Vendor dashboard to update details & photos
- Admin approval workflow before listings go live

## 📋 Database Updates Required

### Step 1: Update Supabase Schema

1. **Open Supabase Dashboard** → Your Project → SQL Editor
2. **Copy and paste** the entire contents of `SUPABASE_VENDOR_ADMIN_UPDATE.sql`
3. **Execute** the script to create all required tables and functions

This will add:
- `user_profiles` table with role management
- `vendor_applications` table for the approval workflow
- Admin functions for approving/rejecting applications
- Proper Row Level Security (RLS) policies

### Step 2: Create Admin Account

1. **In Supabase Dashboard** → Authentication → Users
2. **Create a new user** with your admin email and password
3. **Copy the user ID** from the users table
4. **Run this SQL** in Supabase SQL Editor (replace with your admin email):

```sql
-- Update this with your actual admin email
UPDATE user_profiles 
SET role = 'admin', first_name = 'Admin', last_name = 'User', email_verified = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com');
```

## 🎯 New Workflow Overview

### For Vendors:
1. **Register** at `/vendor/register` with email/password
2. **Account created** → application status = "pending"
3. **Login** at `/vendor/login` → redirected to `/vendor/dashboard`
4. **Update details** & photos while waiting for approval
5. **Admin approves** → salon goes live automatically

### For Admins:
1. **Login** at `/admin/login` 
2. **Review applications** in admin dashboard
3. **Approve or reject** with notes
4. **Approved salons** go live instantly

## 🌐 New URLs

### Vendor URLs:
- **Registration**: `/vendor/register` (with password creation)
- **Login**: `/vendor/login` (authenticates to dashboard)
- **Dashboard**: `/vendor/dashboard` (update details & photos)

### Admin URLs:
- **Admin Login**: `/admin/login` (secure admin access)
- **Admin Dashboard**: `/admin/dashboard` (manage vendor applications)

## 🔐 Security Features

### Authentication:
- **Supabase Auth** for secure email/password login
- **Role-based access** (user, vendor, admin)
- **Row Level Security** for data protection

### Admin Protection:
- **Admin-only access** to admin dashboard
- **Secure approval functions** with user verification
- **Audit trail** for all admin actions

## 🏗️ Updated Architecture

### Before (Old System):
```
Register → Instant Live Listing ❌
```

### After (New System):
```
Register → Create Account → Pending Application → Admin Review → Approved Listing ✅
                     ↓
               Vendor Dashboard (Update Details & Photos)
```

## 📊 Application States

| Status | Description | Vendor Can | Admin Can |
|--------|-------------|------------|-----------|
| `pending` | Awaiting admin review | Edit details | Approve/Reject |
| `approved` | Live on platform | Edit details | View |
| `rejected` | Rejected with reason | Resubmit | Re-review |

## 🔧 Technical Implementation

### Database Schema:
- **Users**: Supabase Auth users table
- **User Profiles**: Role management (user/vendor/admin)
- **Vendor Applications**: Pending applications with draft data
- **Salons**: Final approved listings (existing table)

### Key Functions:
- `approve_vendor_application()` - Creates salon from application
- `reject_vendor_application()` - Rejects with admin notes
- `create_admin_user()` - Helper for admin setup

### Security Policies:
- Vendors can only see/edit their own applications
- Admins can manage all applications
- Public can only see approved salons

## 🧪 Testing the New System

### Test Vendor Registration:
1. Visit `/vendor/register`
2. Fill form with email/password
3. Check Supabase → `vendor_applications` table
4. Login at `/vendor/login`
5. Access `/vendor/dashboard`

### Test Admin Workflow:
1. Create admin user (Step 2 above)
2. Login at `/admin/login`
3. Review pending applications
4. Approve application
5. Verify salon appears in `salons` table

## 📋 Environment Variables

Ensure your `.env.local` has:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🚨 Important Notes

1. **Existing Data**: Old localStorage salons won't work with new system
2. **Admin Access**: Must create admin user before using admin dashboard
3. **Email Verification**: Currently disabled for faster testing
4. **Photo Upload**: UI ready, but needs storage configuration
5. **Production**: Consider enabling email verification for production

## 🎯 Next Steps

After running the database updates:

1. **Test vendor registration** workflow
2. **Set up admin account** following Step 2
3. **Test admin approval** process
4. **Configure photo storage** (optional)
5. **Enable email verification** (production)

The new system provides proper security, admin oversight, and a professional vendor onboarding experience while maintaining the existing user-facing salon directory functionality.