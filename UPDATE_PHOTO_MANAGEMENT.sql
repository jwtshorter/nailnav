-- Photo Management System Database Updates
-- This file adds photo management capabilities with tier-based limits

-- Add photo limit columns to salons table
ALTER TABLE salons ADD COLUMN IF NOT EXISTS photo_limit INTEGER DEFAULT 1;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS photo_count INTEGER DEFAULT 0;

-- Create salon photos table
CREATE TABLE IF NOT EXISTS salon_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  width INTEGER,
  height INTEGER,
  description TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_salon_photos_salon_id ON salon_photos(salon_id);
CREATE INDEX IF NOT EXISTS idx_salon_photos_is_primary ON salon_photos(salon_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_salon_photos_sort_order ON salon_photos(salon_id, sort_order);

-- Update vendor tiers with photo limits
UPDATE vendor_tiers SET 
  features = jsonb_set(features, '{photo_limit}', '1')
WHERE name = 'free';

UPDATE vendor_tiers SET 
  features = jsonb_set(features, '{photo_limit}', '10'),
  features = jsonb_set(features, '{photo_upload}', '10')
WHERE name = 'premium';

UPDATE vendor_tiers SET 
  features = jsonb_set(features, '{photo_limit}', '100'),
  features = jsonb_set(features, '{photo_upload}', '100')
WHERE name = 'featured';

-- Update existing salons with photo limits based on their tier
UPDATE salons SET photo_limit = CASE 
  WHEN tier_id IN (SELECT id FROM vendor_tiers WHERE name = 'free') THEN 1
  WHEN tier_id IN (SELECT id FROM vendor_tiers WHERE name = 'premium') THEN 10
  WHEN tier_id IN (SELECT id FROM vendor_tiers WHERE name = 'featured') THEN 100
  ELSE 1
END;

-- Create function to update photo count
CREATE OR REPLACE FUNCTION update_salon_photo_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE salons 
    SET photo_count = (SELECT COUNT(*) FROM salon_photos WHERE salon_id = NEW.salon_id)
    WHERE id = NEW.salon_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE salons 
    SET photo_count = (SELECT COUNT(*) FROM salon_photos WHERE salon_id = OLD.salon_id)
    WHERE id = OLD.salon_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update photo count
CREATE TRIGGER trigger_update_photo_count_insert
  AFTER INSERT ON salon_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_salon_photo_count();

CREATE TRIGGER trigger_update_photo_count_delete
  AFTER DELETE ON salon_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_salon_photo_count();

-- Function to enforce photo limits
CREATE OR REPLACE FUNCTION check_photo_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
  max_limit INTEGER;
BEGIN
  SELECT photo_count, photo_limit INTO current_count, max_limit
  FROM salons WHERE id = NEW.salon_id;
  
  IF current_count >= max_limit THEN
    RAISE EXCEPTION 'Photo limit exceeded. Current limit: %, Current count: %', max_limit, current_count;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce photo limits
CREATE TRIGGER trigger_check_photo_limit
  BEFORE INSERT ON salon_photos
  FOR EACH ROW
  EXECUTE FUNCTION check_photo_limit();

-- Function to ensure only one primary photo per salon
CREATE OR REPLACE FUNCTION ensure_single_primary_photo()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    -- Remove primary flag from other photos in the same salon
    UPDATE salon_photos 
    SET is_primary = false 
    WHERE salon_id = NEW.salon_id AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for primary photo management
CREATE TRIGGER trigger_ensure_single_primary_photo
  BEFORE INSERT OR UPDATE ON salon_photos
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_photo();

-- Enable Row Level Security
ALTER TABLE salon_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read access to salon photos" ON salon_photos
  FOR SELECT USING (true);

CREATE POLICY "Allow salon owners to manage their photos" ON salon_photos
  FOR ALL USING (salon_id IN (
    SELECT id FROM salons WHERE owner_id = auth.uid()
  ));

-- Create view for salon photos with metadata
CREATE OR REPLACE VIEW salon_photos_view AS
SELECT 
  sp.*,
  s.name as salon_name,
  s.photo_limit,
  s.photo_count,
  vt.name as tier_name
FROM salon_photos sp
JOIN salons s ON sp.salon_id = s.id
JOIN vendor_tiers vt ON s.tier_id = vt.id;

-- Analytics table for photo performance
CREATE TABLE IF NOT EXISTS photo_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES salon_photos(id) ON DELETE CASCADE,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for analytics
CREATE INDEX IF NOT EXISTS idx_photo_analytics_photo_id ON photo_analytics(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_analytics_salon_id ON photo_analytics(salon_id);
CREATE INDEX IF NOT EXISTS idx_photo_analytics_date ON photo_analytics(date);

-- Sample data for testing (optional)
-- INSERT INTO salon_photos (salon_id, filename, original_filename, file_path, file_size, mime_type, description, is_primary)
-- VALUES 
-- ('existing-salon-id', 'photo1.jpg', 'beautiful-salon.jpg', '/uploads/photos/photo1.jpg', 524288, 'image/jpeg', 'Main salon interior', true),
-- ('existing-salon-id', 'photo2.jpg', 'nail-station.jpg', '/uploads/photos/photo2.jpg', 342000, 'image/jpeg', 'Professional nail stations', false);

COMMIT;