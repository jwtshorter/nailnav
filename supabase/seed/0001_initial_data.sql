-- Initial Seed Data for Nail Nav

-- Insert Vendor Tiers
INSERT INTO vendor_tiers (name, display_name, price_monthly, features, max_services, booking_enabled, calendar_integration, analytics_enabled) VALUES
('free', 'Free Listing', 0.00, '{"basic_listing": true, "contact_info": true, "photos": 3, "reviews": true}', 5, false, false, false),
('premium', 'Premium', 29.99, '{"everything_in_free": true, "unlimited_photos": true, "priority_support": true, "social_media_links": true, "custom_hours": true}', 20, true, false, true),
('featured', 'Featured', 79.99, '{"everything_in_premium": true, "homepage_placement": true, "search_priority": true, "advanced_analytics": true, "calendar_sync": true}', null, true, true, true);

-- Insert Service Categories
INSERT INTO service_categories (name, slug, description, icon, sort_order) VALUES
('Manicures', 'manicures', 'Professional nail care for hands including shaping, cuticle care, and polish application', 'hand', 1),
('Pedicures', 'pedicures', 'Comprehensive foot and nail care services including exfoliation and massage', 'foot', 2),
('Nail Art', 'nail-art', 'Creative and decorative nail designs and artwork', 'palette', 3),
('Nail Extensions', 'nail-extensions', 'Artificial nail lengthening services using various techniques', 'plus', 4),
('Nail Treatments', 'nail-treatments', 'Therapeutic and restorative nail health treatments', 'heart', 5),
('Spa Services', 'spa-services', 'Relaxation and wellness services beyond basic nail care', 'spa', 6);

-- Insert Service Types
INSERT INTO service_types (category_id, name, slug, description, duration_minutes, price_range_low, price_range_high, specialization_level, trend_status, filtering_priority, keywords) VALUES
-- Manicures
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'Classic Manicure', 'classic-manicure', 'Traditional manicure with shaping, cuticle care, and regular polish', 45, 25.00, 40.00, 'basic', 'stable', 'high', '{"manicure", "classic", "polish", "basic"}'),
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'Gel Manicure', 'gel-manicure', 'Long-lasting manicure with gel polish that cures under UV light', 60, 35.00, 55.00, 'standard', 'stable', 'high', '{"gel", "manicure", "uv", "long-lasting"}'),
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'French Manicure', 'french-manicure', 'Elegant classic style with natural base and white tips', 50, 30.00, 45.00, 'standard', 'stable', 'high', '{"french", "manicure", "classic", "elegant"}'),
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'Dip Powder Manicure', 'dip-powder-manicure', 'Durable manicure using colored powder dip system', 75, 40.00, 65.00, 'advanced', 'growing', 'medium', '{"dip", "powder", "durable", "long-lasting"}'),

-- Pedicures
((SELECT id FROM service_categories WHERE slug = 'pedicures'), 'Classic Pedicure', 'classic-pedicure', 'Essential foot care with nail trimming, filing, and polish', 45, 30.00, 50.00, 'basic', 'stable', 'high', '{"pedicure", "classic", "foot care", "basic"}'),
((SELECT id FROM service_categories WHERE slug = 'pedicures'), 'Spa Pedicure', 'spa-pedicure', 'Luxurious pedicure with exfoliation, mask, and extended massage', 75, 50.00, 80.00, 'standard', 'growing', 'high', '{"spa", "pedicure", "luxury", "massage"}'),
((SELECT id FROM service_categories WHERE slug = 'pedicures'), 'Gel Pedicure', 'gel-pedicure', 'Long-lasting pedicure with gel polish application', 60, 40.00, 65.00, 'standard', 'stable', 'medium', '{"gel", "pedicure", "long-lasting"}'),
((SELECT id FROM service_categories WHERE slug = 'pedicures'), 'Medical Pedicure', 'medical-pedicure', 'Therapeutic foot treatment for nail and skin health issues', 90, 60.00, 100.00, 'advanced', 'growing', 'low', '{"medical", "therapeutic", "foot health"}'),

