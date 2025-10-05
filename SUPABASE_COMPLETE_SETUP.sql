-- =====================================================
-- COMPLETE NAIL NAV DATABASE SETUP - ONE-STEP SOLUTION
-- =====================================================
-- Copy and paste this entire file into Supabase SQL Editor and run it all at once
-- This will create all tables, insert sample data, and set up functions

-- Enable PostGIS and UUID extensions
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. VENDOR TIERS MANAGEMENT
-- =====================================================
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

-- Insert default vendor tiers
INSERT INTO vendor_tiers (name, display_name, price_monthly, features, max_services, booking_enabled, calendar_integration, analytics_enabled) VALUES
('free', 'Free Listing', 0.00, '{"basic_listing": true, "photo_upload": 5, "review_responses": false}', 10, false, false, false),
('premium', 'Premium', 29.99, '{"enhanced_listing": true, "photo_upload": 20, "review_responses": true, "priority_placement": true}', 50, true, false, true),
('featured', 'Featured', 99.99, '{"premium_listing": true, "photo_upload": 100, "review_responses": true, "top_placement": true, "custom_branding": true}', null, true, true, true);

-- =====================================================
-- 2. SERVICE CATEGORIES & TYPES
-- =====================================================
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

-- Insert Service Categories
INSERT INTO service_categories (name, slug, description, icon, sort_order, is_active) VALUES
('Manicures', 'manicures', 'Professional nail care for hands', 'fas fa-hand-paper', 1, true),
('Pedicures', 'pedicures', 'Professional nail care for feet', 'fas fa-shoe-prints', 2, true),
('Nail Art', 'nail-art', 'Creative and artistic nail designs', 'fas fa-palette', 3, true),
('Extensions', 'extensions', 'Acrylic, gel, and other nail extensions', 'fas fa-expand', 4, true),
('Treatments', 'treatments', 'Nail health and wellness treatments', 'fas fa-heart', 5, true);

-- Insert Service Types
INSERT INTO service_types (category_id, name, slug, description, duration_minutes, price_range_low, price_range_high, specialization_level, trend_status, filtering_priority, keywords) VALUES
-- Manicures
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'Basic Manicure', 'basic-manicure', 'Essential nail care with shaping and polish', 45, 25.00, 45.00, 'basic', 'stable', 'high', ARRAY['manicure', 'basic', 'polish']),
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'Gel Manicure', 'gel-manicure', 'Long-lasting gel polish application', 60, 35.00, 65.00, 'standard', 'growing', 'high', ARRAY['gel', 'manicure', 'long-lasting']),
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'French Manicure', 'french-manicure', 'Classic white tip design', 50, 30.00, 55.00, 'standard', 'stable', 'medium', ARRAY['french', 'classic', 'white tip']),
-- Pedicures
((SELECT id FROM service_categories WHERE slug = 'pedicures'), 'Basic Pedicure', 'basic-pedicure', 'Essential foot and nail care', 60, 35.00, 55.00, 'basic', 'stable', 'high', ARRAY['pedicure', 'basic', 'foot care']),
((SELECT id FROM service_categories WHERE slug = 'pedicures'), 'Spa Pedicure', 'spa-pedicure', 'Luxurious foot treatment with massage', 75, 45.00, 75.00, 'standard', 'growing', 'high', ARRAY['spa', 'pedicure', 'massage']),
((SELECT id FROM service_categories WHERE slug = 'pedicures'), 'Gel Pedicure', 'gel-pedicure', 'Long-lasting gel polish for toes', 70, 40.00, 70.00, 'standard', 'growing', 'medium', ARRAY['gel', 'pedicure', 'long-lasting']),
-- Nail Art
((SELECT id FROM service_categories WHERE slug = 'nail-art'), 'Custom Nail Art', 'custom-nail-art', 'Personalized artistic designs', 90, 50.00, 120.00, 'advanced', 'trending', 'medium', ARRAY['custom', 'art', 'design']),
((SELECT id FROM service_categories WHERE slug = 'nail-art'), 'Ombre Nails', 'ombre-nails', 'Gradient color transition', 75, 45.00, 85.00, 'standard', 'trending', 'medium', ARRAY['ombre', 'gradient', 'artistic']),
-- Extensions
((SELECT id FROM service_categories WHERE slug = 'extensions'), 'Acrylic Extensions', 'acrylic-extensions', 'Durable acrylic nail extensions', 120, 60.00, 100.00, 'standard', 'stable', 'high', ARRAY['acrylic', 'extensions', 'long nails']),
((SELECT id FROM service_categories WHERE slug = 'extensions'), 'Gel Extensions', 'gel-extensions', 'Natural-looking gel extensions', 110, 65.00, 110.00, 'standard', 'growing', 'high', ARRAY['gel', 'extensions', 'natural']);

