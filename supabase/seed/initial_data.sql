-- Insert vendor tiers
INSERT INTO vendor_tiers (name, display_name, price_monthly, features, max_services, booking_enabled, calendar_integration, analytics_enabled) VALUES
('free', 'Free Tier', 0, '{"basic_profile": true, "contact_form": true, "map_location": true, "reviews": true, "search_listing": true}', 10, false, false, false),
('premium', 'Premium Tier', 29.99, '{"everything_in_free": true, "unlimited_services": true, "online_booking": true, "calendar_integration": true, "priority_support": true, "analytics": true}', null, true, true, true),
('featured', 'Featured Tier', 99.99, '{"everything_in_premium": true, "featured_placement": true, "homepage_listing": true, "priority_search": true, "dedicated_manager": true, "advanced_analytics": true}', null, true, true, true);

-- Insert service categories
INSERT INTO service_categories (name, slug, description, icon, sort_order) VALUES
('Manicures', 'manicures', 'Professional nail care and manicure services', 'fas fa-hand-paper', 1),
('Pedicures', 'pedicures', 'Foot care and pedicure treatments', 'fas fa-shoe-prints', 2),
('Nail Art', 'nail-art', 'Creative nail designs and artistic services', 'fas fa-palette', 3),
('Nail Extensions', 'nail-extensions', 'Acrylic, gel, and other nail enhancement services', 'fas fa-expand-arrows-alt', 4),
('Nail Treatments', 'nail-treatments', 'Specialized nail health and treatment services', 'fas fa-medkit', 5),
('Spa Services', 'spa-services', 'Additional spa and wellness treatments', 'fas fa-spa', 6);

-- Insert service types
INSERT INTO service_types (category_id, name, slug, description, duration_minutes, price_range_low, price_range_high, specialization_level, trend_status, filtering_priority) VALUES
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'Classic Manicure', 'classic-manicure', 'Traditional nail care with polish application', 45, 25.00, 45.00, 'basic', 'stable', 'high'),
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'Gel Manicure', 'gel-manicure', 'Long-lasting gel polish manicure', 60, 35.00, 65.00, 'standard', 'growing', 'high'),
((SELECT id FROM service_categories WHERE slug = 'manicures'), 'Dip Powder Manicure', 'dip-powder-manicure', 'Durable dip powder nail treatment', 75, 40.00, 70.00, 'standard', 'trending', 'high'),
((SELECT id FROM service_categories WHERE slug = 'pedicures'), 'Classic Pedicure', 'classic-pedicure', 'Basic foot care and nail polish', 60, 30.00, 50.00, 'basic', 'stable', 'high'),
((SELECT id FROM service_categories WHERE slug = 'pedicures'), 'Gel Pedicure', 'gel-pedicure', 'Long-lasting gel polish pedicure', 75, 40.00, 70.00, 'standard', 'growing', 'high'),
((SELECT id FROM service_categories WHERE slug = 'nail-art'), 'Hand-Painted Designs', 'hand-painted-designs', 'Custom artistic nail designs', 90, 50.00, 120.00, 'advanced', 'trending', 'medium'),
((SELECT id FROM service_categories WHERE slug = 'nail-extensions'), 'Acrylic Nails', 'acrylic-nails', 'Full set acrylic nail extensions', 120, 45.00, 85.00, 'standard', 'stable', 'high'),
((SELECT id FROM service_categories WHERE slug = 'nail-extensions'), 'Gel Extensions', 'gel-extensions', 'Natural-looking gel nail extensions', 120, 55.00, 95.00, 'standard', 'growing', 'high'),
((SELECT id FROM service_categories WHERE slug = 'nail-treatments'), 'Nail Repair', 'nail-repair', 'Broken or damaged nail restoration', 30, 15.00, 35.00, 'advanced', 'stable', 'medium'),
((SELECT id FROM service_categories WHERE slug = 'spa-services'), 'Hand Massage', 'hand-massage', 'Relaxing hand and arm massage', 30, 20.00, 40.00, 'basic', 'stable', 'low');

-- Insert product brands
INSERT INTO product_brands (name, slug, description, website, is_premium, specialization) VALUES
('OPI', 'opi', 'Professional nail lacquer and treatments', 'https://www.opi.com', true, 'gel'),
('Essie', 'essie', 'Trendy nail polish and care products', 'https://www.essie.com', false, 'natural'),
('CND', 'cnd', 'Professional nail system and products', 'https://www.cnd.com', true, 'gel'),
('Gelish', 'gelish', 'Soak-off gel polish system', 'https://www.gelish.com', true, 'gel'),
('Young Nails', 'young-nails', 'Acrylic and gel nail products', 'https://www.youngnails.com', true, 'acrylic'),
('Kiara Sky', 'kiara-sky', 'Dip powder and gel systems', 'https://www.kiarasky.com', true, 'dip'),
('Sally Hansen', 'sally-hansen', 'Consumer nail care and treatments', 'https://www.sallyhansen.com', false, 'natural'),
('Zoya', 'zoya', 'Long-wearing nail polish', 'https://www.zoya.com', false, 'natural');

