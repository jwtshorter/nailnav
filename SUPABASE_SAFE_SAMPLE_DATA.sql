-- =====================================================
-- SAFE SAMPLE DATA INSERTION - No Duplicates
-- =====================================================
-- This file safely inserts sample data without causing duplicate key errors
-- Use this if you've already run the main setup and just want to add sample data

-- Insert Service Categories (with conflict resolution)
INSERT INTO service_categories (name, slug, description, icon, sort_order, is_active) VALUES
('Manicures', 'manicures', 'Professional nail care for hands', 'fas fa-hand-paper', 1, true),
('Pedicures', 'pedicures', 'Professional nail care for feet', 'fas fa-shoe-prints', 2, true),
('Nail Art', 'nail-art', 'Creative and artistic nail designs', 'fas fa-palette', 3, true),
('Extensions', 'extensions', 'Acrylic, gel, and other nail extensions', 'fas fa-expand', 4, true),
('Treatments', 'treatments', 'Nail health and wellness treatments', 'fas fa-heart', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert Service Types (with conflict resolution)
INSERT INTO service_types (category_id, name, slug, description, duration_minutes, price_range_low, price_range_high, specialization_level, trend_status, filtering_priority, keywords) VALUES
-- Manicures
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'Basic Manicure', 'basic-manicure', 'Essential nail care with shaping and polish', 45, 25.00, 45.00, 'basic', 'stable', 'high', ARRAY['manicure', 'basic', 'polish']),
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'Gel Manicure', 'gel-manicure', 'Long-lasting gel polish application', 60, 35.00, 65.00, 'standard', 'growing', 'high', ARRAY['gel', 'manicure', 'long-lasting']),
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'French Manicure', 'french-manicure', 'Classic white tip design', 50, 30.00, 55.00, 'standard', 'stable', 'medium', ARRAY['french', 'classic', 'white tip']),
-- Pedicures
((SELECT id FROM service_categories WHERE slug = 'pedicures'), 'Basic Pedicure', 'basic-pedicure', 'Essential foot and nail care', 60, 35.00, 55.00, 'basic', 'stable', 'high', ARRAY['pedicure', 'basic', 'foot care']),
((SELECT id FROM service_categories WHERE slug = 'pedicures'), 'Spa Pedicure', 'spa-pedicure', 'Luxurious foot treatment with massage', 75, 45.00, 75.00, 'standard', 'growing', 'high', ARRAY['spa', 'pedicure', 'massage']),
((SELECT id FROM service_categories WHERE slug = 'pedicures'), 'Gel Pedicure', 'gel-pedicure', 'Long-lasting gel polish for toes', 70, 40.00, 70.00, 'standard', 'growing', 'medium', ARRAY['gel', 'pedicure', 'long-lasting']),
-- Nail Art
((SELECT id FROM service_categories WHERE slug = 'nail-art'), 'Custom Nail Art', 'custom-nail-art', 'Personalized artistic designs', 90, 50.00, 120.00, 'advanced', 'trending', 'medium', ARRAY['custom', 'art', 'design']),
((SELECT id FROM service_categories WHERE slug = 'nail-art'), 'Ombre Nails', 'ombre-nails', 'Gradient color transition', 75, 45.00, 85.00, 'standard', 'trending', 'medium', ARRAY['ombre', 'gradient', 'artistic']),
-- Extensions
((SELECT id FROM service_categories WHERE slug = 'extensions'), 'Acrylic Extensions', 'acrylic-extensions', 'Durable acrylic nail extensions', 120, 60.00, 100.00, 'standard', 'stable', 'high', ARRAY['acrylic', 'extensions', 'long nails']),
((SELECT id FROM service_categories WHERE slug = 'extensions'), 'Gel Extensions', 'gel-extensions', 'Natural-looking gel extensions', 110, 65.00, 110.00, 'standard', 'growing', 'high', ARRAY['gel', 'extensions', 'natural'])
ON CONFLICT (slug) DO NOTHING;