-- =====================================================
-- 3. MAIN SALON PROFILES
-- =====================================================
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES vendor_tiers(id),
  
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

-- =====================================================
-- 4. SALON SERVICES & PRODUCTS
-- =====================================================
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

-- Insert Product Brands
INSERT INTO product_brands (name, slug, description, logo_url, website, is_premium, specialization) VALUES
('OPI', 'opi', 'Professional nail lacquer and treatments', null, 'https://www.opi.com', true, 'gel'),
('Essie', 'essie', 'Premium nail polish and care products', null, 'https://www.essie.com', true, 'natural'),
('CND', 'cnd', 'Creative Nail Design professional products', null, 'https://www.cnd.com', true, 'gel'),
('Gelish', 'gelish', 'Professional gel nail products', null, 'https://www.gelish.com', true, 'gel'),
('Kiara Sky', 'kiara-sky', 'Dip powder and gel systems', null, 'https://www.kiarasky.com', false, 'dip');

-- =====================================================
-- 5. REVIEWS & RATINGS
-- =====================================================
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

-- =====================================================
-- 6. BOOKINGS & BUSINESS FEATURES
-- =====================================================
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

-- =====================================================
-- 7. CONTENT & ANALYTICS
-- =====================================================
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

-- =====================================================
-- 8. DATABASE FUNCTIONS
-- =====================================================

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

-- Function to get salon count by review rating
CREATE OR REPLACE FUNCTION get_salon_review_count(salon_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  review_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO review_count
  FROM reviews 
  WHERE salon_id = get_salon_review_count.salon_id 
    AND is_published = true;
  
  RETURN COALESCE(review_count, 0);
END;
$$;

-- Function to get featured salons for homepage
CREATE OR REPLACE FUNCTION get_featured_salons(
  limit_count INTEGER DEFAULT 8
)
RETURNS TABLE(
  id UUID,
  name VARCHAR(200),
  slug VARCHAR(200),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  specialties TEXT[],
  is_verified BOOLEAN,
  average_rating DECIMAL(3,2),
  review_count INTEGER,
  logo_url TEXT,
  cover_image_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.slug,
    s.address,
    s.city,
    s.state,
    s.specialties,
    s.is_verified,
    calculate_salon_average_rating(s.id) as average_rating,
    get_salon_review_count(s.id) as review_count,
    s.logo_url,
    s.cover_image_url
  FROM salons s
  WHERE s.is_published = true
    AND s.is_featured = true
  ORDER BY 
    calculate_salon_average_rating(s.id) DESC,
    s.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply the trigger to relevant tables
CREATE TRIGGER update_salons_updated_at 
  BEFORE UPDATE ON salons 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON bookings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_translations_updated_at 
  BEFORE UPDATE ON content_translations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on main tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_placements ENABLE ROW LEVEL SECURITY;

-- Public read access for published salons
CREATE POLICY "Public can view published salons" ON salons
  FOR SELECT USING (is_published = true);

-- Salon owners can manage their own salons
CREATE POLICY "Owners can manage their salons" ON salons
  FOR ALL USING (auth.uid() = owner_id);

-- Public read access for salon services
CREATE POLICY "Public can view salon services" ON salon_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM salons 
      WHERE salons.id = salon_services.salon_id 
        AND salons.is_published = true
    )
  );

-- Public read access for published reviews
CREATE POLICY "Public can view published reviews" ON reviews
  FOR SELECT USING (is_published = true);