-- Insert sample salons (you would replace these with real data)
INSERT INTO salons (owner_id, name, slug, description, address, city, state, country, postal_code, latitude, longitude, phone, email, website, price_range, price_from, specialties, services_offered, languages_spoken, is_published, is_verified, operating_hours) VALUES
(null, 'Elegant Nails Spa', 'elegant-nails-spa', 'Full-service nail salon offering premium manicures, pedicures, and nail art in a relaxing spa environment.', '123 Main Street', 'Los Angeles', 'CA', 'USA', '90210', 34.0522, -118.2437, '(555) 123-4567', 'info@elegantnails.com', 'https://elegantnails.com', 'mid-range', 35.00, ARRAY['Gel Manicures', 'Nail Art', 'Spa Pedicures'], ARRAY['Classic Manicure', 'Gel Manicure', 'Classic Pedicure', 'Gel Pedicure', 'Nail Art'], ARRAY['en', 'es'], true, true, '{"monday": {"open": "09:00", "close": "19:00"}, "tuesday": {"open": "09:00", "close": "19:00"}, "wednesday": {"open": "09:00", "close": "19:00"}, "thursday": {"open": "09:00", "close": "19:00"}, "friday": {"open": "09:00", "close": "20:00"}, "saturday": {"open": "08:00", "close": "20:00"}, "sunday": {"open": "10:00", "close": "18:00"}}'),

(null, 'Luxe Nail Lounge', 'luxe-nail-lounge', 'Upscale nail salon specializing in premium gel services and luxury treatments.', '456 Beverly Drive', 'Beverly Hills', 'CA', 'USA', '90210', 34.0736, -118.4004, '(555) 987-6543', 'contact@luxenaillounge.com', 'https://luxenaillounge.com', 'premium', 65.00, ARRAY['Premium Gel Services', 'Luxury Treatments', 'VIP Experience'], ARRAY['Gel Manicure', 'Dip Powder', 'Gel Extensions', 'Hand-Painted Designs'], ARRAY['en'], true, true, '{"monday": {"open": "10:00", "close": "20:00"}, "tuesday": {"open": "10:00", "close": "20:00"}, "wednesday": {"open": "10:00", "close": "20:00"}, "thursday": {"open": "10:00", "close": "20:00"}, "friday": {"open": "09:00", "close": "21:00"}, "saturday": {"open": "09:00", "close": "21:00"}, "sunday": {"open": "11:00", "close": "19:00"}}'),

(null, 'Quick Nails Express', 'quick-nails-express', 'Fast and affordable nail services for busy lifestyles. Walk-ins welcome!', '789 Downtown Blvd', 'Miami', 'FL', 'USA', '33101', 25.7617, -80.1918, '(555) 456-7890', 'info@quicknails.com', null, 'budget', 20.00, ARRAY['Quick Service', 'Walk-ins Welcome', 'Affordable Prices'], ARRAY['Classic Manicure', 'Classic Pedicure', 'Basic Nail Art'], ARRAY['en', 'es'], true, false, '{"monday": {"open": "08:00", "close": "20:00"}, "tuesday": {"open": "08:00", "close": "20:00"}, "wednesday": {"open": "08:00", "close": "20:00"}, "thursday": {"open": "08:00", "close": "20:00"}, "friday": {"open": "08:00", "close": "21:00"}, "saturday": {"open": "07:00", "close": "21:00"}, "sunday": {"open": "09:00", "close": "19:00"}}');

-- Insert sample reviews
INSERT INTO reviews (salon_id, rating, title, content, service_type, is_published, is_moderated) VALUES
((SELECT id FROM salons WHERE slug = 'elegant-nails-spa'), 5, 'Amazing gel manicure!', 'The staff was professional and the gel manicure lasted exactly 3 weeks as promised. The salon is clean and relaxing.', 'Gel Manicure', true, true),
((SELECT id FROM salons WHERE slug = 'elegant-nails-spa'), 4, 'Great service', 'Love the nail art designs here. Very creative and skilled technicians.', 'Nail Art', true, true),
((SELECT id FROM salons WHERE slug = 'luxe-nail-lounge'), 5, 'Luxury experience', 'Worth every penny! The premium service and attention to detail is exceptional.', 'Premium Service', true, true),
((SELECT id FROM salons WHERE slug = 'quick-nails-express'), 4, 'Fast and affordable', 'Perfect for a quick touch-up. In and out in 30 minutes with a great classic manicure.', 'Classic Manicure', true, true);