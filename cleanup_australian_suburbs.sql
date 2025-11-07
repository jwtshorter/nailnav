-- ============================================================================
-- Cleanup Australian Suburbs - Merge suburbs into parent cities
-- ============================================================================
-- This script merges suburbs that are incorrectly listed as separate cities
-- into their parent cities by:
-- 1. Updating all salons that reference suburb city_ids to use parent city_id
-- 2. Deleting the suburb records from the cities table
-- ============================================================================

-- Before running: Backup your data!
-- SELECT * FROM cities WHERE id IN (31, 3, 6, 5, 4, 14, 13, 23, 25, 24, 27, 11, 10, 9, 8, 20, 60, 19, 21);
-- SELECT * FROM salons WHERE city_id IN (31, 3, 6, 5, 4, 14, 13, 23, 25, 24, 27, 11, 10, 9, 8, 20, 60, 19, 21);

BEGIN;

-- ============================================================================
-- ACT (Australian Capital Territory)
-- ============================================================================

-- Civic (31) → Canberra (30)
UPDATE salons SET city_id = 30 WHERE city_id = 31;
DELETE FROM cities WHERE id = 31;

-- ============================================================================
-- NT (Northern Territory)
-- ============================================================================

-- Casuarina (29) → Darwin (28)
UPDATE salons SET city_id = 28 WHERE city_id = 29;
DELETE FROM cities WHERE id = 29;

-- ============================================================================
-- NSW (New South Wales)
-- ============================================================================

-- Bondi (3) → Sydney (2)
UPDATE salons SET city_id = 2 WHERE city_id = 3;
DELETE FROM cities WHERE id = 3;

-- Chatswood (6) → Sydney (2)
UPDATE salons SET city_id = 2 WHERE city_id = 6;
DELETE FROM cities WHERE id = 6;

-- Manly (5) → Sydney (2)
UPDATE salons SET city_id = 2 WHERE city_id = 5;
DELETE FROM cities WHERE id = 5;

-- Parramatta (4) → Sydney (2)
UPDATE salons SET city_id = 2 WHERE city_id = 4;
DELETE FROM cities WHERE id = 4;

-- ============================================================================
-- QLD (Queensland)
-- ============================================================================

-- Fortitude Valley (14) → Brisbane (12)
UPDATE salons SET city_id = 12 WHERE city_id = 14;
DELETE FROM cities WHERE id = 14;

-- Surfers Paradise (13) → Gold Coast (36)
UPDATE salons SET city_id = 36 WHERE city_id = 13;
DELETE FROM cities WHERE id = 13;

-- ============================================================================
-- SA (South Australia)
-- ============================================================================

-- Glenelg (23) → Adelaide (22)
UPDATE salons SET city_id = 22 WHERE city_id = 23;
DELETE FROM cities WHERE id = 23;

-- Hindmarsh (25) → Adelaide (22)
UPDATE salons SET city_id = 22 WHERE city_id = 25;
DELETE FROM cities WHERE id = 25;

-- Norwood (24) → Adelaide (22)
UPDATE salons SET city_id = 22 WHERE city_id = 24;
DELETE FROM cities WHERE id = 24;

-- ============================================================================
-- TAS (Tasmania)
-- ============================================================================

-- Sandy Bay (27) → Hobart (26)
UPDATE salons SET city_id = 26 WHERE city_id = 27;
DELETE FROM cities WHERE id = 27;

-- ============================================================================
-- VIC (Victoria)
-- ============================================================================

-- Fitzroy (11) → Melbourne (7)
UPDATE salons SET city_id = 7 WHERE city_id = 11;
DELETE FROM cities WHERE id = 11;

-- Prahran (10) → Melbourne (7)
UPDATE salons SET city_id = 7 WHERE city_id = 10;
DELETE FROM cities WHERE id = 10;

-- Richmond (9) → Melbourne (7)
UPDATE salons SET city_id = 7 WHERE city_id = 9;
DELETE FROM cities WHERE id = 9;

-- St Kilda (8) → Melbourne (7)
UPDATE salons SET city_id = 7 WHERE city_id = 8;
DELETE FROM cities WHERE id = 8;

-- ============================================================================
-- WA (Western Australia)
-- ============================================================================

-- Joondalup (20) → Perth (17)
UPDATE salons SET city_id = 17 WHERE city_id = 20;
DELETE FROM cities WHERE id = 20;

-- Mandurah (60) → Perth (17)
UPDATE salons SET city_id = 17 WHERE city_id = 60;
DELETE FROM cities WHERE id = 60;

-- Scarborough (19) → Perth (17)
UPDATE salons SET city_id = 17 WHERE city_id = 19;
DELETE FROM cities WHERE id = 19;

-- Subiaco (21) → Perth (17)
UPDATE salons SET city_id = 17 WHERE city_id = 21;
DELETE FROM cities WHERE id = 21;

COMMIT;

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Check that suburb cities have been deleted (should return 0 rows)
SELECT * FROM cities 
WHERE id IN (31, 29, 3, 6, 5, 4, 14, 13, 23, 25, 24, 27, 11, 10, 9, 8, 20, 60, 19, 21);

-- Check salon counts for parent cities (should show combined counts)
SELECT c.name, c.id, COUNT(s.id) as salon_count
FROM cities c
LEFT JOIN salons s ON c.id = s.city_id
WHERE c.id IN (30, 28, 2, 12, 36, 22, 26, 7, 17)
GROUP BY c.id, c.name
ORDER BY c.name;

-- List all remaining Australian cities (should show clean list without suburbs)
SELECT c.name as city_name, st.code as state_code, c.id as city_id
FROM cities c
JOIN states st ON c.state_id = st.id
WHERE st.code IN ('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA')
ORDER BY st.code, c.name;
