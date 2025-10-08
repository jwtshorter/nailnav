-- Service Catalog Tables for NailNav
-- Copy and paste this entire SQL block into your Supabase Dashboard SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Service Categories (Hierarchical)
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  parent_id UUID REFERENCES service_categories(id),
  description TEXT,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Service Types
CREATE TABLE IF NOT EXISTS service_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES service_categories(id),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  price_range_low DECIMAL(10,2),
  price_range_high DECIMAL(10,2),
  specialization_level VARCHAR(20), -- 'basic', 'standard', 'advanced'
  trend_status VARCHAR(20), -- 'stable', 'growing', 'trending', 'declining'
  filtering_priority VARCHAR(20), -- 'high', 'medium', 'low'
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Salon Services (Junction Table)
CREATE TABLE IF NOT EXISTS salon_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID, -- Will reference salons(id) when that table exists
  service_type_id UUID REFERENCES service_types(id),
  
  -- Custom Pricing & Details
  price DECIMAL(10,2),
  duration_minutes INTEGER,
  description TEXT,
  is_available BOOLEAN DEFAULT true,
  requires_appointment BOOLEAN DEFAULT true,
  
  -- Tier-specific features
  online_booking_enabled BOOLEAN DEFAULT false,
  real_time_availability BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_types_category_id ON service_types(category_id);
CREATE INDEX IF NOT EXISTS idx_service_types_slug ON service_types(slug);
CREATE INDEX IF NOT EXISTS idx_service_types_trend_status ON service_types(trend_status);
CREATE INDEX IF NOT EXISTS idx_service_types_specialization_level ON service_types(specialization_level);
CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON service_categories(slug);
CREATE INDEX IF NOT EXISTS idx_service_categories_parent_id ON service_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_salon_services_salon_id ON salon_services(salon_id);
CREATE INDEX IF NOT EXISTS idx_salon_services_service_type_id ON salon_services(service_type_id);

-- Enable Row Level Security
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_services ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to service categories" ON service_categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to service types" ON service_types
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to salon services" ON salon_services
  FOR SELECT USING (true);

-- Allow authenticated users to manage their salon services (when salons table exists)
-- CREATE POLICY "Allow salon owners to manage their services" ON salon_services
--   FOR ALL USING (salon_id IN (
--     SELECT id FROM salons WHERE owner_id = auth.uid()
--   ));