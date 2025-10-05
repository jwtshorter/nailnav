# 🗄️ Supabase Database Setup Guide

## Step-by-Step Database Schema Setup

### 1. Access Your Supabase Project
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Navigate to your project: `ddenulleuvyhwqsulrod`
- Click on **SQL Editor** in the left sidebar

### 2. Run Database Migrations

#### Step 2.1: Create Initial Schema
Copy and paste the following SQL into the SQL Editor and click **RUN**:

```sql
-- Enable PostGIS and UUID extensions
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vendor Tiers Management
CREATE TABLE vendor_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL, -- 'free', 'premium', 'featured'
  display_name VARCHAR(100) NOT NULL,
  price_monthly DECIMAL(10,2) DEFAULT 0,
  features JSONB NOT NULL,
  max_services INTEGER,
  booking_enabled BOOLEAN DEFAULT false,
  calendar_integration BOOLEAN DEFAULT false,
  analytics_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Main Salon Profiles
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES vendor_tiers(id) DEFAULT (SELECT id FROM vendor_tiers WHERE name = 'free'),
  
  -- Basic Information
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(200),
  
  -- Location Data (PostGIS)
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
  
  -- Business Details
  operating_hours JSONB, -- {'monday': {'open': '09:00', 'close': '18:00'}}
  services_offered TEXT[],
  specialties TEXT[],
  languages_spoken TEXT[] DEFAULT '{"en"}',
  accepts_walk_ins BOOLEAN DEFAULT true,
  parking_available BOOLEAN DEFAULT false,
  
  -- Pricing & Services
  price_range VARCHAR(20), -- 'budget', 'mid-range', 'premium'
  price_from DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Media
  logo_url TEXT,
  cover_image_url TEXT,
  gallery_images TEXT[],
  
  -- Status & Verification
  is_published BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  verification_date TIMESTAMP WITH TIME ZONE,
  
  -- SEO & Marketing
  meta_title VARCHAR(200),
  meta_description TEXT,
  keywords TEXT[],
  
  -- Tracking & Analytics
  view_count INTEGER DEFAULT 0,
  contact_form_submissions INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### Step 2.2: Continue with Service Tables
Run this next block:

```sql
-- Service Categories (Hierarchical)
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  parent_id UUID REFERENCES service_categories(id),
  description TEXT,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Service Types
CREATE TABLE service_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES service_categories(id),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  price_range_low DECIMAL(10,2),
  price_range_high DECIMAL(10,2),
  specialization_level VARCHAR(20), -- 'basic', 'standard', 'advanced'
  trend_status VARCHAR(20), -- 'stable', 'growing', 'trending', 'declining'
  filtering_priority VARCHAR(20), -- 'high', 'medium', 'low'
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Salon Services (Junction Table)
CREATE TABLE salon_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  service_type_id UUID REFERENCES service_types(id),
  
  -- Custom Pricing & Details
  price DECIMAL(10,2),
  duration_minutes INTEGER,
  description TEXT,
  is_available BOOLEAN DEFAULT true,
  requires_appointment BOOLEAN DEFAULT true,
  
  -- Tier-specific features
  online_booking_enabled BOOLEAN DEFAULT false,
  real_time_availability BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(salon_id, service_type_id)
);

-- Product Brands & Systems
CREATE TABLE product_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website VARCHAR(200),
  is_premium BOOLEAN DEFAULT false,
  specialization VARCHAR(50), -- 'gel', 'acrylic', 'dip', 'natural'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### Step 2.3: Add Reviews and Booking Tables
Run this block:

```sql
-- Reviews & Ratings
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Review Content
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT,
  service_type VARCHAR(100),
  
  -- Review Metadata
  is_verified BOOLEAN DEFAULT false,
  is_moderated BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  moderator_notes TEXT,
  
  -- Anonymous Contact (Free Tier)
  reviewer_anonymous_id UUID DEFAULT uuid_generate_v4(),
  
  -- Media
  photos TEXT[],
  
  -- Helpful Votes
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bookings (Premium Feature)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  service_id UUID REFERENCES salon_services(id),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Booking Details
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  total_price DECIMAL(10,2),
  
  -- Customer Information
  customer_name VARCHAR(200),
  customer_phone VARCHAR(20),
  customer_email VARCHAR(100),
  special_requests TEXT,
  
  -- Status Management
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  confirmation_code VARCHAR(10) UNIQUE,
  
  -- Payment Information
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  deposit_amount DECIMAL(10,2),
  
  -- Notifications
  reminder_sent BOOLEAN DEFAULT false,
  follow_up_sent BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### Step 2.4: Add Remaining Tables
Run this final table creation block:

```sql
-- Content Management (Multi-language)
CREATE TABLE content_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'salon', 'service', 'category', 'page'
  language_code VARCHAR(5) NOT NULL, -- 'en', 'es', 'vi'
  
  -- Translated Content
  title TEXT,
  description TEXT,
  content JSONB,
  meta_title VARCHAR(200),
  meta_description TEXT,
  
  -- Status
  is_primary BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  translator_id UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(content_id, language_code)
);

