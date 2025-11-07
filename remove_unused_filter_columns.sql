-- ============================================
-- Remove Unused Filter Columns
-- Date: 2025-11-07
-- Purpose: Drop filter columns removed from UI
-- ============================================

-- These columns were removed based on user request:
-- 1. Adult Only (amenity) - removed from UI
-- 2. Injectables (service) - removed from UI
-- 3. Tanning (service) - removed from UI
-- 4. Cosmetic Tattoo (service) - removed from UI

-- Note: Filter names were also updated:
-- - "Acrylic Nails" → "Shellac / Acrylic Nails"
-- - "SNS Dip Powder" → "SNS / Dip Powder"
-- - "Builders Gel / BIAB" → "BIAB / Builders Gel"

-- BACKUP RECOMMENDATION:
-- Before running this migration, create a backup:
-- pg_dump -h your-host -U postgres -d your-database -t public.salons > salons_backup.sql

-- ============================================
-- Drop unused columns
-- ============================================

ALTER TABLE public.salons 
DROP COLUMN IF EXISTS adult_only,
DROP COLUMN IF EXISTS injectables,
DROP COLUMN IF EXISTS tanning,
DROP COLUMN IF EXISTS cosmetic_tattoo;

-- ============================================
-- Verification Query
-- ============================================
-- Run this after the migration to verify success:
-- Should return 0 rows if successful

SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'salons' 
AND column_name IN ('adult_only', 'injectables', 'tanning', 'cosmetic_tattoo');

-- If the above query returns 0 rows, the migration was successful!

-- ============================================
-- Column Status Check
-- ============================================
-- To see all remaining filter columns:

SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'salons' 
AND column_name IN (
  'manicure',
  'gel_manicure',
  'gel_extensions',
  'acrylic_nails',
  'pedicure',
  'gel_pedicure',
  'sns_dip_powder',
  'builders_gel_biab',
  'nail_art',
  'massage',
  'facials',
  'lash_extensions',
  'lash_lift_tint',
  'brows',
  'waxing',
  'haircuts',
  'spa_hand_foot_treatment',
  'child_friendly',
  'pet_friendly',
  'lgbtqi_friendly',
  'wheelchair_accessible',
  'complimentary_drink',
  'heated_massage_chairs',
  'foot_spas',
  'free_wifi',
  'parking',
  'autoclave_sterilisation',
  'led_curing',
  'clean_ethical_products',
  'vegan_polish'
)
ORDER BY column_name;

-- ============================================
-- Migration Complete
-- ============================================
-- After running this SQL:
-- ✅ 4 unused columns removed
-- ✅ UI already updated (no references to removed columns)
-- ✅ API routes already updated
-- ✅ Filter names updated throughout codebase