-- Insert Product Brands (with conflict resolution)
INSERT INTO product_brands (name, slug, description, logo_url, website, is_premium, specialization) VALUES
('OPI', 'opi', 'Professional nail lacquer and treatments', null, 'https://www.opi.com', true, 'gel'),
('Essie', 'essie', 'Premium nail polish and care products', null, 'https://www.essie.com', true, 'natural'),
('CND', 'cnd', 'Creative Nail Design professional products', null, 'https://www.cnd.com', true, 'gel'),
('Gelish', 'gelish', 'Professional gel nail products', null, 'https://www.gelish.com', true, 'gel'),
('Kiara Sky', 'kiara-sky', 'Dip powder and gel systems', null, 'https://www.kiarasky.com', false, 'dip')
ON CONFLICT (slug) DO NOTHING;

-- Insert Sample Salons (with conflict resolution)
INSERT INTO salons (
  name, slug, description, website,
  address, city, state, country, postal_code, latitude, longitude,
  operating_hours, services_offered, specialties, languages_spoken,
  accepts_walk_ins, parking_available, price_range, price_from, currency,
  logo_url, cover_image_url, is_published, is_verified, is_featured,
  meta_title, meta_description, keywords
) VALUES
(
  'Luxe Nail Studio', 'luxe-nail-studio', 
  'Premium nail salon offering luxury manicures, pedicures, and custom nail art in the heart of downtown.',
  'https://luxenailstudio.com',
  '123 Main St', 'New York', 'NY', 'USA', '10001', 40.7505, -73.9934,
  '{"monday": {"open": "09:00", "close": "19:00"}, "tuesday": {"open": "09:00", "close": "19:00"}, "wednesday": {"open": "09:00", "close": "19:00"}, "thursday": {"open": "09:00", "close": "20:00"}, "friday": {"open": "09:00", "close": "20:00"}, "saturday": {"open": "08:00", "close": "18:00"}, "sunday": {"open": "10:00", "close": "17:00"}}',
  ARRAY['manicures', 'pedicures', 'nail-art', 'gel-polish'],
  ARRAY['luxury-service', 'custom-art', 'bridal-nails'],
  ARRAY['en', 'es'],
  false, true, 'premium', 35.00, 'USD',
  null, null, true, true, true,
  'Luxe Nail Studio - Premium Nail Salon NYC',
  'Experience luxury nail care at Luxe Nail Studio in NYC. Expert manicures, pedicures, and custom nail art.',
  ARRAY['nail salon nyc', 'luxury nails', 'custom nail art']
),
(
  'Bella Nails & Spa', 'bella-nails-spa',
  'Full-service nail salon and spa offering relaxing treatments in a comfortable environment.',
  'https://bellanailsspa.com',
  '456 Oak Avenue', 'Los Angeles', 'CA', 'USA', '90210', 34.0736, -118.4004,
  '{"monday": {"open": "10:00", "close": "20:00"}, "tuesday": {"open": "10:00", "close": "20:00"}, "wednesday": {"open": "10:00", "close": "20:00"}, "thursday": {"open": "10:00", "close": "20:00"}, "friday": {"open": "10:00", "close": "21:00"}, "saturday": {"open": "09:00", "close": "21:00"}, "sunday": {"open": "10:00", "close": "19:00"}}',
  ARRAY['manicures', 'pedicures', 'spa-treatments', 'waxing'],
  ARRAY['spa-experience', 'couples-packages', 'group-events'],
  ARRAY['en', 'ko'],
  true, true, 'mid-range', 28.00, 'USD',
  null, null, true, true, true,
  'Bella Nails & Spa - Relaxing Nail Salon LA',
  'Unwind at Bella Nails & Spa in Los Angeles. Full nail services plus spa treatments for ultimate relaxation.',
  ARRAY['nail salon la', 'spa treatments', 'relaxing nails']
),
(
  'Quick Nails Express', 'quick-nails-express',
  'Fast and affordable nail services for busy professionals. No appointment necessary.',
  null,
  '789 Business Blvd', 'Chicago', 'IL', 'USA', '60601', 41.8781, -87.6298,
  '{"monday": {"open": "08:00", "close": "20:00"}, "tuesday": {"open": "08:00", "close": "20:00"}, "wednesday": {"open": "08:00", "close": "20:00"}, "thursday": {"open": "08:00", "close": "20:00"}, "friday": {"open": "08:00", "close": "20:00"}, "saturday": {"open": "09:00", "close": "19:00"}, "sunday": {"open": "11:00", "close": "17:00"}}',
  ARRAY['quick-manicures', 'express-pedicures', 'polish-change'],
  ARRAY['express-service', 'walk-ins-welcome', 'business-professional'],
  ARRAY['en'],
  true, false, 'budget', 15.00, 'USD',
  null, null, true, false, false,
  'Quick Nails Express - Fast Nail Services Chicago',
  'Quick and affordable nail services in Chicago. No appointment needed. Perfect for busy professionals.',
  ARRAY['quick nails chicago', 'express manicure', 'walk in nails']
),
(
  'Artisan Nail Gallery', 'artisan-nail-gallery',
  'Artistic nail designs and premium services by award-winning nail technicians.',
  'https://artisannailgallery.com',
  '321 Creative Way', 'Miami', 'FL', 'USA', '33101', 25.7617, -80.1918,
  '{"tuesday": {"open": "10:00", "close": "18:00"}, "wednesday": {"open": "10:00", "close": "18:00"}, "thursday": {"open": "10:00", "close": "20:00"}, "friday": {"open": "10:00", "close": "20:00"}, "saturday": {"open": "09:00", "close": "19:00"}, "sunday": {"open": "12:00", "close": "17:00"}}',
  ARRAY['nail-art', 'sculptured-nails', 'custom-designs', 'competitions'],
  ARRAY['award-winning', 'artistic-designs', 'competition-level', 'celebrity-clients'],
  ARRAY['en', 'es'],
  false, true, 'premium', 75.00, 'USD',
  null, null, true, true, true,
  'Artisan Nail Gallery - Award-Winning Nail Art Miami',
  'Experience award-winning nail artistry at Artisan Nail Gallery in Miami. Custom designs by expert technicians.',
  ARRAY['nail art miami', 'custom nail designs', 'award winning nails']
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Salon Services (with conflict resolution)
INSERT INTO salon_services (salon_id, service_type_id, price, duration_minutes, description, is_available, requires_appointment, online_booking_enabled) VALUES
-- Luxe Nail Studio services
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), (SELECT id FROM service_types WHERE slug = 'gel-manicure'), 55.00, 60, 'Premium gel manicure with luxury care', true, true, true),
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), (SELECT id FROM service_types WHERE slug = 'spa-pedicure'), 70.00, 75, 'Luxury spa pedicure experience', true, true, true),
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), (SELECT id FROM service_types WHERE slug = 'custom-nail-art'), 95.00, 90, 'Bespoke nail art by expert artists', true, true, false),

