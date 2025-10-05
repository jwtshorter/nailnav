# 🚀 Complete Supabase Setup Guide for Nail Nav

This guide will walk you through setting up Supabase for your Nail Nav website from scratch.

## 📋 **Step 1: Create Supabase Project**

### 1.1 Create Account & Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `nail-nav-production`
   - **Database Password**: Generate a strong password (save it securely!)
   - **Region**: Choose closest to your target audience
4. Click **"Create new project"** (takes ~2 minutes)

### 1.2 Get Your API Credentials
Once your project is ready:

1. Go to **Settings > API** in your Supabase dashboard
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Public anon key**: `eyJhbG...` (for client-side usage)
   - **Service role key**: `eyJhbG...` (for server-side usage, keep secret!)

## 🔧 **Step 2: Configure Environment Variables**

### 2.1 Create `.env.local` file
In your project root (`/home/user/webapp/`), create a `.env.local` file:

```bash
# Copy from .env.local.example and fill in your values
cp .env.local.example .env.local
```

### 2.2 Add your Supabase credentials
Edit `.env.local` and replace the placeholder values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Maps API (optional for now)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_PLACES_API_KEY=your_places_api_key
```

**⚠️ Important**: 
- Never commit `.env.local` to version control
- The file is already in `.gitignore`
- Use different projects for development and production

## 📊 **Step 3: Set Up Database Schema**

### 3.1 Run Initial Migration
In your Supabase dashboard:

1. Go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the contents from `supabase/migrations/0001_initial_schema.sql`
4. Click **"Run"** to create all tables

### 3.2 Run Functions and Security
1. Create another new query
2. Copy and paste the contents from `supabase/migrations/0002_functions_and_rls.sql`
3. Click **"Run"** to create functions and security policies

### 3.3 Add Seed Data (Optional)
For testing with sample data:

1. Create another new query
2. Copy and paste the contents from `supabase/seed/0001_initial_data.sql`
3. Click **"Run"** to insert sample salons, services, and reviews

## 🔐 **Step 4: Configure Authentication**

### 4.1 Enable Email Authentication
In your Supabase dashboard:

1. Go to **Authentication > Settings**
2. Under **Auth Providers**, ensure **Email** is enabled
3. Configure these settings:
   - **Enable email confirmations**: ✅ (recommended)
   - **Enable phone confirmations**: ❌ (optional)
   - **Secure email change**: ✅ (recommended)

### 4.2 Set Up Email Templates (Optional)
1. Go to **Authentication > Email Templates**
2. Customize the email templates for:
   - **Confirm signup**
   - **Magic link**
   - **Password reset**
   - **Email change**

### 4.3 Configure Site URL
1. Go to **Authentication > URL Configuration**
2. Add your site URL(s):
   - **Development**: `http://localhost:3000`
   - **Production**: `https://your-domain.com`

## 🛡️ **Step 5: Row Level Security (RLS)**

The RLS policies are already configured in the migration files, but here's what they do:

### Public Access
- ✅ Anyone can view published salons
- ✅ Anyone can view published reviews
- ✅ Anyone can view service categories and types

### Authenticated Users
- ✅ Can create reviews and bookings
- ✅ Can update their own reviews
- ✅ Can view their own bookings

### Salon Owners
- ✅ Can manage their own salon data
- ✅ Can view bookings for their salons
- ✅ Can view analytics for their salons

### Admins
- ✅ Can manage all data
- ✅ Can manage featured placements

## 🧪 **Step 6: Test the Connection**

### 6.1 Test API Connection
Run your development server:

```bash
npm run dev:sandbox
```

Visit `http://localhost:3000` and check:
- ✅ Homepage loads without errors
- ✅ Sample salons appear (if you added seed data)
- ✅ Search functionality works
- ✅ No console errors related to Supabase

### 6.2 Test Authentication (Optional)
If implementing user features:
- ✅ Sign up works
- ✅ Sign in works
- ✅ Email confirmation works
- ✅ Password reset works

## 📈 **Step 7: Production Setup**

### 7.1 Create Production Database
For production, create a separate Supabase project:
1. Repeat steps 1-6 with a new project named `nail-nav-production`
2. Use different environment variables for production
3. Set up proper domain URLs in authentication settings

### 7.2 Database Backups
Enable automatic backups in **Settings > Database > Backups**

### 7.3 Monitoring
Set up monitoring in **Reports** section for:
- Database performance
- API usage
- Authentication metrics

## 🚀 **Step 8: Advanced Features (Optional)**

### 8.1 Realtime Subscriptions
Enable for live booking updates:

```typescript
// Listen for new bookings
const subscription = supabase
  .channel('bookings')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'bookings' 
    }, 
    (payload) => {
      console.log('New booking!', payload)
    }
  )
  .subscribe()
```

### 8.2 Storage for Images
Set up **Storage** for salon photos:

1. Go to **Storage > Buckets**
2. Create bucket named `salon-images`
3. Set up policies for public read access
4. Configure upload policies for authenticated users

### 8.3 Edge Functions
Create serverless functions for:
- Email notifications
- Payment processing
- Third-party integrations

## 🔍 **Troubleshooting**

### Common Issues

**❌ "Invalid API key"**
- Check your `.env.local` file
- Ensure no extra spaces in environment variables
- Restart your development server

**❌ "Row Level Security policy violation"**
- Check if RLS policies are applied correctly
- Verify user permissions
- Test with service role key for admin operations

**❌ "Cannot connect to database"**
- Check your project status in Supabase dashboard
- Verify network connectivity
- Check if your IP is allowed (if restrictions are enabled)

**❌ "Migration errors"**
- Run migrations in correct order
- Check for syntax errors in SQL
- Verify extensions are enabled (PostGIS, UUID)

### Getting Help

1. **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
2. **Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
3. **Discord**: [discord.supabase.com](https://discord.supabase.com)

## 📚 **Next Steps**

Once Supabase is set up:

1. **Test all functionality** with seed data
2. **Implement authentication** if needed
3. **Connect to Google Maps API** for location features
4. **Set up payment processing** for bookings
5. **Configure email services** for notifications
6. **Deploy to production** with proper environment variables

---

## 📞 **Support**

If you encounter any issues during setup:

1. Check the troubleshooting section above
2. Verify all environment variables are correct
3. Ensure your Supabase project is active and properly configured
4. Test with the sample data to isolate issues

Your Nail Nav application now has a robust, scalable database backend with Supabase! 🎉