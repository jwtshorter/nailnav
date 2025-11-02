-- =====================================================
-- PHASE 1: DATABASE SCHEMA FIX FOR REAL DATA INTEGRATION
-- =====================================================
-- This migration aligns the database schema with frontend expectations
-- and adds missing tables and functions
--
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Add missing columns to salons table
-- =====================================================

-- Add state column (extract from cities table)
ALTER TABLE salons 
ADD COLUMN IF NOT EXISTS state VARCHAR(100);

-- Add country column (default Australia for imported data)
ALTER TABLE salons 
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Australia';

-- Add postal_code column (can be populated later)
ALTER TABLE salons 
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);

-- Add specialties array
ALTER TABLE salons 
ADD COLUMN IF NOT EXISTS specialties TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add services_offered array
ALTER TABLE salons 
ADD COLUMN IF NOT EXISTS services_offered TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add languages_spoken array
ALTER TABLE salons 
ADD COLUMN IF NOT EXISTS languages_spoken TEXT[] DEFAULT ARRAY['English'];

-- Add price_range enum-like field
ALTER TABLE salons 
ADD COLUMN IF NOT EXISTS price_range VARCHAR(20) DEFAULT 'mid-range' 
CHECK (price_range IN ('budget', 'mid-range', 'premium'));

-- Add owner_id for vendor claiming
ALTER TABLE salons 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add city name directly for easier querying
ALTER TABLE salons 
ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Add price_from field
ALTER TABLE salons 
ADD COLUMN IF NOT EXISTS price_from DECIMAL(10,2);

-- Add currency field
ALTER TABLE salons 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'AUD';

-- Add view_count if not exists (might already exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='salons' AND column_name='view_count'
    ) THEN
        ALTER TABLE salons ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Step 2: Populate new columns with existing data
-- =====================================================

-- Populate city names from cities table
UPDATE salons s
SET city = c.name
FROM cities c
WHERE s.city_id = c.id AND s.city IS NULL;

-- Populate state (you may need to adjust based on your cities table structure)
-- For now, extracting from city names or setting default
UPDATE salons 
SET state = CASE 
    WHEN city LIKE '%Sydney%' OR city LIKE '%NSW%' THEN 'NSW'
    WHEN city LIKE '%Melbourne%' OR city LIKE '%VIC%' THEN 'VIC'
    WHEN city LIKE '%Brisbane%' OR city LIKE '%QLD%' THEN 'QLD'
    WHEN city LIKE '%Perth%' OR city LIKE '%WA%' THEN 'WA'
    WHEN city LIKE '%Adelaide%' OR city LIKE '%SA%' THEN 'SA'
    WHEN city LIKE '%Darwin%' OR city LIKE '%NT%' THEN 'NT'
    WHEN city LIKE '%Hobart%' OR city LIKE '%TAS%' THEN 'TAS'
    WHEN city LIKE '%Canberra%' OR city LIKE '%ACT%' THEN 'ACT'
    ELSE 'VIC' -- Default fallback
END
WHERE state IS NULL;

-- Populate services_offered array from boolean flags
UPDATE salons
SET services_offered = ARRAY(
    SELECT service_name 
    FROM (
        SELECT CASE WHEN manicure THEN 'Manicure' END AS service_name
        UNION ALL SELECT CASE WHEN pedicure THEN 'Pedicure' END
        UNION ALL SELECT CASE WHEN gel_nails THEN 'Gel Nails' END
        UNION ALL SELECT CASE WHEN acrylic_nails THEN 'Acrylic Nails' END
        UNION ALL SELECT CASE WHEN nail_art THEN 'Nail Art' END
        UNION ALL SELECT CASE WHEN dip_powder THEN 'Dip Powder' END
        UNION ALL SELECT CASE WHEN shellac THEN 'Shellac' END
        UNION ALL SELECT CASE WHEN nail_extensions THEN 'Nail Extensions' END
        UNION ALL SELECT CASE WHEN nail_repair THEN 'Nail Repair' END
        UNION ALL SELECT CASE WHEN cuticle_care THEN 'Cuticle Care' END
    ) AS services
    WHERE service_name IS NOT NULL
)
WHERE services_offered = ARRAY[]::TEXT[];

