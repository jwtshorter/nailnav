-- ============================================
-- Insert Australian Cities - Version 4
-- Works without slug column
-- ============================================

-- FIRST: Check what columns exist in your tables
-- Uncomment and run this to see your table structure:
/*
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'states'
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cities'
ORDER BY ordinal_position;
*/

-- ============================================
-- Insert Australian States
-- ============================================

INSERT INTO states (code, name)
SELECT 'NSW', 'New South Wales'
WHERE NOT EXISTS (SELECT 1 FROM states WHERE code = 'NSW');

INSERT INTO states (code, name)
SELECT 'VIC', 'Victoria'
WHERE NOT EXISTS (SELECT 1 FROM states WHERE code = 'VIC');

INSERT INTO states (code, name)
SELECT 'QLD', 'Queensland'
WHERE NOT EXISTS (SELECT 1 FROM states WHERE code = 'QLD');

INSERT INTO states (code, name)
SELECT 'WA', 'Western Australia'
WHERE NOT EXISTS (SELECT 1 FROM states WHERE code = 'WA');

INSERT INTO states (code, name)
SELECT 'SA', 'South Australia'
WHERE NOT EXISTS (SELECT 1 FROM states WHERE code = 'SA');

INSERT INTO states (code, name)
SELECT 'TAS', 'Tasmania'
WHERE NOT EXISTS (SELECT 1 FROM states WHERE code = 'TAS');

INSERT INTO states (code, name)
SELECT 'ACT', 'Australian Capital Territory'
WHERE NOT EXISTS (SELECT 1 FROM states WHERE code = 'ACT');

INSERT INTO states (code, name)
SELECT 'NT', 'Northern Territory'
WHERE NOT EXISTS (SELECT 1 FROM states WHERE code = 'NT');

-- ============================================
-- Insert Australian Cities (without slug column)
-- ============================================

-- NSW Cities
INSERT INTO cities (name, state_id)
SELECT 'Albury', s.id
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Albury' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Bathurst', s.id
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Bathurst' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Coffs Harbour', s.id
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Coffs Harbour' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Newcastle', s.id
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Newcastle' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Port Macquarie', s.id
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Port Macquarie' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Sydney', s.id
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Sydney' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Tamworth', s.id
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Tamworth' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Tweed Heads', s.id
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Tweed Heads' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Wollongong', s.id
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Wollongong' AND state_id = s.id);

-- VIC Cities
INSERT INTO cities (name, state_id)
SELECT 'Ballarat', s.id
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Ballarat' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Bendigo', s.id
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Bendigo' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Geelong', s.id
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Geelong' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Melbourne', s.id
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Melbourne' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Mildura', s.id
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Mildura' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Shepparton', s.id
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Shepparton' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Traralgon', s.id
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Traralgon' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Wodonga', s.id
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Wodonga' AND state_id = s.id);

-- QLD Cities
INSERT INTO cities (name, state_id)
SELECT 'Brisbane', s.id
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Brisbane' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Bundaberg', s.id
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Bundaberg' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Cairns', s.id
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Cairns' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Gladstone', s.id
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Gladstone' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Gold Coast', s.id
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Gold Coast' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Hervey Bay', s.id
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Hervey Bay' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Mackay', s.id
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Mackay' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Rockhampton', s.id
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Rockhampton' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Sunshine Coast', s.id
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Sunshine Coast' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Toowoomba', s.id
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Toowoomba' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Townsville', s.id
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Townsville' AND state_id = s.id);

-- WA Cities
INSERT INTO cities (name, state_id)
SELECT 'Bunbury', s.id
FROM states s
WHERE s.code = 'WA'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Bunbury' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Mandurah', s.id
FROM states s
WHERE s.code = 'WA'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Mandurah' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Perth', s.id
FROM states s
WHERE s.code = 'WA'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Perth' AND state_id = s.id);

-- SA Cities
INSERT INTO cities (name, state_id)
SELECT 'Adelaide', s.id
FROM states s
WHERE s.code = 'SA'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Adelaide' AND state_id = s.id);

-- TAS Cities
INSERT INTO cities (name, state_id)
SELECT 'Hobart', s.id
FROM states s
WHERE s.code = 'TAS'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Hobart' AND state_id = s.id);

INSERT INTO cities (name, state_id)
SELECT 'Launceston', s.id
FROM states s
WHERE s.code = 'TAS'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Launceston' AND state_id = s.id);

-- ACT Cities
INSERT INTO cities (name, state_id)
SELECT 'Canberra', s.id
FROM states s
WHERE s.code = 'ACT'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Canberra' AND state_id = s.id);

-- NT Cities
INSERT INTO cities (name, state_id)
SELECT 'Darwin', s.id
FROM states s
WHERE s.code = 'NT'
AND NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Darwin' AND state_id = s.id);

-- ============================================
-- Verification Queries
-- ============================================

-- Count states
SELECT COUNT(*) as australian_states 
FROM states 
WHERE code IN ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT');

-- Count cities by state
SELECT 
    s.code as state_code,
    s.name as state_name,
    COUNT(c.id) as city_count
FROM states s
LEFT JOIN cities c ON c.state_id = s.id
WHERE s.code IN ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT')
GROUP BY s.code, s.name
ORDER BY s.code;

-- List all cities
SELECT 
    c.name as city_name,
    s.code as state_code,
    c.id as city_id
FROM cities c
JOIN states s ON c.state_id = s.id
WHERE s.code IN ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT')
ORDER BY s.code, c.name;
