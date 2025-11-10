-- ============================================================================
-- SALON DIAGNOSTICS - Find out where salons are
-- ============================================================================

-- 1. Total salon count
SELECT 'Total Salons' as metric, COUNT(*) as count FROM salons;

-- 2. Salons by region
SELECT 
  CASE 
    WHEN state IN ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT') THEN 'Australia'
    ELSE 'USA'
  END as region,
  COUNT(*) as salon_count
FROM salons
GROUP BY region;

-- 3. Salons with vs without city_id
SELECT 
  'Salons with city_id' as metric,
  COUNT(*) as count 
FROM salons 
WHERE city_id IS NOT NULL

UNION ALL

SELECT 
  'Salons without city_id' as metric,
  COUNT(*) as count 
FROM salons 
WHERE city_id IS NULL;

-- 4. Top 10 cities by salon count (for Australian salons)
SELECT 
  c.name as city_name,
  s.state as state_code,
  COUNT(*) as salon_count
FROM salons s
LEFT JOIN cities c ON s.city_id = c.id
WHERE s.state IN ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT')
GROUP BY c.name, s.state
ORDER BY salon_count DESC
LIMIT 10;

-- 5. Salons in Sydney specifically
SELECT 
  COUNT(*) as sydney_salon_count
FROM salons s
LEFT JOIN cities c ON s.city_id = c.id
WHERE s.city = 'Sydney' OR c.name = 'Sydney';

-- 6. Check if suburbs were properly merged
SELECT 
  'Bondi salons (should be 0)' as check_name,
  COUNT(*) as count
FROM cities
WHERE name = 'Bondi'

UNION ALL

SELECT 
  'Civic salons (should be 0)' as check_name,
  COUNT(*) as count
FROM cities
WHERE name = 'Civic'

UNION ALL

SELECT 
  'Sydney city exists' as check_name,
  COUNT(*) as count
FROM cities
WHERE name = 'Sydney'

UNION ALL

SELECT 
  'Canberra city exists' as check_name,
  COUNT(*) as count
FROM cities
WHERE name = 'Canberra';

-- 7. Sample of salons to see their structure
SELECT 
  id,
  name,
  city,
  state,
  city_id,
  is_featured,
  rating
FROM salons
WHERE state IN ('NSW', 'VIC', 'QLD')
ORDER BY is_featured DESC, rating DESC
LIMIT 10;
