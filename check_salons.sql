-- Quick check of salon counts
SELECT COUNT(*) as total_salons FROM salons;

-- Check salons by country
SELECT 
  CASE 
    WHEN state IN ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT') THEN 'Australia'
    ELSE 'USA'
  END as country,
  COUNT(*) as salon_count
FROM salons
GROUP BY country;

-- Check salons with city_id
SELECT COUNT(*) as salons_with_city FROM salons WHERE city_id IS NOT NULL;
SELECT COUNT(*) as salons_without_city FROM salons WHERE city_id IS NULL;
