-- Enable PostGIS and UUID extensions
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vendor Tiers Management (Create first)
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

-- Insert default vendor tiers immediately after table creation
INSERT INTO vendor_tiers (name, display_name, price_monthly, features, max_services, booking_enabled, calendar_integration, analytics_enabled) VALUES
('free', 'Free Listing', 0.00, '{"basic_listing": true, "photo_upload": 5, "review_responses": false}', 10, false, false, false),
('premium', 'Premium', 29.99, '{"enhanced_listing": true, "photo_upload": 20, "review_responses": true, "priority_placement": true}', 50, true, false, true),
('featured', 'Featured', 99.99, '{"premium_listing": true, "photo_upload": 100, "review_responses": true, "top_placement": true, "custom_branding": true}', null, true, true, true);

-- Main Salon Profiles
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES vendor_tiers(id), -- Will be set by trigger
  
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

-- Function to set default tier for new salons
CREATE OR REPLACE FUNCTION set_default_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tier_id IS NULL THEN
    NEW.tier_id := (SELECT id FROM vendor_tiers WHERE name = 'free' LIMIT 1);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set default tier
CREATE TRIGGER set_salon_default_tier
  BEFORE INSERT ON salons
  FOR EACH ROW
  EXECUTE FUNCTION set_default_tier();

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