-- Populate specialties array from feature flags
UPDATE salons
SET specialties = ARRAY(
    SELECT specialty_name 
    FROM (
        SELECT CASE WHEN master_artist THEN 'Master Nail Artist' END AS specialty_name
        UNION ALL SELECT CASE WHEN certified_technicians THEN 'Certified Technicians' END
        UNION ALL SELECT CASE WHEN experienced_staff THEN 'Experienced Team' END
        UNION ALL SELECT CASE WHEN luxury_experience THEN 'Luxury Experience' END
        UNION ALL SELECT CASE WHEN relaxing_atmosphere THEN 'Relaxing Atmosphere' END
        UNION ALL SELECT CASE WHEN modern_facilities THEN 'Modern Facilities' END
        UNION ALL SELECT CASE WHEN clean_hygienic THEN 'Clean & Hygienic' END
        UNION ALL SELECT CASE WHEN quick_service THEN 'Quick Service' END
        UNION ALL SELECT CASE WHEN premium_products THEN 'Premium Products' END
    ) AS specs
    WHERE specialty_name IS NOT NULL
)
WHERE specialties = ARRAY[]::TEXT[];

-- Set default price_from based on rating and features
UPDATE salons
SET price_from = CASE 
    WHEN premium_products OR luxury_experience THEN 65.00
    WHEN rating >= 4.5 THEN 45.00
    ELSE 35.00
END
WHERE price_from IS NULL;

-- Step 3: Create reviews table
-- =====================================================

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    title VARCHAR(200),
    content TEXT,
    service_type VARCHAR(100),
    reviewer_name VARCHAR(100),
    is_verified BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    is_moderated BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_salon_id ON reviews(salon_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published) WHERE is_published = true;

-- Step 4: Create database functions
-- =====================================================

