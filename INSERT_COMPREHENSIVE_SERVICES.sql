-- Comprehensive Service Catalog for NailNav
-- This file populates service categories and service types based on industry standards

-- First, clear existing data to avoid duplicates
DELETE FROM salon_services;
DELETE FROM service_types;
DELETE FROM service_categories;

-- Insert Service Categories
INSERT INTO service_categories (name, slug, parent_id, description, icon, sort_order, is_active) VALUES
-- Main Categories
('Manicure', 'manicure', NULL, 'Professional nail care and polish services for hands', 'nail-polish', 1, true),
('Pedicure', 'pedicure', NULL, 'Professional nail care and polish services for feet', 'foot', 2, true),
('Acrylic Nails', 'acrylic-nails', NULL, 'Artificial nail extensions using acrylic powder and liquid', 'extensions', 3, true),
('Gel Extensions', 'gel-extensions', NULL, 'Nail extensions using gel-based products', 'gel', 4, true),
('Dip Powder Nails', 'dip-powder-nails', NULL, 'Long-lasting nail treatment using colored powder', 'powder', 5, true),
('Builder Gel', 'builder-gel', NULL, 'Strengthening gel overlay for natural or extended nails', 'builder', 6, true),
('Gel X', 'gel-x', NULL, 'Pre-formed soft gel nail extensions', 'gel-x', 7, true),
('Nail Maintenance', 'nail-maintenance', NULL, 'Repair and removal services', 'tools', 8, true),
('Nail Art & Finish', 'nail-art-finish', NULL, 'Decorative designs and finishing touches', 'art', 9, true),
('Hand & Foot Treatments', 'hand-foot-treatments', NULL, 'Spa treatments for hands and feet', 'spa', 10, true),
('Massage', 'massage', NULL, 'Relaxing massage services', 'massage', 11, true),
('Facials', 'facials', NULL, 'Professional facial treatments', 'face', 12, true),
('Eyelash Extensions', 'eyelash-extensions', NULL, 'Individual eyelash extension services', 'eyelash', 13, true),
('Lash Treatments', 'lash-treatments', NULL, 'Eyelash enhancement treatments', 'lash-lift', 14, true),
('Brow Treatments', 'brow-treatments', NULL, 'Eyebrow shaping and enhancement', 'eyebrow', 15, true),
('Waxing', 'waxing', NULL, 'Hair removal services using wax', 'wax', 16, true),
('Add-Ons & Extras', 'add-ons-extras', NULL, 'Additional services and upgrades', 'plus', 17, true),
('Hair Services', 'hair-services', NULL, 'Professional hair cutting and styling', 'hair', 18, true);

-- Insert Service Types
INSERT INTO service_types (category_id, name, slug, description, duration_minutes, price_range_low, price_range_high, specialization_level, trend_status, filtering_priority, keywords) 
SELECT 
  sc.id,
  st.name,
  st.slug,
  st.description,
  st.duration_minutes,
  st.price_range_low,
  st.price_range_high,
  st.specialization_level,
  st.trend_status,
  st.filtering_priority,
  st.keywords
