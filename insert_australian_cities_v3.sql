-- ============================================
-- Insert Australian Cities - Version 3
-- Works without unique constraints on code/slug
-- ============================================

-- Option 1: If you want to avoid duplicates, use WHERE NOT EXISTS
-- This is safer and works without unique constraints

-- Insert Australian States
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

-- Insert Australian Cities
-- NSW Cities
INSERT INTO cities (name, state_id, slug)
SELECT 'Albury', s.id, 'albury'
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'albury');

INSERT INTO cities (name, state_id, slug)
SELECT 'Bathurst', s.id, 'bathurst'
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'bathurst');

INSERT INTO cities (name, state_id, slug)
SELECT 'Coffs Harbour', s.id, 'coffs-harbour'
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'coffs-harbour');

INSERT INTO cities (name, state_id, slug)
SELECT 'Newcastle', s.id, 'newcastle'
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'newcastle');

INSERT INTO cities (name, state_id, slug)
SELECT 'Port Macquarie', s.id, 'port-macquarie'
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'port-macquarie');

INSERT INTO cities (name, state_id, slug)
SELECT 'Sydney', s.id, 'sydney'
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'sydney');

INSERT INTO cities (name, state_id, slug)
SELECT 'Tamworth', s.id, 'tamworth'
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'tamworth');

INSERT INTO cities (name, state_id, slug)
SELECT 'Tweed Heads', s.id, 'tweed-heads'
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'tweed-heads');

INSERT INTO cities (name, state_id, slug)
SELECT 'Wollongong', s.id, 'wollongong'
FROM states s
WHERE s.code = 'NSW'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'wollongong');

-- VIC Cities
INSERT INTO cities (name, state_id, slug)
SELECT 'Ballarat', s.id, 'ballarat'
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'ballarat');

INSERT INTO cities (name, state_id, slug)
SELECT 'Bendigo', s.id, 'bendigo'
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'bendigo');

INSERT INTO cities (name, state_id, slug)
SELECT 'Geelong', s.id, 'geelong'
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'geelong');

INSERT INTO cities (name, state_id, slug)
SELECT 'Melbourne', s.id, 'melbourne'
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'melbourne');

INSERT INTO cities (name, state_id, slug)
SELECT 'Mildura', s.id, 'mildura'
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'mildura');

INSERT INTO cities (name, state_id, slug)
SELECT 'Shepparton', s.id, 'shepparton'
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'shepparton');

INSERT INTO cities (name, state_id, slug)
SELECT 'Traralgon', s.id, 'traralgon'
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'traralgon');

INSERT INTO cities (name, state_id, slug)
SELECT 'Wodonga', s.id, 'wodonga'
FROM states s
WHERE s.code = 'VIC'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'wodonga');

-- QLD Cities
INSERT INTO cities (name, state_id, slug)
SELECT 'Brisbane', s.id, 'brisbane'
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'brisbane');

INSERT INTO cities (name, state_id, slug)
SELECT 'Bundaberg', s.id, 'bundaberg'
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'bundaberg');

INSERT INTO cities (name, state_id, slug)
SELECT 'Cairns', s.id, 'cairns'
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'cairns');

INSERT INTO cities (name, state_id, slug)
SELECT 'Gladstone', s.id, 'gladstone'
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'gladstone');

INSERT INTO cities (name, state_id, slug)
SELECT 'Gold Coast', s.id, 'gold-coast'
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'gold-coast');

INSERT INTO cities (name, state_id, slug)
SELECT 'Hervey Bay', s.id, 'hervey-bay'
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'hervey-bay');

INSERT INTO cities (name, state_id, slug)
SELECT 'Mackay', s.id, 'mackay'
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'mackay');

INSERT INTO cities (name, state_id, slug)
SELECT 'Rockhampton', s.id, 'rockhampton'
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'rockhampton');

INSERT INTO cities (name, state_id, slug)
SELECT 'Sunshine Coast', s.id, 'sunshine-coast'
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'sunshine-coast');

INSERT INTO cities (name, state_id, slug)
SELECT 'Toowoomba', s.id, 'toowoomba'
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'toowoomba');

INSERT INTO cities (name, state_id, slug)
SELECT 'Townsville', s.id, 'townsville'
FROM states s
WHERE s.code = 'QLD'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'townsville');

-- WA Cities
INSERT INTO cities (name, state_id, slug)
SELECT 'Bunbury', s.id, 'bunbury'
FROM states s
WHERE s.code = 'WA'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'bunbury');

INSERT INTO cities (name, state_id, slug)
SELECT 'Mandurah', s.id, 'mandurah'
FROM states s
WHERE s.code = 'WA'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'mandurah');

INSERT INTO cities (name, state_id, slug)
SELECT 'Perth', s.id, 'perth'
FROM states s
WHERE s.code = 'WA'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'perth');

-- SA Cities
INSERT INTO cities (name, state_id, slug)
SELECT 'Adelaide', s.id, 'adelaide'
FROM states s
WHERE s.code = 'SA'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'adelaide');

-- TAS Cities
INSERT INTO cities (name, state_id, slug)
SELECT 'Hobart', s.id, 'hobart'
FROM states s
WHERE s.code = 'TAS'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'hobart');

INSERT INTO cities (name, state_id, slug)
SELECT 'Launceston', s.id, 'launceston'
FROM states s
WHERE s.code = 'TAS'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'launceston');

-- ACT Cities
INSERT INTO cities (name, state_id, slug)
SELECT 'Canberra', s.id, 'canberra'
FROM states s
WHERE s.code = 'ACT'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'canberra');

-- NT Cities
INSERT INTO cities (name, state_id, slug)
SELECT 'Darwin', s.id, 'darwin'
FROM states s
WHERE s.code = 'NT'
AND NOT EXISTS (SELECT 1 FROM cities WHERE slug = 'darwin');

-- ============================================
-- Verification Query
-- ============================================
SELECT 
    s.code as state_code,
    s.name as state_name,
    COUNT(c.id) as city_count
FROM states s
LEFT JOIN cities c ON c.state_id = s.id
WHERE s.code IN ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT')
GROUP BY s.code, s.name
ORDER BY s.code;

-- List all Australian cities
SELECT 
    c.name as city_name,
    s.code as state_code,
    c.slug
FROM cities c
JOIN states s ON c.state_id = s.id
WHERE s.code IN ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT')
ORDER BY s.code, c.name;