-- Nail Art
((SELECT id FROM service_categories WHERE slug = 'nail-art'), 'Simple Nail Art', 'simple-nail-art', 'Basic nail designs and decorations per nail', 15, 5.00, 10.00, 'basic', 'stable', 'medium', '{"nail art", "design", "simple", "decoration"}'),
((SELECT id FROM service_categories WHERE slug = 'nail-art'), 'Custom Nail Art', 'custom-nail-art', 'Personalized and intricate nail designs', 30, 15.00, 35.00, 'advanced', 'trending', 'medium', '{"custom", "intricate", "personalized", "art"}'),
((SELECT id FROM service_categories WHERE slug = 'nail-art'), 'Holiday Nail Art', 'holiday-nail-art', 'Seasonal and holiday-themed nail designs', 25, 10.00, 25.00, 'standard', 'trending', 'low', '{"holiday", "seasonal", "themed", "festive"}'),

-- Nail Extensions
((SELECT id FROM service_categories WHERE slug = 'nail-extensions'), 'Acrylic Extensions', 'acrylic-extensions', 'Durable artificial nail extensions using acrylic system', 90, 50.00, 80.00, 'advanced', 'stable', 'high', '{"acrylic", "extensions", "artificial", "durable"}'),
((SELECT id FROM service_categories WHERE slug = 'nail-extensions'), 'Gel Extensions', 'gel-extensions', 'Natural-looking extensions using gel overlay system', 120, 60.00, 90.00, 'advanced', 'growing', 'high', '{"gel", "extensions", "natural", "overlay"}'),
((SELECT id FROM service_categories WHERE slug = 'nail-extensions'), 'Silk Wraps', 'silk-wraps', 'Natural nail strengthening with silk fiber application', 75, 40.00, 60.00, 'standard', 'declining', 'low', '{"silk", "wraps", "strengthening", "natural"}'),

-- Nail Treatments
((SELECT id FROM service_categories WHERE slug = 'nail-treatments'), 'Nail Repair', 'nail-repair', 'Treatment for damaged, broken, or problematic nails', 30, 15.00, 30.00, 'standard', 'stable', 'medium', '{"repair", "damaged", "treatment", "fix"}'),
((SELECT id FROM service_categories WHERE slug = 'nail-treatments'), 'Cuticle Treatment', 'cuticle-treatment', 'Specialized care for cuticle health and appearance', 20, 10.00, 20.00, 'basic', 'stable', 'low', '{"cuticle", "treatment", "care", "health"}'),
((SELECT id FROM service_categories WHERE slug = 'nail-treatments'), 'Strengthening Treatment', 'strengthening-treatment', 'Therapy to improve weak or brittle nail condition', 25, 20.00, 35.00, 'standard', 'growing', 'medium', '{"strengthening", "weak nails", "brittle", "therapy"}'),

-- Spa Services
((SELECT id FROM service_categories WHERE slug = 'spa-services'), 'Hand Massage', 'hand-massage', 'Relaxing massage therapy for hands and arms', 20, 15.00, 25.00, 'basic', 'stable', 'low', '{"massage", "hands", "relaxing", "therapy"}'),
((SELECT id FROM service_categories WHERE slug = 'spa-services'), 'Paraffin Treatment', 'paraffin-treatment', 'Moisturizing paraffin wax treatment for hands or feet', 25, 20.00, 35.00, 'standard', 'stable', 'low', '{"paraffin", "wax", "moisturizing", "treatment"}'),
((SELECT id FROM service_categories WHERE slug = 'spa-services'), 'Callus Removal', 'callus-removal', 'Professional removal of foot calluses and rough skin', 30, 25.00, 40.00, 'standard', 'stable', 'medium', '{"callus", "removal", "foot care", "rough skin"}');

