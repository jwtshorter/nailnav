-- Insert Australian cities into the database
-- Run this in Supabase SQL Editor

-- Insert Australian states (if not already present)
INSERT INTO states (code, name, country) VALUES ('NSW', 'New South Wales', 'Australia') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name, country) VALUES ('VIC', 'Victoria', 'Australia') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name, country) VALUES ('QLD', 'Queensland', 'Australia') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name, country) VALUES ('WA', 'Western Australia', 'Australia') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name, country) VALUES ('SA', 'South Australia', 'Australia') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name, country) VALUES ('TAS', 'Tasmania', 'Australia') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name, country) VALUES ('ACT', 'Australian Capital Territory', 'Australia') ON CONFLICT (code) DO NOTHING;
INSERT INTO states (code, name, country) VALUES ('NT', 'Northern Territory', 'Australia') ON CONFLICT (code) DO NOTHING;

-- Insert cities
INSERT INTO cities (name, state_id, slug, country) SELECT 'Albury', id, 'albury', 'Australia' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Bathurst', id, 'bathurst', 'Australia' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Canberra', id, 'canberra', 'Australia' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Coffs Harbour', id, 'coffs-harbour', 'Australia' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Newcastle', id, 'newcastle', 'Australia' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Port Macquarie', id, 'port-macquarie', 'Australia' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Sydney', id, 'sydney', 'Australia' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Tamworth', id, 'tamworth', 'Australia' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Tweed Heads', id, 'tweed-heads', 'Australia' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Wollongong', id, 'wollongong', 'Australia' FROM states WHERE code = 'NSW' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Ballarat', id, 'ballarat', 'Australia' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Bendigo', id, 'bendigo', 'Australia' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Geelong', id, 'geelong', 'Australia' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Melbourne', id, 'melbourne', 'Australia' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Mildura', id, 'mildura', 'Australia' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Shpparton', id, 'shpparton', 'Australia' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Traralgon', id, 'traralgon', 'Australia' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Wodonga', id, 'wodonga', 'Australia' FROM states WHERE code = 'VIC' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Brisbane', id, 'brisbane', 'Australia' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Bundaberg', id, 'bundaberg', 'Australia' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Cairns', id, 'cairns', 'Australia' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Gladstone', id, 'gladstone', 'Australia' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Gold Coast', id, 'gold-coast', 'Australia' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Hervey Bay', id, 'hervey-bay', 'Australia' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Mackay', id, 'mackay', 'Australia' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Rockhampton', id, 'rockhampton', 'Australia' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Sunshine Coast', id, 'sunshine-coast', 'Australia' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Toowoomba', id, 'toowoomba', 'Australia' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Townsville', id, 'townsville', 'Australia' FROM states WHERE code = 'QLD' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Bunbury', id, 'bunbury', 'Australia' FROM states WHERE code = 'WA' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Mandurah', id, 'mandurah', 'Australia' FROM states WHERE code = 'WA' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Perth', id, 'perth', 'Australia' FROM states WHERE code = 'WA' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Adelaide', id, 'adelaide', 'Australia' FROM states WHERE code = 'SA' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Hobart', id, 'hobart', 'Australia' FROM states WHERE code = 'TAS' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Launceston', id, 'launceston', 'Australia' FROM states WHERE code = 'TAS' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Canberra', id, 'canberra', 'Australia' FROM states WHERE code = 'ACT' ON CONFLICT (slug) DO NOTHING;
INSERT INTO cities (name, state_id, slug, country) SELECT 'Darwin', id, 'darwin', 'Australia' FROM states WHERE code = 'NT' ON CONFLICT (slug) DO NOTHING;