-- Analytics & Tracking
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  
  -- Event Details
  event_type VARCHAR(50) NOT NULL, -- 'view', 'contact', 'booking', 'call'
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  
  -- Anonymous Tracking (GDPR Compliant)
  session_id UUID,
  device_type VARCHAR(20), -- 'mobile', 'desktop', 'tablet'
  source VARCHAR(50), -- 'organic', 'search', 'map', 'direct'
  
  -- Geographic Data
  city VARCHAR(100),
  country VARCHAR(100),
  
  -- Additional Metadata
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Featured Vendor Management
CREATE TABLE featured_placements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  
  -- Placement Details
  placement_type VARCHAR(50) NOT NULL, -- 'homepage', 'search_results', 'category'
  position INTEGER,
  priority_score INTEGER DEFAULT 0,
  
  -- Scheduling
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  
  -- Rotation Algorithm Data
  rotation_weight DECIMAL(3,2) DEFAULT 1.0,
  display_count INTEGER DEFAULT 0,
  click_through_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### Step 2.5: Create Database Indexes
Run this block for performance optimization:

```sql
-- Indexes for Performance
CREATE INDEX idx_salons_location ON salons USING GIST (location);
CREATE INDEX idx_salons_tier_published ON salons (tier_id, is_published);
CREATE INDEX idx_salons_city_country ON salons (city, country);
CREATE INDEX idx_salons_specialties ON salons USING GIN (specialties);
CREATE INDEX idx_salons_languages ON salons USING GIN (languages_spoken);
CREATE INDEX idx_reviews_salon_rating ON reviews (salon_id, rating);
CREATE INDEX idx_bookings_salon_date ON bookings (salon_id, appointment_date);
CREATE INDEX idx_analytics_salon_date ON analytics_events (salon_id, created_at);
CREATE INDEX idx_featured_active_priority ON featured_placements (is_active, priority_score);
```

### 3. Create Database Functions and RLS Policies

#### Step 3.1: Create Functions
Copy and paste the entire content from the file `/home/user/webapp/supabase/migrations/0002_functions_and_rls.sql` into the SQL Editor and run it.

**Or manually run these key functions:**

```sql
-- Function to increment salon view count
CREATE OR REPLACE FUNCTION increment_salon_view_count(salon_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE salons 
  SET view_count = view_count + 1, updated_at = now()
  WHERE id = salon_id;
  
  SELECT view_count INTO new_count FROM salons WHERE id = salon_id;
  RETURN COALESCE(new_count, 0);
END;
$$;

-- Function to calculate average rating for a salon
CREATE OR REPLACE FUNCTION calculate_salon_average_rating(salon_id UUID)
RETURNS DECIMAL(3,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_rating DECIMAL(3,2);
BEGIN
  SELECT ROUND(AVG(rating)::NUMERIC, 2) INTO avg_rating
  FROM reviews 
  WHERE salon_id = calculate_salon_average_rating.salon_id 
    AND is_published = true;
  
  RETURN COALESCE(avg_rating, 0.0);
END;
$$;
```

#### Step 3.2: Enable Row Level Security
```sql
-- Enable RLS on main tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public read access for published salons
CREATE POLICY "Public can view published salons" ON salons
  FOR SELECT USING (is_published = true);

-- Public read access for published reviews
CREATE POLICY "Public can view published reviews" ON reviews
  FOR SELECT USING (is_published = true);
```

### 4. Insert Sample Data

Run the sample data from `/home/user/webapp/supabase/seed.sql`:

```sql
-- Insert Vendor Tiers
INSERT INTO vendor_tiers (name, display_name, price_monthly, features, max_services, booking_enabled, calendar_integration, analytics_enabled) VALUES
('free', 'Free Listing', 0.00, '{"basic_listing": true, "photo_upload": 5, "review_responses": false}', 10, false, false, false),
('premium', 'Premium', 29.99, '{"enhanced_listing": true, "photo_upload": 20, "review_responses": true, "priority_placement": true}', 50, true, false, true),
('featured', 'Featured', 99.99, '{"premium_listing": true, "photo_upload": 100, "review_responses": true, "top_placement": true, "custom_branding": true}', null, true, true, true);

-- Insert Service Categories
INSERT INTO service_categories (name, slug, description, icon, sort_order, is_active) VALUES
('Manicures', 'manicures', 'Professional nail care for hands', 'fas fa-hand-paper', 1, true),
('Pedicures', 'pedicures', 'Professional nail care for feet', 'fas fa-shoe-prints', 2, true),
('Nail Art', 'nail-art', 'Creative and artistic nail designs', 'fas fa-palette', 3, true),
('Extensions', 'extensions', 'Acrylic, gel, and other nail extensions', 'fas fa-expand', 4, true),
('Treatments', 'treatments', 'Nail health and wellness treatments', 'fas fa-heart', 5, true);
```

Continue with the rest of the sample data...

### 5. Verify Setup

After running all migrations and sample data:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see all tables created:
   - `vendor_tiers`
   - `salons` 
   - `service_categories`
   - `service_types`
   - `salon_services`
   - `reviews`
   - `bookings`
   - And others...

3. Check that sample data was inserted by browsing the tables

### 6. Test Database Connection

Once setup is complete, your NailNav application should be able to:
- ✅ Connect to the database
- ✅ Fetch salon listings
- ✅ Display featured vendors
- ✅ Show reviews and ratings
- ✅ Perform location-based searches

## 🎯 Next Steps After Database Setup

1. Test the application at: https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev
2. Verify that salon listings appear on the homepage
3. Test the search functionality
4. Check that featured vendors section works

## 🔍 Troubleshooting

If you encounter any issues:

1. **Permission Errors**: Make sure RLS policies are set correctly
2. **Missing Data**: Verify that sample data was inserted properly
3. **Function Errors**: Check that all functions were created successfully
4. **Connection Issues**: Verify the API keys in your `.env.local` file

The database is now ready for your NailNav application!