-- Insert Product Brands
INSERT INTO product_brands (name, slug, description, website, is_premium, specialization) VALUES
('OPI', 'opi', 'Professional nail lacquer and treatments trusted by salons worldwide', 'https://www.opi.com', true, 'gel'),
('Essie', 'essie', 'Fashion-forward nail colors and innovative nail care', 'https://www.essie.com', true, 'natural'),
('CND', 'cnd', 'Creative nail design products including Shellac gel system', 'https://www.cnd.com', true, 'gel'),
('Gelish', 'gelish', 'Professional gel nail polish system with salon-quality results', 'https://www.gelish.com', true, 'gel'),
('SNS', 'sns', 'Signature nail systems dipping powder for healthy nails', 'https://www.snsnails.com', true, 'dip'),
('Young Nails', 'young-nails', 'Professional acrylic and gel systems for nail technicians', 'https://www.youngnails.com', true, 'acrylic'),
('Kiara Sky', 'kiara-sky', 'Innovative dip powder and gel polish collections', 'https://www.kiarasky.com', false, 'dip'),
('Revel Nail', 'revel-nail', 'High-quality dip powder system with vibrant colors', 'https://www.revelnail.com', false, 'dip');

-- Insert Sample Salons (These would be real salons in production)
INSERT INTO salons (
  name, slug, description, address, city, state, country, postal_code, 
  latitude, longitude, phone, email, website, 
  operating_hours, services_offered, specialties, languages_spoken,
  accepts_walk_ins, parking_available, price_range, price_from, currency,
  is_published, is_verified, is_featured, tier_id
) VALUES
(
  'Elegant Nails Spa', 'elegant-nails-spa', 
  'Premium nail salon offering luxurious manicures, pedicures, and nail art in a relaxing spa environment.',
  '123 Main Street', 'Los Angeles', 'CA', 'USA', '90210',
  34.0522, -118.2437, '(555) 123-4567', 'info@elegantnailsspa.com', 'https://elegantnailsspa.com',
  '{"monday": {"open": "09:00", "close": "19:00"}, "tuesday": {"open": "09:00", "close": "19:00"}, "wednesday": {"open": "09:00", "close": "19:00"}, "thursday": {"open": "09:00", "close": "19:00"}, "friday": {"open": "09:00", "close": "20:00"}, "saturday": {"open": "08:00", "close": "20:00"}, "sunday": {"open": "10:00", "close": "18:00"}}',
  '{"Gel Manicures", "Spa Pedicures", "Nail Art", "Acrylic Extensions"}',
  '{"Gel Manicures", "Nail Art", "Spa Pedicures"}', '{"en", "es"}',
  false, true, 'premium', 35.00, 'USD',
  true, true, true, (SELECT id FROM vendor_tiers WHERE name = 'featured')
),
(
  'Luxe Nail Lounge', 'luxe-nail-lounge',
  'Upscale nail boutique specializing in premium gel services and luxury treatments.',
  '456 Beverly Drive', 'Beverly Hills', 'CA', 'USA', '90210',
  34.0736, -118.4004, '(555) 987-6543', 'contact@luxenaillounge.com', 'https://luxenaillounge.com',
  '{"monday": {"open": "10:00", "close": "20:00"}, "tuesday": {"open": "10:00", "close": "20:00"}, "wednesday": {"open": "10:00", "close": "20:00"}, "thursday": {"open": "10:00", "close": "20:00"}, "friday": {"open": "10:00", "close": "21:00"}, "saturday": {"open": "09:00", "close": "21:00"}, "sunday": {"open": "11:00", "close": "19:00"}}',
  '{"Premium Gel Services", "Luxury Treatments", "Custom Nail Art"}',
  '{"Premium Gel", "Luxury Treatments"}', '{"en"}',
  false, true, 'premium', 65.00, 'USD',
  true, true, true, (SELECT id FROM vendor_tiers WHERE name = 'premium')
),
(
  'Quick Nails Express', 'quick-nails-express',
  'Fast and affordable nail services with walk-ins welcome. Perfect for busy schedules.',
  '789 Downtown Blvd', 'Miami', 'FL', 'USA', '33101',
  25.7617, -80.1918, '(555) 456-7890', 'hello@quicknailsexpress.com', null,
  '{"monday": {"open": "08:00", "close": "20:00"}, "tuesday": {"open": "08:00", "close": "20:00"}, "wednesday": {"open": "08:00", "close": "20:00"}, "thursday": {"open": "08:00", "close": "20:00"}, "friday": {"open": "08:00", "close": "21:00"}, "saturday": {"open": "08:00", "close": "21:00"}, "sunday": {"open": "09:00", "close": "19:00"}}',
  '{"Quick Service", "Basic Manicures", "Basic Pedicures"}',
  '{"Quick Service", "Walk-ins Welcome"}', '{"en", "es"}',
  true, true, 'budget', 20.00, 'USD',
  true, false, false, (SELECT id FROM vendor_tiers WHERE name = 'free')
),
(
  'Trendy Nails Studio', 'trendy-nails-studio',
  'Creative nail art studio featuring the latest trends and Instagram-worthy designs.',
  '321 Fashion Ave', 'New York', 'NY', 'USA', '10001',
  40.7128, -74.0060, '(555) 234-5678', 'studio@trendynails.com', 'https://trendynailsstudio.com',
  '{"monday": {"open": "10:00", "close": "19:00"}, "tuesday": {"open": "10:00", "close": "19:00"}, "wednesday": {"open": "10:00", "close": "19:00"}, "thursday": {"open": "10:00", "close": "20:00"}, "friday": {"open": "10:00", "close": "21:00"}, "saturday": {"open": "09:00", "close": "21:00"}, "sunday": {"open": "11:00", "close": "18:00"}}',
  '{"Nail Art", "Acrylic Extensions", "Gel Manicures", "Trendy Designs"}',
  '{"Nail Art", "Acrylic Extensions"}', '{"en"}',
  false, false, 'mid-range', 40.00, 'USD',
  true, true, true, (SELECT id FROM vendor_tiers WHERE name = 'premium')
),
(
  'Zen Nail Wellness', 'zen-nail-wellness',
  'Holistic nail care focusing on nail health and wellness in a tranquil environment.',
  '567 Wellness Way', 'Austin', 'TX', 'USA', '78701',
  30.2672, -97.7431, '(555) 345-6789', 'info@zennailwellness.com', 'https://zennailwellness.com',
  '{"monday": {"open": "09:00", "close": "18:00"}, "tuesday": {"open": "09:00", "close": "18:00"}, "wednesday": {"open": "09:00", "close": "18:00"}, "thursday": {"open": "09:00", "close": "18:00"}, "friday": {"open": "09:00", "close": "19:00"}, "saturday": {"open": "08:00", "close": "19:00"}, "sunday": {"closed": true}}',
  '{"Wellness Treatments", "Organic Products", "Therapeutic Nail Care"}',
  '{"Organic Treatments", "Wellness"}', '{"en"}',
  true, true, 'premium', 50.00, 'USD',
  true, true, false, (SELECT id FROM vendor_tiers WHERE name = 'premium')
);