-- Users can create reviews
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- System can insert analytics events
CREATE POLICY "System can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON service_categories, service_types, product_brands, vendor_tiers TO anon, authenticated;
GRANT SELECT ON salons, salon_services, reviews TO anon, authenticated;
GRANT ALL ON salons, salon_services, reviews, bookings, analytics_events TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION increment_salon_view_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_salon_average_rating TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_salon_review_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_featured_salons TO anon, authenticated;

-- =====================================================
-- 10. PERFORMANCE INDEXES
-- =====================================================
CREATE INDEX idx_salons_location ON salons USING GIST (location);
CREATE INDEX idx_salons_tier_published ON salons (tier_id, is_published);
CREATE INDEX idx_salons_city_country ON salons (city, country);
CREATE INDEX idx_salons_specialties ON salons USING GIN (specialties);
CREATE INDEX idx_salons_languages ON salons USING GIN (languages_spoken);
CREATE INDEX idx_reviews_salon_rating ON reviews (salon_id, rating);
CREATE INDEX idx_bookings_salon_date ON bookings (salon_id, appointment_date);
CREATE INDEX idx_analytics_salon_date ON analytics_events (salon_id, created_at);
CREATE INDEX idx_featured_active_priority ON featured_placements (is_active, priority_score);

-- =====================================================
-- 11. SAMPLE DATA
-- =====================================================

-- Insert Sample Salons
INSERT INTO salons (
  name, slug, description, phone, email, website,
  address, city, state, country, postal_code, latitude, longitude,
  operating_hours, services_offered, specialties, languages_spoken,
  accepts_walk_ins, parking_available, price_range, price_from, currency,
  logo_url, cover_image_url, is_published, is_verified, is_featured,
  meta_title, meta_description, keywords
) VALUES
(
  'Luxe Nail Studio', 'luxe-nail-studio', 
  'Premium nail salon offering luxury manicures, pedicures, and custom nail art in the heart of downtown.',
  '(555) 123-4567', 'info@luxenails.com', 'https://luxenailstudio.com',
  '123 Main St', 'New York', 'NY', 'USA', '10001', 40.7505, -73.9934,
  '{"monday": {"open": "09:00", "close": "19:00"}, "tuesday": {"open": "09:00", "close": "19:00"}, "wednesday": {"open": "09:00", "close": "19:00"}, "thursday": {"open": "09:00", "close": "20:00"}, "friday": {"open": "09:00", "close": "20:00"}, "saturday": {"open": "08:00", "close": "18:00"}, "sunday": {"open": "10:00", "close": "17:00"}}',
  ARRAY['manicures', 'pedicures', 'nail-art', 'gel-polish'],
  ARRAY['luxury-service', 'custom-art', 'bridal-nails'],
  ARRAY['en', 'es'],
  false, true, 'premium', 35.00, 'USD',
  null, null, true, true, true,
  'Luxe Nail Studio - Premium Nail Salon NYC',
  'Experience luxury nail care at Luxe Nail Studio in NYC. Expert manicures, pedicures, and custom nail art.',
  ARRAY['nail salon nyc', 'luxury nails', 'custom nail art']
),
(
  'Bella Nails & Spa', 'bella-nails-spa',
  'Full-service nail salon and spa offering relaxing treatments in a comfortable environment.',
  '(555) 987-6543', 'hello@bellanails.com', 'https://bellanailsspa.com',
  '456 Oak Avenue', 'Los Angeles', 'CA', 'USA', '90210', 34.0736, -118.4004,
  '{"monday": {"open": "10:00", "close": "20:00"}, "tuesday": {"open": "10:00", "close": "20:00"}, "wednesday": {"open": "10:00", "close": "20:00"}, "thursday": {"open": "10:00", "close": "20:00"}, "friday": {"open": "10:00", "close": "21:00"}, "saturday": {"open": "09:00", "close": "21:00"}, "sunday": {"open": "10:00", "close": "19:00"}}',
  ARRAY['manicures', 'pedicures', 'spa-treatments', 'waxing'],
  ARRAY['spa-experience', 'couples-packages', 'group-events'],
  ARRAY['en', 'ko'],
  true, true, 'mid-range', 28.00, 'USD',
  null, null, true, true, true,
  'Bella Nails & Spa - Relaxing Nail Salon LA',
  'Unwind at Bella Nails & Spa in Los Angeles. Full nail services plus spa treatments for ultimate relaxation.',
  ARRAY['nail salon la', 'spa treatments', 'relaxing nails']
),
(
  'Quick Nails Express', 'quick-nails-express',
  'Fast and affordable nail services for busy professionals. No appointment necessary.',
  '(555) 456-7890', 'info@quicknails.com', null,
  '789 Business Blvd', 'Chicago', 'IL', 'USA', '60601', 41.8781, -87.6298,
  '{"monday": {"open": "08:00", "close": "20:00"}, "tuesday": {"open": "08:00", "close": "20:00"}, "wednesday": {"open": "08:00", "close": "20:00"}, "thursday": {"open": "08:00", "close": "20:00"}, "friday": {"open": "08:00", "close": "20:00"}, "saturday": {"open": "09:00", "close": "19:00"}, "sunday": {"open": "11:00", "close": "17:00"}}',
  ARRAY['quick-manicures', 'express-pedicures', 'polish-change'],
  ARRAY['express-service', 'walk-ins-welcome', 'business-professional'],
  ARRAY['en'],
  true, false, 'budget', 15.00, 'USD',
  null, null, true, false, false,
  'Quick Nails Express - Fast Nail Services Chicago',
  'Quick and affordable nail services in Chicago. No appointment needed. Perfect for busy professionals.',
  ARRAY['quick nails chicago', 'express manicure', 'walk in nails']
),
(
  'Artisan Nail Gallery', 'artisan-nail-gallery',
  'Artistic nail designs and premium services by award-winning nail technicians.',
  '(555) 321-0987', 'create@artisannails.com', 'https://artisannailgallery.com',
  '321 Creative Way', 'Miami', 'FL', 'USA', '33101', 25.7617, -80.1918,
  '{"tuesday": {"open": "10:00", "close": "18:00"}, "wednesday": {"open": "10:00", "close": "18:00"}, "thursday": {"open": "10:00", "close": "20:00"}, "friday": {"open": "10:00", "close": "20:00"}, "saturday": {"open": "09:00", "close": "19:00"}, "sunday": {"open": "12:00", "close": "17:00"}}',
  ARRAY['nail-art', 'sculptured-nails', 'custom-designs', 'competitions'],
  ARRAY['award-winning', 'artistic-designs', 'competition-level', 'celebrity-clients'],
  ARRAY['en', 'es'],
  false, true, 'premium', 75.00, 'USD',
  null, null, true, true, true,
  'Artisan Nail Gallery - Award-Winning Nail Art Miami',
  'Experience award-winning nail artistry at Artisan Nail Gallery in Miami. Custom designs by expert technicians.',
  ARRAY['nail art miami', 'custom nail designs', 'award winning nails']
);

