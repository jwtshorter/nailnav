-- Database Functions for Nail Nav

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

-- Function to search salons by location and filters
CREATE OR REPLACE FUNCTION search_salons_by_location(
  search_lat DECIMAL(10,8) DEFAULT NULL,
  search_lng DECIMAL(11,8) DEFAULT NULL,
  search_radius_km INTEGER DEFAULT 50,
  search_city TEXT DEFAULT NULL,
  search_services TEXT[] DEFAULT NULL,
  search_verified BOOLEAN DEFAULT NULL,
  search_walk_ins BOOLEAN DEFAULT NULL,
  search_parking BOOLEAN DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  name VARCHAR(200),
  slug VARCHAR(200),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  phone VARCHAR(20),
  price_from DECIMAL(10,2),
  currency VARCHAR(3),
  specialties TEXT[],
  is_verified BOOLEAN,
  average_rating DECIMAL(3,2),
  review_count INTEGER,
  distance_meters INTEGER,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8)
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
    s.website,
    s.price_from,
    s.currency,
    s.specialties,
    s.is_verified,
    calculate_salon_average_rating(s.id) as average_rating,
    get_salon_review_count(s.id) as review_count,
    CASE 
      WHEN search_lat IS NOT NULL AND search_lng IS NOT NULL THEN
        ROUND(ST_Distance(
          s.location,
          ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)
        ))::INTEGER
      ELSE NULL
    END as distance_meters,
    s.latitude,
    s.longitude
  FROM salons s
  WHERE s.is_published = true
    -- Location filter
    AND (
      search_lat IS NULL OR search_lng IS NULL OR
      ST_DWithin(
        s.location,
        ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326),
        search_radius_km * 1000
      )
    )
    -- City filter
    AND (search_city IS NULL OR s.city ILIKE '%' || search_city || '%')
    -- Services filter (check if any of search_services overlap with salon specialties)
    AND (search_services IS NULL OR s.specialties && search_services)
    -- Verified filter
    AND (search_verified IS NULL OR s.is_verified = search_verified)
    -- Walk-ins filter
    AND (search_walk_ins IS NULL OR s.accepts_walk_ins = search_walk_ins)
    -- Parking filter
    AND (search_parking IS NULL OR s.parking_available = search_parking)
  ORDER BY 
    -- Featured salons first
    s.is_featured DESC,
    -- Then by distance if location provided
    CASE 
      WHEN search_lat IS NOT NULL AND search_lng IS NOT NULL THEN
        ST_Distance(s.location, ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326))
      ELSE 0
    END ASC,
    -- Then by average rating
    calculate_salon_average_rating(s.id) DESC,
    -- Finally by name
    s.name ASC
  LIMIT limit_count OFFSET offset_count;
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
    -- Check for active featured placements
    (
      SELECT fp.priority_score 
      FROM featured_placements fp 
      WHERE fp.salon_id = s.id 
        AND fp.is_active = true 
        AND fp.placement_type = 'homepage'
        AND (fp.end_date IS NULL OR fp.end_date > now())
      ORDER BY fp.priority_score DESC 
      LIMIT 1
    ) DESC NULLS LAST,
    -- Then by average rating
    calculate_salon_average_rating(s.id) DESC,
    -- Finally by creation date (newer first)
    s.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Trigger to update salon updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply the trigger to salons table
CREATE TRIGGER update_salons_updated_at 
  BEFORE UPDATE ON salons 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Apply the trigger to bookings table
CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON bookings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Apply the trigger to content_translations table
CREATE TRIGGER update_content_translations_updated_at 
  BEFORE UPDATE ON content_translations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
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

-- Admins can manage all salons
CREATE POLICY "Admins can manage all salons" ON salons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id 
        AND raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Public read access for salon services
CREATE POLICY "Public can view salon services" ON salon_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM salons 
      WHERE salons.id = salon_services.salon_id 
        AND salons.is_published = true
    )
  );

-- Salon owners can manage their salon services
CREATE POLICY "Owners can manage their salon services" ON salon_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM salons 
      WHERE salons.id = salon_services.salon_id 
        AND salons.owner_id = auth.uid()
    )
  );

-- Public read access for published reviews
CREATE POLICY "Public can view published reviews" ON reviews
  FOR SELECT USING (is_published = true);

-- Users can create reviews
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Salon owners can view all reviews for their salons
CREATE POLICY "Owners can view their salon reviews" ON reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM salons 
      WHERE salons.id = reviews.salon_id 
        AND salons.owner_id = auth.uid()
    )
  );

-- Booking policies
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Salon owners can view bookings for their salons" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM salons 
      WHERE salons.id = bookings.salon_id 
        AND salons.owner_id = auth.uid()
    )
  );

CREATE POLICY "Salon owners can update bookings for their salons" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM salons 
      WHERE salons.id = bookings.salon_id 
        AND salons.owner_id = auth.uid()
    )
  );

-- Analytics policies (only salon owners and admins)
CREATE POLICY "Owners can view their salon analytics" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM salons 
      WHERE salons.id = analytics_events.salon_id 
        AND salons.owner_id = auth.uid()
    )
  );

CREATE POLICY "System can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Featured placements (admin only)
CREATE POLICY "Admins can manage featured placements" ON featured_placements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id 
        AND raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- Public tables (no RLS needed - fully public read access)
-- service_categories, service_types, product_brands, vendor_tiers

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON service_categories, service_types, product_brands, vendor_tiers TO anon, authenticated;
GRANT SELECT ON salons, salon_services, reviews TO anon, authenticated;
GRANT ALL ON salons, salon_services, reviews, bookings, analytics_events TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION increment_salon_view_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_salon_average_rating TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_salon_review_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_salons_by_location TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_featured_salons TO anon, authenticated;