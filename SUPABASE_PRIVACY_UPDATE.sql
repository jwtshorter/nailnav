-- =====================================================
-- PRIVACY UPDATE: Remove Phone Numbers & Hide Emails
-- =====================================================
-- Run this AFTER the main setup to update privacy settings

-- 1. Add private contact information table for salon owners only
CREATE TABLE salon_private_contact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE UNIQUE,
  email VARCHAR(100), -- Private, only visible to salon owner and through contact forms
  phone VARCHAR(20), -- Private, only visible to salon owner (if they want to keep it)
  contact_preferences JSONB DEFAULT '{"email_notifications": true, "booking_notifications": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Remove phone and email from public salons table (if they exist)
-- Note: This is safe to run even if columns don't exist
DO $$ 
BEGIN
  -- Remove phone column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'salons' AND column_name = 'phone'
  ) THEN
    ALTER TABLE salons DROP COLUMN phone;
  END IF;
  
  -- Remove email column if it exists  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'salons' AND column_name = 'email'
  ) THEN
    ALTER TABLE salons DROP COLUMN email;
  END IF;
END $$;

-- 3. Add contact form submissions table for inquiries
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  visitor_name VARCHAR(200) NOT NULL,
  visitor_email VARCHAR(100) NOT NULL,
  visitor_phone VARCHAR(20), -- Optional, visitor can choose to provide
  subject VARCHAR(200),
  message TEXT NOT NULL,
  service_interest VARCHAR(100), -- What service they're interested in
  preferred_contact_method VARCHAR(20) DEFAULT 'email', -- 'email', 'phone', 'either'
  
  -- Privacy & Status
  is_read BOOLEAN DEFAULT false,
  is_responded BOOLEAN DEFAULT false,
  salon_response TEXT,
  response_date TIMESTAMP WITH TIME ZONE,
  
  -- Tracking (anonymous)
  visitor_ip INET,
  user_agent TEXT,
  referrer TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Update bookings table to remove direct phone access
DO $$ 
BEGIN
  -- Keep customer_phone in bookings as it's part of the booking process
  -- This is acceptable as it's for confirmed appointments, not public display
  NULL;
END $$;

-- 5. Enable RLS on new tables
ALTER TABLE salon_private_contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for private contact
-- Only salon owners can see their private contact info
CREATE POLICY "Salon owners can manage their private contact" ON salon_private_contact
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM salons 
      WHERE salons.id = salon_private_contact.salon_id 
        AND salons.owner_id = auth.uid()
    )
  );

-- Admins can see all private contact info
CREATE POLICY "Admins can manage all private contact" ON salon_private_contact
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id 
        AND raw_user_meta_data->>'user_type' = 'admin'
    )
  );

-- 7. Create RLS policies for contact submissions
-- Salon owners can see submissions for their salons
CREATE POLICY "Salon owners can view their contact submissions" ON contact_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM salons 
      WHERE salons.id = contact_submissions.salon_id 
        AND salons.owner_id = auth.uid()
    )
  );

-- Anyone can submit contact forms (but not read them)
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Salon owners can update their submissions (mark as read/responded)
CREATE POLICY "Salon owners can update their submissions" ON contact_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM salons 
      WHERE salons.id = contact_submissions.salon_id 
        AND salons.owner_id = auth.uid()
    )
  );

-- 8. Create function to handle contact form submissions
CREATE OR REPLACE FUNCTION submit_salon_contact_form(
  p_salon_id UUID,
  p_visitor_name VARCHAR(200),
  p_visitor_email VARCHAR(100),
  p_visitor_phone VARCHAR(20) DEFAULT NULL,
  p_subject VARCHAR(200) DEFAULT NULL,
  p_message TEXT,
  p_service_interest VARCHAR(100) DEFAULT NULL,
  p_preferred_contact_method VARCHAR(20) DEFAULT 'email'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  submission_id UUID;
BEGIN
  -- Insert contact submission
  INSERT INTO contact_submissions (
    salon_id, visitor_name, visitor_email, visitor_phone,
    subject, message, service_interest, preferred_contact_method
  ) VALUES (
    p_salon_id, p_visitor_name, p_visitor_email, p_visitor_phone,
    p_subject, p_message, p_service_interest, p_preferred_contact_method
  ) RETURNING id INTO submission_id;
  
  -- Increment contact form submissions counter
  UPDATE salons 
  SET contact_form_submissions = contact_form_submissions + 1
  WHERE id = p_salon_id;
  
  RETURN submission_id;
END;
$$;

-- 9. Create function to get salon public info (without private contact)
CREATE OR REPLACE FUNCTION get_salon_public_info(p_salon_id UUID)
RETURNS TABLE(
  id UUID,
  name VARCHAR(200),
  slug VARCHAR(200),
  description TEXT,
  website VARCHAR(200),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  operating_hours JSONB,
  services_offered TEXT[],
  specialties TEXT[],
  languages_spoken TEXT[],
  accepts_walk_ins BOOLEAN,
  parking_available BOOLEAN,
  price_range VARCHAR(20),
  price_from DECIMAL(10,2),
  currency VARCHAR(3),
  logo_url TEXT,
  cover_image_url TEXT,
  gallery_images TEXT[],
  is_published BOOLEAN,
  is_verified BOOLEAN,
  is_featured BOOLEAN,
  verification_date TIMESTAMP WITH TIME ZONE,
  view_count INTEGER,
  contact_form_submissions INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  average_rating DECIMAL(3,2),
  review_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id, s.name, s.slug, s.description, s.website,
    s.address, s.city, s.state, s.country, s.postal_code,
    s.latitude, s.longitude, s.operating_hours, s.services_offered,
    s.specialties, s.languages_spoken, s.accepts_walk_ins,
    s.parking_available, s.price_range, s.price_from, s.currency,
    s.logo_url, s.cover_image_url, s.gallery_images,
    s.is_published, s.is_verified, s.is_featured, s.verification_date,
    s.view_count, s.contact_form_submissions, s.created_at,
    calculate_salon_average_rating(s.id) as average_rating,
    get_salon_review_count(s.id) as review_count
  FROM salons s
  WHERE s.id = p_salon_id AND s.is_published = true;
END;
$$;

-- 10. Grant permissions
GRANT ALL ON salon_private_contact TO authenticated;
GRANT ALL ON contact_submissions TO authenticated;
GRANT EXECUTE ON FUNCTION submit_salon_contact_form TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_salon_public_info TO anon, authenticated;

-- 11. Create indexes for performance
CREATE INDEX idx_salon_private_contact_salon_id ON salon_private_contact(salon_id);
CREATE INDEX idx_contact_submissions_salon_id ON contact_submissions(salon_id, created_at DESC);
CREATE INDEX idx_contact_submissions_is_read ON contact_submissions(is_read, created_at DESC);

-- 12. Add trigger for updated_at on private contact
CREATE TRIGGER update_salon_private_contact_updated_at 
  BEFORE UPDATE ON salon_private_contact 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PRIVACY UPDATE COMPLETE!
-- =====================================================
-- Changes made:
-- ✅ Removed phone/email from public salons table
-- ✅ Created private contact table for salon owners
-- ✅ Added contact form submission system
-- ✅ Set up proper RLS policies for privacy
-- ✅ Created helper functions for safe data access
-- ✅ No direct contact info exposed in public APIs
-- =====================================================