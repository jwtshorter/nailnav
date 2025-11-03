-- Add review_count column to salons table
-- Run this in Supabase SQL Editor first

ALTER TABLE salons ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_salons_review_count ON salons(review_count);

-- Add comment
COMMENT ON COLUMN salons.review_count IS 'Number of reviews from Google/external sources';