FROM service_categories sc
CROSS JOIN (
  VALUES 
  -- Manicure Services
  ('manicure', 'Classic Manicure', 'classic-manicure', 'Traditional nail care with cuticle care, shaping, and polish', 30, 20.00, 40.00, 'basic', 'stable', 'high', ARRAY['classic', 'basic', 'traditional', 'polish']),
  ('manicure', 'Deluxe Manicure', 'deluxe-manicure', 'Enhanced manicure with additional treatments and premium polish', 45, 30.00, 55.00, 'standard', 'stable', 'high', ARRAY['deluxe', 'premium', 'enhanced', 'luxury']),
  ('manicure', 'Gel Manicure', 'gel-manicure', 'Long-lasting gel polish that cures under UV light', 45, 35.00, 60.00, 'standard', 'growing', 'high', ARRAY['gel', 'long-lasting', 'uv', 'durable']),
  ('manicure', 'French Manicure', 'french-manicure', 'Classic white tip design with natural or pink base', 45, 25.00, 50.00, 'standard', 'stable', 'medium', ARRAY['french', 'white-tip', 'classic', 'elegant']),
  ('manicure', 'Collagen Manicure', 'collagen-manicure', 'Anti-aging manicure with collagen treatment for hands', 45, 40.00, 70.00, 'advanced', 'trending', 'medium', ARRAY['collagen', 'anti-aging', 'skincare', 'luxury']),
  ('manicure', 'Builder Gel Manicure', 'builder-gel-manicure', 'Strengthening gel overlay on natural nails with polish', 60, 45.00, 75.00, 'advanced', 'trending', 'high', ARRAY['builder-gel', 'strengthening', 'overlay', 'durable']),
  
  -- Pedicure Services
  ('pedicure', 'Classic Pedicure', 'classic-pedicure', 'Traditional foot care with nail shaping, cuticle care, and polish', 45, 25.00, 45.00, 'basic', 'stable', 'high', ARRAY['classic', 'foot-care', 'traditional', 'polish']),
  ('pedicure', 'Deluxe Pedicure', 'deluxe-pedicure', 'Enhanced pedicure with exfoliation, mask, and massage', 60, 35.00, 60.00, 'standard', 'stable', 'high', ARRAY['deluxe', 'exfoliation', 'mask', 'massage']),
  ('pedicure', 'Spa Pedicure', 'spa-pedicure', 'Luxurious pedicure with premium treatments and relaxation', 60, 45.00, 75.00, 'standard', 'growing', 'high', ARRAY['spa', 'luxury', 'relaxation', 'premium']),
  ('pedicure', 'Hot Stone Pedicure', 'hot-stone-pedicure', 'Therapeutic pedicure with heated stone massage', 70, 55.00, 85.00, 'advanced', 'trending', 'medium', ARRAY['hot-stone', 'therapeutic', 'massage', 'relaxation']),
  ('pedicure', 'Salon Special Pedicure', 'salon-special-pedicure', 'Signature pedicure with unique treatments and techniques', 75, 60.00, 95.00, 'advanced', 'trending', 'low', ARRAY['signature', 'special', 'unique', 'premium']),
  
  -- Acrylic Nails
  ('acrylic-nails', 'Acrylic Full Set', 'acrylic-full-set', 'Complete set of acrylic nail extensions', 60, 35.00, 70.00, 'standard', 'stable', 'high', ARRAY['acrylic', 'full-set', 'extensions', 'artificial']),
  ('acrylic-nails', 'Acrylic Fill', 'acrylic-fill', 'Maintenance fill for existing acrylic nails', 45, 25.00, 50.00, 'basic', 'stable', 'high', ARRAY['acrylic', 'fill', 'maintenance', 'touch-up']),
  ('acrylic-nails', 'Acrylic Full Set French Tip', 'acrylic-full-set-french', 'Acrylic extensions with classic French tip design', 75, 45.00, 80.00, 'standard', 'stable', 'medium', ARRAY['acrylic', 'french-tip', 'full-set', 'classic']),
  ('acrylic-nails', 'Acrylic French Fill', 'acrylic-french-fill', 'Fill service for French tip acrylic nails', 60, 35.00, 60.00, 'standard', 'stable', 'medium', ARRAY['acrylic', 'french', 'fill', 'maintenance']),
  
  -- Gel Extensions
  ('gel-extensions', 'Gel Extension Full Set', 'gel-extension-full-set', 'Complete set of gel nail extensions', 60, 40.00, 75.00, 'standard', 'growing', 'high', ARRAY['gel', 'extensions', 'full-set', 'natural']),
  ('gel-extensions', 'Gel Extension Fill', 'gel-extension-fill', 'Maintenance fill for existing gel extensions', 45, 30.00, 55.00, 'basic', 'growing', 'high', ARRAY['gel', 'fill', 'maintenance', 'extensions']),
  ('gel-extensions', 'Gel French Tip Full Set', 'gel-french-full-set', 'Gel extensions with French tip design', 75, 50.00, 85.00, 'standard', 'growing', 'medium', ARRAY['gel', 'french-tip', 'extensions', 'elegant']),
  ('gel-extensions', 'Gel French Tip Fill', 'gel-french-fill', 'Fill service for French tip gel extensions', 60, 40.00, 65.00, 'standard', 'growing', 'medium', ARRAY['gel', 'french', 'fill', 'extensions']),
  
  -- Dip Powder Nails
  ('dip-powder-nails', 'Dip Powder Full Set', 'dip-powder-full-set', 'Complete dip powder manicure for long-lasting color', 60, 35.00, 65.00, 'standard', 'trending', 'high', ARRAY['dip-powder', 'full-set', 'long-lasting', 'color']),
  ('dip-powder-nails', 'Dip Powder Fill', 'dip-powder-fill', 'Maintenance fill for existing dip powder nails', 45, 25.00, 50.00, 'basic', 'trending', 'high', ARRAY['dip-powder', 'fill', 'maintenance', 'touch-up']),
  ('dip-powder-nails', 'Dip Powder French Full Set', 'dip-french-full-set', 'Dip powder with French tip design', 75, 45.00, 75.00, 'standard', 'trending', 'medium', ARRAY['dip-powder', 'french-tip', 'full-set', 'classic']),
  ('dip-powder-nails', 'Dip Powder French Fill', 'dip-french-fill', 'Fill service for French tip dip powder', 60, 35.00, 60.00, 'standard', 'trending', 'medium', ARRAY['dip-powder', 'french', 'fill', 'maintenance']),
  ('dip-powder-nails', 'Dip Powder Ombre Full Set', 'dip-ombre-full-set', 'Gradient color dip powder technique', 75, 50.00, 80.00, 'advanced', 'trending', 'medium', ARRAY['dip-powder', 'ombre', 'gradient', 'artistic']),
  
  -- Builder Gel
  ('builder-gel', 'Builder Gel Overlay', 'builder-gel-overlay', 'Strengthening gel overlay on natural nails', 60, 40.00, 70.00, 'standard', 'trending', 'high', ARRAY['builder-gel', 'overlay', 'strengthening', 'natural']),
  ('builder-gel', 'Builder Gel Fill', 'builder-gel-fill', 'Maintenance fill for builder gel overlay', 45, 30.00, 55.00, 'basic', 'trending', 'high', ARRAY['builder-gel', 'fill', 'maintenance', 'overlay']),
  
  -- Gel X
  ('gel-x', 'Gel X Full Set', 'gel-x-full-set', 'Pre-formed soft gel extension application', 75, 50.00, 85.00, 'advanced', 'trending', 'high', ARRAY['gel-x', 'soft-gel', 'extensions', 'pre-formed']),
  ('gel-x', 'Gel X Fill', 'gel-x-fill', 'Maintenance service for Gel X extensions', 60, 40.00, 65.00, 'standard', 'trending', 'high', ARRAY['gel-x', 'fill', 'maintenance', 'extensions']),
  
  -- Nail Maintenance
  ('nail-maintenance', 'Nail Repair', 'nail-repair', 'Fix broken or damaged nails', 20, 5.00, 15.00, 'basic', 'stable', 'medium', ARRAY['repair', 'fix', 'broken', 'damaged']),
  ('nail-maintenance', 'Nail Removal', 'nail-removal', 'Safe removal of artificial nails', 20, 10.00, 25.00, 'basic', 'stable', 'medium', ARRAY['removal', 'artificial', 'safe', 'clean']),
  
  -- Nail Art & Finish
  ('nail-art-finish', 'Basic Nail Art', 'basic-nail-art', 'Simple designs and decorations per nail', 15, 5.00, 15.00, 'basic', 'growing', 'low', ARRAY['nail-art', 'design', 'decoration', 'creative']),
  ('nail-art-finish', 'French Polish Finish', 'french-polish-finish', 'Classic French tip application', 10, 5.00, 10.00, 'basic', 'stable', 'medium', ARRAY['french', 'polish', 'finish', 'classic']),
  ('nail-art-finish', 'Custom Design', 'custom-design', 'Personalized nail art and complex designs', NULL, 15.00, 50.00, 'advanced', 'trending', 'low', ARRAY['custom', 'personalized', 'complex', 'artistic']),
  
  -- Hand & Foot Treatments
  ('hand-foot-treatments', 'Paraffin Wax Treatment', 'paraffin-wax-treatment', 'Moisturizing paraffin wax dip for hands or feet', 15, 10.00, 20.00, 'basic', 'stable', 'medium', ARRAY['paraffin', 'wax', 'moisturizing', 'therapy']),
  ('hand-foot-treatments', 'Collagen Hand Mask', 'collagen-hand-mask', 'Anti-aging collagen treatment for hands', 15, 15.00, 30.00, 'standard', 'trending', 'medium', ARRAY['collagen', 'mask', 'anti-aging', 'skincare']),
  ('hand-foot-treatments', 'Exfoliating Scrub', 'exfoliating-scrub', 'Dead skin removal and smoothing treatment', 10, 8.00, 15.00, 'basic', 'stable', 'low', ARRAY['exfoliation', 'scrub', 'smoothing', 'skincare']),
  ('hand-foot-treatments', 'Hot Towel Treatment', 'hot-towel-treatment', 'Relaxing heated towel service', 10, 5.00, 12.00, 'basic', 'stable', 'low', ARRAY['hot-towel', 'relaxation', 'warmth', 'comfort']),
  
  -- Massage
  ('massage', 'Hand Massage', 'hand-massage', 'Relaxing massage for hands and forearms', 15, 10.00, 20.00, 'basic', 'stable', 'medium', ARRAY['massage', 'hands', 'relaxation', 'circulation']),
  ('massage', 'Foot Massage', 'foot-massage', 'Therapeutic massage for feet and lower legs', 15, 12.00, 25.00, 'basic', 'stable', 'medium', ARRAY['massage', 'feet', 'therapeutic', 'relaxation']),
  ('massage', 'Neck & Shoulder Massage', 'neck-shoulder-massage', 'Tension relief massage for neck and shoulders', 15, 15.00, 30.00, 'standard', 'growing', 'medium', ARRAY['massage', 'neck', 'shoulders', 'tension-relief']),
  
  -- Facials
  ('facials', 'Express Facial', 'express-facial', 'Quick cleansing and moisturizing facial', 30, 25.00, 45.00, 'basic', 'growing', 'medium', ARRAY['facial', 'express', 'cleansing', 'quick']),
  ('facials', 'Deep Cleansing Facial', 'deep-cleansing-facial', 'Thorough pore cleansing and extraction facial', 45, 40.00, 70.00, 'standard', 'growing', 'medium', ARRAY['facial', 'deep-cleansing', 'pores', 'extraction']),
  ('facials', 'Hydrating Facial', 'hydrating-facial', 'Moisturizing and nourishing facial treatment', 45, 35.00, 65.00, 'standard', 'growing', 'medium', ARRAY['facial', 'hydrating', 'moisturizing', 'nourishing']),
  
  -- Eyelash Extensions
  ('eyelash-extensions', 'Classic Lash Extensions', 'classic-lash-extensions', 'One extension per natural lash for subtle enhancement', 90, 80.00, 150.00, 'standard', 'growing', 'high', ARRAY['lash-extensions', 'classic', 'subtle', 'natural']),
  ('eyelash-extensions', 'Hybrid Lash Extensions', 'hybrid-lash-extensions', 'Mix of classic and volume techniques', 90, 100.00, 180.00, 'advanced', 'trending', 'high', ARRAY['lash-extensions', 'hybrid', 'volume', 'mixed']),
  ('eyelash-extensions', 'Volume Lash Extensions', 'volume-lash-extensions', 'Multiple lightweight lashes per natural lash', 120, 120.00, 220.00, 'advanced', 'trending', 'high', ARRAY['lash-extensions', 'volume', 'dramatic', 'fullness']),
  ('eyelash-extensions', 'Mega Volume Lash Extensions', 'mega-volume-lash-extensions', 'Ultra-full dramatic lash look', 150, 150.00, 280.00, 'advanced', 'trending', 'medium', ARRAY['lash-extensions', 'mega-volume', 'dramatic', 'ultra-full']),
  ('eyelash-extensions', 'Cluster Lash Extensions', 'cluster-lash-extensions', 'Pre-made lash clusters for fuller look', 45, 50.00, 100.00, 'basic', 'stable', 'medium', ARRAY['lash-extensions', 'clusters', 'pre-made', 'quick']),
  ('eyelash-extensions', 'Lash Refill (2-3 Weeks)', 'lash-refill-2-3-weeks', 'Maintenance refill for existing extensions', 45, 40.00, 80.00, 'basic', 'stable', 'high', ARRAY['lash-refill', 'maintenance', 'touch-up', 'extensions']),
  ('eyelash-extensions', 'Lash Removal', 'lash-removal', 'Safe removal of eyelash extensions', 15, 15.00, 30.00, 'basic', 'stable', 'low', ARRAY['lash-removal', 'safe', 'clean', 'extensions']),
  
  -- Lash Treatments
  ('lash-treatments', 'Eyelash Lift', 'eyelash-lift', 'Curl and lift natural lashes without extensions', 45, 40.00, 80.00, 'standard', 'trending', 'medium', ARRAY['lash-lift', 'curl', 'natural', 'enhancement']),
  ('lash-treatments', 'Eyelash Tint', 'eyelash-tint', 'Darken natural lashes with semi-permanent dye', 15, 15.00, 35.00, 'basic', 'stable', 'medium', ARRAY['lash-tint', 'darken', 'color', 'natural']),
  
  -- Brow Treatments
  ('brow-treatments', 'Eyebrow Shape', 'eyebrow-shape', 'Professional eyebrow shaping and trimming', 15, 10.00, 25.00, 'basic', 'stable', 'high', ARRAY['eyebrow', 'shape', 'trimming', 'professional']),
  ('brow-treatments', 'Eyebrow Tint', 'eyebrow-tint', 'Color enhancement for eyebrows', 15, 15.00, 30.00, 'basic', 'stable', 'medium', ARRAY['eyebrow', 'tint', 'color', 'enhancement']),
  ('brow-treatments', 'Brow Wax & Tint Combo', 'brow-wax-tint-combo', 'Complete eyebrow service with shaping and tinting', 25, 20.00, 40.00, 'standard', 'stable', 'medium', ARRAY['eyebrow', 'wax', 'tint', 'combo']),
  
  -- Waxing Services
  ('waxing', 'Eyebrow Wax', 'eyebrow-wax', 'Hair removal and shaping of eyebrow area', NULL, 8.00, 20.00, 'basic', 'stable', 'high', ARRAY['wax', 'eyebrow', 'hair-removal', 'shaping']),
  ('waxing', 'Lip Wax', 'lip-wax', 'Upper lip hair removal', NULL, 8.00, 18.00, 'basic', 'stable', 'medium', ARRAY['wax', 'lip', 'hair-removal', 'facial']),
  ('waxing', 'Chin Wax', 'chin-wax', 'Chin and jawline hair removal', NULL, 10.00, 22.00, 'basic', 'stable', 'medium', ARRAY['wax', 'chin', 'hair-removal', 'facial']),
  ('waxing', 'Side of Face Wax', 'side-face-wax', 'Sideburn and cheek hair removal', NULL, 12.00, 25.00, 'basic', 'stable', 'low', ARRAY['wax', 'face-sides', 'sideburns', 'hair-removal']),
  ('waxing', 'Underarm Wax', 'underarm-wax', 'Complete underarm hair removal', NULL, 15.00, 30.00, 'basic', 'stable', 'medium', ARRAY['wax', 'underarm', 'hair-removal', 'smooth']),
  ('waxing', 'Half Arm Wax', 'half-arm-wax', 'Forearm or upper arm hair removal', NULL, 20.00, 40.00, 'basic', 'stable', 'low', ARRAY['wax', 'half-arm', 'hair-removal', 'partial']),
  ('waxing', 'Full Arm Wax', 'full-arm-wax', 'Complete arm hair removal', NULL, 35.00, 65.00, 'basic', 'stable', 'low', ARRAY['wax', 'full-arm', 'hair-removal', 'complete']),
  ('waxing', 'Stomach Wax', 'stomach-wax', 'Abdominal area hair removal', NULL, 20.00, 40.00, 'basic', 'stable', 'low', ARRAY['wax', 'stomach', 'abdominal', 'hair-removal']),
  ('waxing', 'Back Wax', 'back-wax', 'Full back hair removal', NULL, 40.00, 80.00, 'basic', 'stable', 'low', ARRAY['wax', 'back', 'hair-removal', 'full']),
  ('waxing', 'Half Leg Wax', 'half-leg-wax', 'Lower or upper leg hair removal', NULL, 30.00, 55.00, 'basic', 'stable', 'medium', ARRAY['wax', 'half-leg', 'hair-removal', 'partial']),
  ('waxing', 'Full Leg Wax', 'full-leg-wax', 'Complete leg hair removal', NULL, 50.00, 90.00, 'basic', 'stable', 'medium', ARRAY['wax', 'full-leg', 'hair-removal', 'complete']),
  ('waxing', 'Bikini Wax', 'bikini-wax', 'Basic bikini line hair removal', NULL, 25.00, 50.00, 'basic', 'stable', 'medium', ARRAY['wax', 'bikini', 'hair-removal', 'intimate']),
  ('waxing', 'Extended Bikini Wax', 'extended-bikini-wax', 'More comprehensive bikini area waxing', NULL, 35.00, 65.00, 'standard', 'stable', 'medium', ARRAY['wax', 'extended-bikini', 'comprehensive', 'intimate']),
  ('waxing', 'Brazilian Wax', 'brazilian-wax', 'Complete intimate area hair removal', NULL, 45.00, 85.00, 'standard', 'stable', 'medium', ARRAY['wax', 'brazilian', 'complete', 'intimate']),
  
  -- Add-Ons & Extras
  ('add-ons-extras', 'Hand Mask Upgrade', 'hand-mask-upgrade', 'Add moisturizing hand mask to any service', NULL, 5.00, 15.00, 'basic', 'stable', 'low', ARRAY['add-on', 'hand-mask', 'upgrade', 'moisturizing']),
  ('add-ons-extras', 'Foot Mask Upgrade', 'foot-mask-upgrade', 'Add moisturizing foot mask to any service', NULL, 8.00, 18.00, 'basic', 'stable', 'low', ARRAY['add-on', 'foot-mask', 'upgrade', 'moisturizing']),
  ('add-ons-extras', 'Polish Change', 'polish-change', 'Simple polish color change', NULL, 8.00, 15.00, 'basic', 'stable', 'medium', ARRAY['add-on', 'polish-change', 'color', 'quick']),
  ('add-ons-extras', 'Buff & Shine', 'buff-shine', 'Natural nail buffing and shine treatment', NULL, 5.00, 12.00, 'basic', 'stable', 'low', ARRAY['add-on', 'buff', 'shine', 'natural']),
  ('add-ons-extras', 'French Tip Add-On', 'french-tip-add-on', 'Add French tip design to any manicure', NULL, 5.00, 15.00, 'basic', 'stable', 'medium', ARRAY['add-on', 'french-tip', 'design', 'classic']),
  ('add-ons-extras', 'Nail Art Add-On', 'nail-art-add-on', 'Add decorative nail art to any service', NULL, 10.00, 25.00, 'basic', 'growing', 'low', ARRAY['add-on', 'nail-art', 'decoration', 'creative']),
  
  -- Hair Services
  ('hair-services', 'Hair Cut', 'hair-cut', 'Professional hair cutting and styling', NULL, 25.00, 75.00, 'basic', 'stable', 'high', ARRAY['hair-cut', 'styling', 'professional', 'trim'])
) AS st(category_slug, name, slug, description, duration_minutes, price_range_low, price_range_high, specialization_level, trend_status, filtering_priority, keywords)
WHERE sc.slug = st.category_slug;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_types_category_id ON service_types(category_id);
CREATE INDEX IF NOT EXISTS idx_service_types_slug ON service_types(slug);
CREATE INDEX IF NOT EXISTS idx_service_types_trend_status ON service_types(trend_status);
CREATE INDEX IF NOT EXISTS idx_service_types_specialization_level ON service_types(specialization_level);
CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON service_categories(slug);
CREATE INDEX IF NOT EXISTS idx_service_categories_parent_id ON service_categories(parent_id);

-- Update service categories with counts (optional)
UPDATE service_categories 
SET description = CONCAT(description, ' (', (
  SELECT COUNT(*) 
  FROM service_types 
  WHERE service_types.category_id = service_categories.id
), ' services)')
WHERE id IN (SELECT DISTINCT category_id FROM service_types);

COMMIT;