-- Function to get featured salons
CREATE OR REPLACE FUNCTION get_featured_salons(limit_count INTEGER DEFAULT 8)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(200),
    slug VARCHAR(200),
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    phone VARCHAR(50),
    website VARCHAR(500),
    description TEXT,
    price_range VARCHAR(20),
    price_from DECIMAL(10,2),
    currency VARCHAR(3),
    specialties TEXT[],
    services_offered TEXT[],
    languages_spoken TEXT[],
    is_verified BOOLEAN,
    is_featured BOOLEAN,
    rating DECIMAL(3,2),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    cover_image_url TEXT,
    average_rating DECIMAL(3,2),
    review_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.slug,
        s.address,
        s.city,
        s.state,
        s.country,
        s.phone,
        s.website,
        s.description,
        s.price_range,
        s.price_from,
        s.currency,
        s.specialties,
        s.services_offered,
        s.languages_spoken,
        s.is_verified,
        s.is_featured,
        s.rating,
        s.latitude,
        s.longitude,
        s.cover_image_url,
        COALESCE(AVG(r.rating), s.rating) as average_rating,
        COUNT(r.id) as review_count
    FROM salons s
    LEFT JOIN reviews r ON r.salon_id = s.id AND r.is_published = true
    WHERE s.is_featured = true 
        AND s.is_published = true
    GROUP BY s.id
    ORDER BY average_rating DESC, s.rating DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_salon_view_count(salon_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    UPDATE salons 
    SET view_count = view_count + 1
    WHERE id = salon_id_param
    RETURNING view_count INTO new_count;
    
    RETURN COALESCE(new_count, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to search salons by location (simplified version)
CREATE OR REPLACE FUNCTION search_salons_by_location(
    search_city VARCHAR DEFAULT NULL,
    search_state VARCHAR DEFAULT NULL,
    search_verified BOOLEAN DEFAULT NULL,
    search_walk_ins BOOLEAN DEFAULT NULL,
    search_parking BOOLEAN DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(200),
    slug VARCHAR(200),
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    phone VARCHAR(50),
    website VARCHAR(500),
    description TEXT,
    price_range VARCHAR(20),
    price_from DECIMAL(10,2),
    currency VARCHAR(3),
    specialties TEXT[],
    services_offered TEXT[],
    languages_spoken TEXT[],
    is_verified BOOLEAN,
    is_featured BOOLEAN,
    rating DECIMAL(3,2),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    average_rating DECIMAL(3,2),
    review_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.slug,
        s.address,
        s.city,
        s.state,
        s.country,
        s.phone,
        s.website,
        s.description,
        s.price_range,
        s.price_from,
        s.currency,
        s.specialties,
        s.services_offered,
        s.languages_spoken,
        s.is_verified,
        s.is_featured,
        s.rating,
        s.latitude,
        s.longitude,
        COALESCE(AVG(r.rating), s.rating) as average_rating,
        COUNT(r.id) as review_count
    FROM salons s
    LEFT JOIN reviews r ON r.salon_id = s.id AND r.is_published = true
    WHERE s.is_published = true
        AND (search_city IS NULL OR s.city ILIKE '%' || search_city || '%')
        AND (search_state IS NULL OR s.state ILIKE '%' || search_state || '%')
        AND (search_verified IS NULL OR s.is_verified = search_verified)
        AND (search_walk_ins IS NULL OR s.accepts_walk_ins = search_walk_ins)
        AND (search_parking IS NULL OR s.parking = search_parking)
    GROUP BY s.id
    ORDER BY s.is_featured DESC, average_rating DESC, s.rating DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get popular salons
CREATE OR REPLACE FUNCTION get_popular_salons(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(200),
    slug VARCHAR(200),
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
    phone VARCHAR(50),
    website VARCHAR(500),
    price_from DECIMAL(10,2),
    currency VARCHAR(3),
    specialties TEXT[],
    is_verified BOOLEAN,
    rating DECIMAL(3,2),
    average_rating DECIMAL(3,2),
    review_count BIGINT,
    popularity_score DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.slug,
        s.address,
        s.city,
        s.state,
        s.phone,
        s.website,
        s.price_from,
        s.currency,
        s.specialties,
        s.is_verified,
        s.rating,
        COALESCE(AVG(r.rating), s.rating) as average_rating,
        COUNT(r.id) as review_count,
        (COUNT(r.id) * COALESCE(AVG(r.rating), s.rating)) as popularity_score
    FROM salons s
    LEFT JOIN reviews r ON r.salon_id = s.id AND r.is_published = true
    WHERE s.is_published = true
    GROUP BY s.id
    HAVING COUNT(r.id) >= 3 OR s.rating >= 4.5
    ORDER BY popularity_score DESC, average_rating DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Add helpful indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_salons_slug ON salons(slug);
CREATE INDEX IF NOT EXISTS idx_salons_city ON salons(city);
CREATE INDEX IF NOT EXISTS idx_salons_state ON salons(state);
CREATE INDEX IF NOT EXISTS idx_salons_featured ON salons(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_salons_published ON salons(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_salons_rating ON salons(rating DESC);
CREATE INDEX IF NOT EXISTS idx_salons_owner_id ON salons(owner_id);

-- Step 6: Update a few salons to be featured (for testing)
-- =====================================================

UPDATE salons 
SET is_featured = true
WHERE rating >= 4.7 
    AND is_published = true
LIMIT 12;

-- Step 7: Add some sample reviews (optional - for testing)
-- =====================================================

INSERT INTO reviews (salon_id, rating, title, content, reviewer_name, is_published, created_at)
SELECT 
    s.id,
    4.5 + (random() * 0.5), -- Rating between 4.5 and 5.0
    'Great service!',
    'Really enjoyed my visit. The staff were professional and the results were excellent.',
    'Happy Customer',
    true,
    now() - (random() * interval '30 days')
FROM salons s
WHERE s.rating >= 4.5
LIMIT 50;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- 
-- Summary of changes:
-- ✅ Added missing columns to salons table
-- ✅ Populated new columns with existing data
-- ✅ Created reviews table
-- ✅ Created database functions
-- ✅ Added indexes for performance
-- ✅ Set 12 salons as featured
-- ✅ Added 50 sample reviews
--
-- Next steps:
-- 1. Verify data: SELECT * FROM salons LIMIT 5;
-- 2. Test functions: SELECT * FROM get_featured_salons(8);
-- 3. Check reviews: SELECT * FROM reviews LIMIT 5;
-- =====================================================