-- Bella Nails services
((SELECT id FROM salons WHERE slug = 'bella-nails-spa'), (SELECT id FROM service_types WHERE slug = 'basic-manicure'), 30.00, 45, 'Classic manicure in relaxing environment', true, false, false),
((SELECT id FROM salons WHERE slug = 'bella-nails-spa'), (SELECT id FROM service_types WHERE slug = 'basic-pedicure'), 40.00, 60, 'Soothing pedicure with massage', true, false, false),
((SELECT id FROM salons WHERE slug = 'bella-nails-spa'), (SELECT id FROM service_types WHERE slug = 'gel-manicure'), 45.00, 60, 'Long-lasting gel polish', true, true, false),

-- Quick Nails services
((SELECT id FROM salons WHERE slug = 'quick-nails-express'), (SELECT id FROM service_types WHERE slug = 'basic-manicure'), 20.00, 30, 'Fast basic manicure service', true, false, false),
((SELECT id FROM salons WHERE slug = 'quick-nails-express'), (SELECT id FROM service_types WHERE slug = 'basic-pedicure'), 25.00, 40, 'Quick pedicure service', true, false, false),

-- Artisan Gallery services
((SELECT id FROM salons WHERE slug = 'artisan-nail-gallery'), (SELECT id FROM service_types WHERE slug = 'custom-nail-art'), 150.00, 120, 'Competition-level artistic designs', true, true, true),
((SELECT id FROM salons WHERE slug = 'artisan-nail-gallery'), (SELECT id FROM service_types WHERE slug = 'ombre-nails'), 85.00, 75, 'Professional gradient designs', true, true, true),
((SELECT id FROM salons WHERE slug = 'artisan-nail-gallery'), (SELECT id FROM service_types WHERE slug = 'acrylic-extensions'), 90.00, 120, 'Sculptured acrylic extensions', true, true, false)
ON CONFLICT (salon_id, service_type_id) DO NOTHING;

