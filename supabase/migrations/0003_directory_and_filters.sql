-- =====================================================
-- Directory Structure & Salon Filters Migration
-- =====================================================
-- This migration adds:
-- 1. Location hierarchy tables for SEO directory pages
-- 2. Comprehensive salon filter columns from Excel data
-- 3. Enhanced salon fields for imported data
-- 4. Indexes for performance and nearby salon queries
-- =====================================================

-- ============ LOCATION HIERARCHY TABLES ============

-- Countries table for directory pages
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(3) NOT NULL UNIQUE, -- ISO country code (USA, AUS)
  salon_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  meta_title VARCHAR(200),
  meta_description TEXT,
  faq_items JSONB, -- [{"question": "...", "answer": "..."}]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- States/Provinces table for directory pages
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  code VARCHAR(10), -- State code (CA, NY, NSW, VIC)
  salon_count INTEGER DEFAULT 0,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  meta_title VARCHAR(200),
  meta_description TEXT,
  faq_items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(country_id, slug)
);

-- Cities table for directory pages
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_id UUID REFERENCES states(id) ON DELETE CASCADE,
  country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  salon_count INTEGER DEFAULT 0,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
  population INTEGER,
  timezone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  meta_title VARCHAR(200),
  meta_description TEXT,
  faq_items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(state_id, slug)
);

-- ============ ENHANCE SALONS TABLE ============

-- Add Google Place ID and external data fields
ALTER TABLE salons ADD COLUMN IF NOT EXISTS place_id VARCHAR(200) UNIQUE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS google_rating DECIMAL(2,1);
ALTER TABLE salons ADD COLUMN IF NOT EXISTS google_review_count INTEGER DEFAULT 0;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS competitors JSONB; -- Array of competitor data
ALTER TABLE salons ADD COLUMN IF NOT EXISTS review_keywords TEXT[];
ALTER TABLE salons ADD COLUMN IF NOT EXISTS owner_name VARCHAR(200);
ALTER TABLE salons ADD COLUMN IF NOT EXISTS is_spending_on_ads BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS is_temporarily_closed BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS closed_on TEXT[];
ALTER TABLE salons ADD COLUMN IF NOT EXISTS can_claim BOOLEAN DEFAULT true;

-- Add foreign key to cities table
ALTER TABLE salons ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES cities(id);

-- ============ SALON FILTER COLUMNS ============
-- Services offered (BE-BN)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_manicure BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_gel_manicure BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_gel_x BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_gel_extensions BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_acrylic_nails BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_pedicure BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_gel_pedicure BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_dip_powder BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_builders_gel BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_nail_art BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_massage BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_facials BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_eyelashes BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_brows BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_waxing BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_haircuts BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS offers_hand_foot_treatment BOOLEAN DEFAULT false;

-- Languages (BX-CB)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS lang_basic_english BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS lang_fluent_english BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS lang_spanish BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS lang_vietnamese BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS lang_chinese BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS lang_korean BOOLEAN DEFAULT false;

-- Expertise & Staff (CC-CG)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS qualified_technicians BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS experienced_team BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS quick_service BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS award_winning_staff BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS master_nail_artist BOOLEAN DEFAULT false;

-- Booking & Services (CH-CL)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS bridal_nails BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS appointment_required BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS walk_ins_welcome BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS group_bookings BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS mobile_nails BOOLEAN DEFAULT false;

-- Atmosphere (CM-CQ)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS kid_friendly BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS child_play_area BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS adult_only BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS pet_friendly BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS lgbtqi_friendly BOOLEAN DEFAULT false;

-- Accessibility & Ownership (CR-CT)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS wheelchair_accessible BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS female_owned BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS minority_owned BOOLEAN DEFAULT false;

-- Amenities (CU-CY)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS complimentary_drink BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS heated_massage_chairs BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS foot_spas BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS free_wifi BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS parking BOOLEAN DEFAULT false;

-- Health & Safety (CZ-DE)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS autoclave_sterilisation BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS led_curing BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS non_toxic_treatments BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS eco_friendly_products BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS cruelty_free_products BOOLEAN DEFAULT false;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS vegan_polish BOOLEAN DEFAULT false;

-- Generated description from filters (DG column)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS generated_description TEXT;

-- ============ INDEXES FOR PERFORMANCE ============

-- Location-based indexes
CREATE INDEX IF NOT EXISTS idx_cities_location ON cities USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_salons_location ON salons USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_salons_city_id ON salons(city_id);
CREATE INDEX IF NOT EXISTS idx_salons_country ON salons(country);
CREATE INDEX IF NOT EXISTS idx_salons_state ON salons(state);
CREATE INDEX IF NOT EXISTS idx_salons_city ON salons(city);

-- Directory page indexes
CREATE INDEX IF NOT EXISTS idx_countries_slug ON countries(slug);
CREATE INDEX IF NOT EXISTS idx_states_slug ON states(slug);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
CREATE INDEX IF NOT EXISTS idx_states_country ON states(country_id);
CREATE INDEX IF NOT EXISTS idx_cities_state ON cities(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country_id);

-- Filter indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_salons_walk_ins ON salons(walk_ins_welcome) WHERE walk_ins_welcome = true;
CREATE INDEX IF NOT EXISTS idx_salons_parking ON salons(parking) WHERE parking = true;
CREATE INDEX IF NOT EXISTS idx_salons_wheelchair ON salons(wheelchair_accessible) WHERE wheelchair_accessible = true;
CREATE INDEX IF NOT EXISTS idx_salons_kid_friendly ON salons(kid_friendly) WHERE kid_friendly = true;
CREATE INDEX IF NOT EXISTS idx_salons_master_artist ON salons(master_nail_artist) WHERE master_nail_artist = true;