-- Insert Sample Reviews
INSERT INTO reviews (salon_id, rating, title, content, service_type, is_verified, is_published, reviewer_anonymous_id) VALUES
((SELECT id FROM salons WHERE slug = 'elegant-nails-spa'), 5, 'Amazing service!', 'Absolutely loved my gel manicure. The staff was professional and the results lasted for weeks!', 'Gel Manicure', true, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'elegant-nails-spa'), 4, 'Great spa experience', 'Beautiful salon with relaxing atmosphere. My pedicure was wonderful.', 'Spa Pedicure', false, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'luxe-nail-lounge'), 5, 'Premium quality', 'Worth every penny! The gel application was flawless and the customer service exceeded expectations.', 'Premium Gel Service', true, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'quick-nails-express'), 4, 'Fast and efficient', 'Perfect for a quick touch-up. No appointment needed and reasonable prices.', 'Basic Manicure', false, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'trendy-nails-studio'), 5, 'Incredible nail art', 'The artist created exactly what I envisioned. Such talented staff!', 'Custom Nail Art', true, true, uuid_generate_v4()),
((SELECT id FROM salons WHERE slug = 'zen-nail-wellness'), 4, 'Relaxing and healing', 'Great for nail health. They really care about the wellness aspect.', 'Wellness Treatment', false, true, uuid_generate_v4());