-- Insert Salon Services (linking salons to service types)
-- Luxe Nail Studio services
INSERT INTO salon_services (salon_id, service_type_id, price, duration_minutes, description, is_available, requires_appointment, online_booking_enabled) VALUES
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), (SELECT id FROM service_types WHERE slug = 'gel-manicure'), 55.00, 60, 'Premium gel manicure with luxury care', true, true, true),
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), (SELECT id FROM service_types WHERE slug = 'spa-pedicure'), 70.00, 75, 'Luxury spa pedicure experience', true, true, true),
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), (SELECT id FROM service_types WHERE slug = 'custom-nail-art'), 95.00, 90, 'Bespoke nail art by expert artists', true, true, false),

-- Bella Nails services
((SELECT id FROM salons WHERE slug = 'bella-nails-spa'), (SELECT id FROM service_types WHERE slug = 'basic-manicure'), 30.00, 45, 'Classic manicure in relaxing environment', true, false, false),
((SELECT id FROM salons WHERE slug = 'bella-nails-spa'), (SELECT id FROM service_types WHERE slug = 'basic-pedicure'), 40.00, 60, 'Soothing pedicure with massage', true, false, false),
((SELECT id FROM salons WHERE slug = 'bella-nails-spa'), (SELECT id FROM service_types WHERE slug = 'gel-manicure'), 45.00, 60, 'Long-lasting gel polish', true, true, false),

