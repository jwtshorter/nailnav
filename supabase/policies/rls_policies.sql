-- Enable RLS on all tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_services ENABLE ROW LEVEL SECURITY;

-- Public read access for published salons
CREATE POLICY "salons_public_select" 
ON salons 
FOR SELECT 
USING ( is_published = true );

-- Vendors can update their own salons
CREATE POLICY "salons_vendor_update" 
ON salons 
FOR UPDATE 
USING ( auth.uid() = owner_id );

-- Vendors can insert their own salon
CREATE POLICY "salons_vendor_insert" 
ON salons 
FOR INSERT 
WITH CHECK ( auth.uid() = owner_id );

-- Vendors can view their own salons (published or not)
CREATE POLICY "salons_vendor_select" 
ON salons 
FOR SELECT 
USING ( auth.uid() = owner_id );

-- Free tier limitations for salon services
CREATE POLICY "salon_services_tier_limit" 
ON salon_services 
FOR INSERT 
WITH CHECK ( 
  (SELECT COUNT(*) FROM salon_services ss 
   JOIN salons s ON ss.salon_id = s.id 
   WHERE s.owner_id = auth.uid()) < 
  (SELECT max_services FROM vendor_tiers vt 
   JOIN salons s ON vt.id = s.tier_id 
   WHERE s.owner_id = auth.uid())
);

-- Vendors can manage their salon services
CREATE POLICY "salon_services_vendor_manage" 
ON salon_services 
FOR ALL 
USING ( 
  EXISTS (
    SELECT 1 FROM salons 
    WHERE id = salon_id AND owner_id = auth.uid()
  )
);

-- Public read access for salon services
CREATE POLICY "salon_services_public_select" 
ON salon_services 
FOR SELECT 
USING ( 
  EXISTS (
    SELECT 1 FROM salons 
    WHERE id = salon_id AND is_published = true
  )
);

-- Premium features access control for bookings
CREATE POLICY "bookings_premium_only" 
ON bookings 
FOR ALL 
USING ( 
  EXISTS ( 
    SELECT 1 FROM salons s 
    JOIN vendor_tiers vt ON s.tier_id = vt.id 
    WHERE s.id = salon_id AND vt.booking_enabled = true 
  )
);

-- Vendors can view their salon bookings
CREATE POLICY "bookings_vendor_select" 
ON bookings 
FOR SELECT 
USING ( 
  EXISTS (
    SELECT 1 FROM salons 
    WHERE id = salon_id AND owner_id = auth.uid()
  )
);

-- Reviews moderation - public can read approved reviews
CREATE POLICY "reviews_public_read" 
ON reviews 
FOR SELECT 
USING ( is_published = true AND is_moderated = true );

-- Users can create reviews
CREATE POLICY "reviews_user_insert" 
ON reviews 
FOR INSERT 
WITH CHECK ( auth.uid() = user_id );

-- Users can update their own reviews (before moderation)
CREATE POLICY "reviews_user_update" 
ON reviews 
FOR UPDATE 
USING ( auth.uid() = user_id AND is_moderated = false );

-- Salon owners can view all reviews for their salons
CREATE POLICY "reviews_salon_owner_select" 
ON reviews 
FOR SELECT 
USING ( 
  EXISTS (
    SELECT 1 FROM salons 
    WHERE id = salon_id AND owner_id = auth.uid()
  )
);

-- Admin full access to all tables
CREATE POLICY "admin_full_access_salons" 
ON salons 
FOR ALL 
USING ( auth.jwt()->>'role' = 'admin' );

CREATE POLICY "admin_full_access_reviews" 
ON reviews 
FOR ALL 
USING ( auth.jwt()->>'role' = 'admin' );

CREATE POLICY "admin_full_access_bookings" 
ON bookings 
FOR ALL 
USING ( auth.jwt()->>'role' = 'admin' );

-- Analytics privacy protection - salon owners only
CREATE POLICY "analytics_salon_owner" 
ON analytics_events 
FOR SELECT 
USING ( 
  EXISTS ( 
    SELECT 1 FROM salons 
    WHERE id = salon_id AND owner_id = auth.uid() 
  )
);

-- Analytics insert for tracking (public)
CREATE POLICY "analytics_public_insert" 
ON analytics_events 
FOR INSERT 
WITH CHECK ( true );

-- Service categories and types - public read access
CREATE POLICY "service_categories_public_read" 
ON service_categories 
FOR SELECT 
USING ( is_active = true );

CREATE POLICY "service_types_public_read" 
ON service_types 
FOR SELECT 
USING ( true );

-- Product brands - public read access
CREATE POLICY "product_brands_public_read" 
ON product_brands 
FOR SELECT 
USING ( true );

-- Content translations - public read access for published content
CREATE POLICY "content_translations_public_read" 
ON content_translations 
FOR SELECT 
USING ( is_published = true );

-- Featured placements - public read access for active placements
CREATE POLICY "featured_placements_public_read" 
ON featured_placements 
FOR SELECT 
USING ( is_active = true );

-- Vendor tiers - public read access
CREATE POLICY "vendor_tiers_public_read" 
ON vendor_tiers 
FOR SELECT 
USING ( true );