-- Insert Salon Services (linking salons to service types with custom pricing)
-- Elegant Nails Spa services
INSERT INTO salon_services (salon_id, service_type_id, price, duration_minutes, is_available, online_booking_enabled) VALUES
((SELECT id FROM salons WHERE slug = 'elegant-nails-spa'), (SELECT id FROM service_types WHERE slug = 'gel-manicure'), 45.00, 60, true, true),
((SELECT id FROM salons WHERE slug = 'elegant-nails-spa'), (SELECT id FROM service_types WHERE slug = 'spa-pedicure'), 65.00, 75, true, true),
((SELECT id FROM salons WHERE slug = 'elegant-nails-spa'), (SELECT id FROM service_types WHERE slug = 'custom-nail-art'), 25.00, 30, true, false),
((SELECT id FROM salons WHERE slug = 'elegant-nails-spa'), (SELECT id FROM service_types WHERE slug = 'acrylic-extensions'), 70.00, 90, true, true);

-- Luxe Nail Lounge services
INSERT INTO salon_services (salon_id, service_type_id, price, duration_minutes, is_available, online_booking_enabled) VALUES
((SELECT id FROM salons WHERE slug = 'luxe-nail-lounge'), (SELECT id FROM service_types WHERE slug = 'gel-manicure'), 55.00, 60, true, true),
((SELECT id FROM salons WHERE slug = 'luxe-nail-lounge'), (SELECT id FROM service_types WHERE slug = 'gel-extensions'), 85.00, 120, true, true),
((SELECT id FROM salons WHERE slug = 'luxe-nail-lounge'), (SELECT id FROM service_types WHERE slug = 'dip-powder-manicure'), 60.00, 75, true, false);

-- Quick Nails Express services
INSERT INTO salon_services (salon_id, service_type_id, price, duration_minutes, is_available, online_booking_enabled) VALUES
((SELECT id FROM salons WHERE slug = 'quick-nails-express'), (SELECT id FROM service_types WHERE slug = 'classic-manicure'), 25.00, 30, true, false),
((SELECT id FROM salons WHERE slug = 'quick-nails-express'), (SELECT id FROM service_types WHERE slug = 'classic-pedicure'), 35.00, 45, true, false),
((SELECT id FROM salons WHERE slug = 'quick-nails-express'), (SELECT id FROM service_types WHERE slug = 'simple-nail-art'), 8.00, 15, true, false);

-- Featured Placements for homepage
INSERT INTO featured_placements (salon_id, placement_type, position, priority_score, start_date, end_date, is_active) VALUES
((SELECT id FROM salons WHERE slug = 'elegant-nails-spa'), 'homepage', 1, 100, now() - interval '1 day', now() + interval '30 days', true),
((SELECT id FROM salons WHERE slug = 'luxe-nail-lounge'), 'homepage', 2, 95, now() - interval '1 day', now() + interval '30 days', true),
((SELECT id FROM salons WHERE slug = 'trendy-nails-studio'), 'homepage', 3, 90, now() - interval '1 day', now() + interval '30 days', true);