-- Quick Nails services
((SELECT id FROM salons WHERE slug = 'quick-nails-express'), (SELECT id FROM service_types WHERE slug = 'basic-manicure'), 20.00, 30, 'Fast basic manicure service', true, false, false),
((SELECT id FROM salons WHERE slug = 'quick-nails-express'), (SELECT id FROM service_types WHERE slug = 'basic-pedicure'), 25.00, 40, 'Quick pedicure service', true, false, false),

-- Artisan Gallery services
((SELECT id FROM salons WHERE slug = 'artisan-nail-gallery'), (SELECT id FROM service_types WHERE slug = 'custom-nail-art'), 150.00, 120, 'Competition-level artistic designs', true, true, true),
((SELECT id FROM salons WHERE slug = 'artisan-nail-gallery'), (SELECT id FROM service_types WHERE slug = 'ombre-nails'), 85.00, 75, 'Professional gradient designs', true, true, true),
((SELECT id FROM salons WHERE slug = 'artisan-nail-gallery'), (SELECT id FROM service_types WHERE slug = 'acrylic-extensions'), 90.00, 120, 'Sculptured acrylic extensions', true, true, false);

-- Insert Sample Reviews
INSERT INTO reviews (salon_id, rating, title, content, service_type, is_verified, is_published, reviewer_anonymous_id) VALUES
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), 5, 'Amazing Experience!', 'The gel manicure was perfect and lasted 3 weeks. The staff is professional and the salon is beautiful.', 'Gel Manicure', true, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), 4, 'Great nail art', 'Love my custom design! Took a bit longer than expected but totally worth it.', 'Custom Nail Art', false, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), 5, 'Best pedicure ever', 'The spa pedicure was incredibly relaxing. My feet feel amazing and the polish is still perfect after 2 weeks.', 'Spa Pedicure', true, true, uuid_generate_v4()),

((SELECT id FROM salons WHERE slug = 'bella-nails-spa'), 4, 'Good value', 'Nice salon with friendly staff. Basic manicure was well done and reasonably priced.', 'Basic Manicure', false, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'bella-nails-spa'), 5, 'So relaxing', 'The atmosphere is very calming and the pedicure was wonderful. Will definitely return.', 'Basic Pedicure', true, true, uuid_generate_v4()),

((SELECT id FROM salons WHERE slug = 'quick-nails-express'), 3, 'Fast service', 'Quick and efficient but nothing special. Good for when you are in a hurry.', 'Basic Manicure', false, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'quick-nails-express'), 4, 'Perfect for busy schedule', 'Love that I can walk in without appointment. Service is basic but gets the job done.', 'Basic Pedicure', false, true, uuid_generate_v4()),

((SELECT id FROM salons WHERE slug = 'artisan-nail-gallery'), 5, 'Incredible artistry', 'The nail art here is on another level. Expensive but worth every penny for special occasions.', 'Custom Nail Art', true, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'artisan-nail-gallery'), 5, 'Award-winning quality', 'You can tell these technicians are true artists. My ombre nails are absolutely stunning.', 'Ombre Nails', true, true, uuid_generate_v4());

-- Insert Featured Placements for homepage
INSERT INTO featured_placements (salon_id, placement_type, position, priority_score, start_date, end_date, is_active, rotation_weight) VALUES
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), 'homepage', 1, 100, now() - interval '1 day', now() + interval '30 days', true, 1.0),
((SELECT id FROM salons WHERE slug = 'artisan-nail-gallery'), 'homepage', 2, 90, now() - interval '1 day', now() + interval '30 days', true, 0.8),
((SELECT id FROM salons WHERE slug = 'bella-nails-spa'), 'homepage', 3, 80, now() - interval '1 day', now() + interval '30 days', true, 0.6);

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your Nail Nav database is now ready with:
-- ✅ All tables created
-- ✅ Sample data inserted  
-- ✅ Functions and triggers set up
-- ✅ Row Level Security configured
-- ✅ Performance indexes created
--
-- Test your connection with: 
-- curl http://localhost:3000/api/supabase-test
-- =====================================================