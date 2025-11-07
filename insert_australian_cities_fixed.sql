-- ============================================
-- Insert Australian Cities - FIXED VERSION
-- Run this in Supabase SQL Editor
-- ============================================

-- Insert Australian States (without country column)
INSERT INTO states (code, name) VALUES ('NSW', 'New South Wales') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name) VALUES ('VIC', 'Victoria') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name) VALUES ('QLD', 'Queensland') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name) VALUES ('WA', 'Western Australia') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name) VALUES ('SA', 'South Australia') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name) VALUES ('TAS', 'Tasmania') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name) VALUES ('ACT', 'Australian Capital Territory') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name) VALUES ('NT', 'Northern Territory') ON CONFLICT (code) DO NOTHING;

-- Insert Australian Cities (without country column)
-- NSW
INSERT INTO cities (name, state_id, slug) SELECT 'Albury', id, 'albury' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Bathurst', id, 'bathurst' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Canberra', id, 'canberra' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Coffs Harbour', id, 'coffs-harbour' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Newcastle', id, 'newcastle' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Port Macquarie', id, 'port-macquarie' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Sydney', id, 'sydney' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Tamworth', id, 'tamworth' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Tweed Heads', id, 'tweed-heads' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Wollongong', id, 'wollongong' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;

-- VIC
INSERT INTO cities (name, state_id, slug) SELECT 'Ballarat', id, 'ballarat' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Bendigo', id, 'bendigo' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Geelong', id, 'geelong' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Melbourne', id, 'melbourne' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Mildura', id, 'mildura' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Shepparton', id, 'shepparton' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Traralgon', id, 'traralgon' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Wodonga', id, 'wodonga' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;

-- QLD
INSERT INTO cities (name, state_id, slug) SELECT 'Brisbane', id, 'brisbane' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Bundaberg', id, 'bundaberg' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Cairns', id, 'cairns' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Gladstone', id, 'gladstone' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Gold Coast', id, 'gold-coast' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Hervey Bay', id, 'hervey-bay' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Mackay', id, 'mackay' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Rockhampton', id, 'rockhampton' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Sunshine Coast', id, 'sunshine-coast' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Toowoomba', id, 'toowoomba' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Townsville', id, 'townsville' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;

-- WA
INSERT INTO cities (name, state_id, slug) SELECT 'Bunbury', id, 'bunbury' FROM states WHERE code = 'WA' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Mandurah', id, 'mandurah' FROM states WHERE code = 'WA' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Perth', id, 'perth' FROM states WHERE code = 'WA' ON CONFLICT (slug) DO NOTHING;

-- SA
INSERT INTO cities (name, state_id, slug) SELECT 'Adelaide', id, 'adelaide' FROM states WHERE code = 'SA' ON CONFLICT (slug) DO NOTHING;

-- TAS
INSERT INTO cities (name, state_id, slug) SELECT 'Hobart', id, 'hobart' FROM states WHERE code = 'TAS' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug) SELECT 'Launceston', id, 'launceston' FROM states WHERE code = 'TAS' ON CONFLICT (slug) DO NOTHING;

-- ACT
INSERT INTO cities (name, state_id, slug) SELECT 'Canberra', id, 'canberra' FROM states WHERE code = 'ACT' ON CONFLICT (slug) DO NOTHING;

-- NT
INSERT INTO cities (name, state_id, slug) SELECT 'Darwin', id, 'darwin' FROM states WHERE code = 'NT' ON CONFLICT (slug) DO NOTHING;

-- Verification: Check inserted data
SELECT s.code, s.name as state_name, COUNT(c.id) as city_count
FROM states s
LEFT JOIN cities c ON c.state_id = s.id
WHERE s.code IN ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT')
GROUP BY s.code, s.name
ORDER BY s.code;