-- Google data indexes
CREATE INDEX IF NOT EXISTS idx_salons_place_id ON salons(place_id);
CREATE INDEX IF NOT EXISTS idx_salons_rating ON salons(google_rating DESC);
CREATE INDEX IF NOT EXISTS idx_salons_published ON salons(is_published) WHERE is_published = true;

-- ============ HELPER FUNCTIONS ============

-- Function to calculate nearby cities (within 150km)
CREATE OR REPLACE FUNCTION get_nearby_cities(
  p_city_id UUID,
  p_radius_meters INTEGER DEFAULT 150000 -- 150km
)
RETURNS TABLE (
  city_id UUID,
  city_name VARCHAR,
  state_name VARCHAR,
  slug VARCHAR,
  distance_meters FLOAT,
  salon_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    s.name as state_name,
    c.slug,
    ST_Distance(c.location, ref.location)::FLOAT as distance_meters,
    c.salon_count
  FROM cities c
  CROSS JOIN (SELECT location FROM cities WHERE id = p_city_id) ref
  JOIN states s ON c.state_id = s.id
  WHERE c.id != p_city_id
    AND ST_DWithin(c.location, ref.location, p_radius_meters)
  ORDER BY distance_meters ASC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function to update salon counts
CREATE OR REPLACE FUNCTION update_location_salon_counts()
RETURNS void AS $$
BEGIN
  -- Update city counts
  UPDATE cities c
  SET salon_count = (
    SELECT COUNT(*) 
    FROM salons s 
    WHERE s.city_id = c.id AND s.is_published = true
  );
  
  -- Update state counts
  UPDATE states st
  SET salon_count = (
    SELECT COALESCE(SUM(c.salon_count), 0)
    FROM cities c
    WHERE c.state_id = st.id
  );
  
  -- Update country counts
  UPDATE countries co
  SET salon_count = (
    SELECT COALESCE(SUM(st.salon_count), 0)
    FROM states st
    WHERE st.country_id = co.id
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger to update counts when salons change
CREATE OR REPLACE FUNCTION trigger_update_location_counts()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_location_salon_counts();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS salon_count_update ON salons;
CREATE TRIGGER salon_count_update
  AFTER INSERT OR UPDATE OR DELETE ON salons
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_update_location_counts();

-- ============ SEED INITIAL LOCATION DATA ============

-- Insert Australia
INSERT INTO countries (name, slug, code, meta_title, meta_description) 
VALUES (
  'Australia', 
  'australia', 
  'AUS',
  'Find Nail Salons Across Australia',
  'Discover the best nail salons in Australia. Browse by state and city to find top-rated manicure, pedicure, and nail art services near you.'
)
ON CONFLICT (code) DO NOTHING;

-- Insert USA
INSERT INTO countries (name, slug, code, meta_title, meta_description)
VALUES (
  'United States',
  'usa',
  'USA',
  'Find Nail Salons Across the USA',
  'Discover the best nail salons in the United States. Browse by state and city to find top-rated manicure, pedicure, and nail art services near you.'
)
ON CONFLICT (code) DO NOTHING;

-- Insert Australian States
INSERT INTO states (country_id, name, slug, code, latitude, longitude, meta_title) VALUES
  ((SELECT id FROM countries WHERE code = 'AUS'), 'New South Wales', 'new-south-wales', 'NSW', -33.8688, 151.2093, 'Nail Salons in New South Wales'),
  ((SELECT id FROM countries WHERE code = 'AUS'), 'Victoria', 'victoria', 'VIC', -37.8136, 144.9631, 'Nail Salons in Victoria'),
  ((SELECT id FROM countries WHERE code = 'AUS'), 'Queensland', 'queensland', 'QLD', -27.4698, 153.0251, 'Nail Salons in Queensland'),
  ((SELECT id FROM countries WHERE code = 'AUS'), 'South Australia', 'south-australia', 'SA', -34.9285, 138.6007, 'Nail Salons in South Australia'),
  ((SELECT id FROM countries WHERE code = 'AUS'), 'Western Australia', 'western-australia', 'WA', -31.9505, 115.8605, 'Nail Salons in Western Australia'),
  ((SELECT id FROM countries WHERE code = 'AUS'), 'Tasmania', 'tasmania', 'TAS', -42.8821, 147.3272, 'Nail Salons in Tasmania'),
  ((SELECT id FROM countries WHERE code = 'AUS'), 'Northern Territory', 'northern-territory', 'NT', -12.4634, 130.8456, 'Nail Salons in Northern Territory'),
  ((SELECT id FROM countries WHERE code = 'AUS'), 'Australian Capital Territory', 'australian-capital-territory', 'ACT', -35.2809, 149.1300, 'Nail Salons in Australian Capital Territory')
ON CONFLICT (country_id, slug) DO NOTHING;

COMMENT ON TABLE countries IS 'Top-level location hierarchy for directory SEO pages';
COMMENT ON TABLE states IS 'State/province level for directory SEO pages with salon counts';
COMMENT ON TABLE cities IS 'City level for directory SEO pages with nearby city calculations';
COMMENT ON FUNCTION get_nearby_cities IS 'Returns cities within 150km radius for internal linking';
COMMENT ON FUNCTION update_location_salon_counts IS 'Updates salon counts across location hierarchy';