-- Insert Sample Reviews (with conflict resolution)
INSERT INTO reviews (salon_id, rating, title, content, service_type, is_verified, is_published, reviewer_anonymous_id) VALUES
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), 5, 'Amazing Experience!', 'The gel manicure was perfect and lasted 3 weeks. The staff is professional and the salon is beautiful.', 'Gel Manicure', true, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), 4, 'Great nail art', 'Love my custom design! Took a bit longer than expected but totally worth it.', 'Custom Nail Art', false, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'luxe-nail-studio'), 5, 'Best pedicure ever', 'The spa pedicure was incredibly relaxing. My feet feel amazing and the polish is still perfect after 2 weeks.', 'Spa Pedicure', true, true, uuid_generate_v4()),

((SELECT id FROM salons WHERE slug = 'bella-nails-spa'), 4, 'Good value', 'Nice salon with friendly staff. Basic manicure was well done and reasonably priced.', 'Basic Manicure', false, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'bella-nails-spa'), 5, 'So relaxing', 'The atmosphere is very calming and the pedicure was wonderful. Will definitely return.', 'Basic Pedicure', true, true, uuid_generate_v4()),

((SELECT id FROM salons WHERE slug = 'quick-nails-express'), 3, 'Fast service', 'Quick and efficient but nothing special. Good for when you are in a hurry.', 'Basic Manicure', false, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'quick-nails-express'), 4, 'Perfect for busy schedule', 'Love that I can walk in without appointment. Service is basic but gets the job done.', 'Basic Pedicure', false, true, uuid_generate_v4()),

((SELECT id FROM salons WHERE slug = 'artisan-nail-gallery'), 5, 'Incredible artistry', 'The nail art here is on another level. Expensive but worth every penny for special occasions.', 'Custom Nail Art', true, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'artisan-nail-gallery'), 5, 'Award-winning quality', 'You can tell these technicians are true artists. My ombre nails are absolutely stunning.', 'Ombre Nails', true, true, uuid_generate_v4());

-- Insert Featured Placements for homepage (with conflict resolution)  
INSERT INTO featured_placements (salon_id, placement_type, position, priority_score, start_date, end_date, is_active, rotation_weight) 
SELECT s.id, 'homepage', 1, 100, now() - interval '1 day', now() + interval '30 days', true, 1.0
FROM salons s WHERE s.slug = 'luxe-nail-studio'
ON CONFLICT DO NOTHING;

INSERT INTO featured_placements (salon_id, placement_type, position, priority_score, start_date, end_date, is_active, rotation_weight) 
SELECT s.id, 'homepage', 2, 90, now() - interval '1 day', now() + interval '30 days', true, 0.8
FROM salons s WHERE s.slug = 'artisan-nail-gallery'
ON CONFLICT DO NOTHING;

INSERT INTO featured_placements (salon_id, placement_type, position, priority_score, start_date, end_date, is_active, rotation_weight) 
SELECT s.id, 'homepage', 3, 80, now() - interval '1 day', now() + interval '30 days', true, 0.6
FROM salons s WHERE s.slug = 'bella-nails-spa'
ON CONFLICT DO NOTHING;

-- =====================================================
-- SAFE SAMPLE DATA INSERTION COMPLETE!
-- =====================================================
-- Sample data has been safely inserted with conflict resolution.
-- Existing data will not be duplicated or overwritten.
-- 
-- Test your setup with:
-- curl http://localhost:3000/api/supabase-test
-- =====================================================