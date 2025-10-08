# Service Catalog Setup Guide for NailNav

## Current Status
Your NailNav database needs the service catalog tables to be created. Since we can't run raw SQL migrations through the Supabase client directly, you'll need to run them through the Supabase Dashboard.

## Step 1: Create Database Tables

1. **Go to Supabase Dashboard**: https://app.supabase.com/project/bmlvjgulciphdqyqucxv/sql
2. **Copy and paste the SQL below** into the SQL editor
3. **Run the query** to create the service catalog tables

### SQL to Run in Supabase Dashboard:

```sql
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

-- Salon Services (Junction Table) - if salons table exists
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

-- Allow authenticated users to manage their salon services
CREATE POLICY "Allow salon owners to manage their services" ON salon_services
  FOR ALL USING (salon_id IN (
    SELECT id FROM salons WHERE owner_id = auth.uid()
  ));
```

## Step 2: Populate Service Data

After creating the tables, run this command in your terminal:

```bash
cd /home/user/webapp
node populate-services-simple.js
```

## Step 3: Verify Setup

You can verify the setup worked by checking the tables in your Supabase dashboard:

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the new tables:
   - `service_categories` (18 categories)
   - `service_types` (70+ service types)
   - `salon_services` (junction table for salon-specific services)

## Service Categories Included

Your service catalog will include these categories:

1. **Manicure** - Classic, Deluxe, Gel, French, Collagen, Builder Gel
2. **Pedicure** - Classic, Deluxe, Spa, Hot Stone, Salon Special
3. **Acrylic Nails** - Full Set, Fill, French variations
4. **Gel Extensions** - Full Set, Fill, French variations  
5. **Dip Powder Nails** - Full Set, Fill, French, Ombre
6. **Builder Gel** - Overlay, Fill
7. **Gel X** - Full Set, Fill
8. **Nail Maintenance** - Repair, Removal
9. **Nail Art & Finish** - Basic Art, French Polish, Custom Design
10. **Hand & Foot Treatments** - Paraffin, Collagen, Scrub, Hot Towel
11. **Massage** - Hand, Foot, Neck & Shoulder
12. **Facials** - Express, Deep Cleansing, Hydrating
13. **Eyelash Extensions** - Classic, Hybrid, Volume, Mega Volume, Cluster, Refill, Removal
14. **Lash Treatments** - Eyelash Lift, Tint
15. **Brow Treatments** - Shape, Tint, Wax & Tint Combo
16. **Waxing** - Full body waxing services from eyebrows to Brazilian
17. **Add-Ons & Extras** - Upgrades and additional services
18. **Hair Services** - Hair cutting and styling

## Next Steps

Once the service catalog is set up:

1. **Salon Registration**: Salons can select which services they offer
2. **Custom Pricing**: Each salon can set their own prices within the suggested ranges
3. **Service Filtering**: Users can filter salons by service type, price, duration
4. **Booking Integration**: Services can be integrated with booking systems
5. **Analytics**: Track popular services and trends

## Troubleshooting

If you encounter any issues:

1. **Permission Errors**: Make sure you're logged in as the project owner in Supabase
2. **Table Already Exists**: If tables exist but are empty, skip to Step 2
3. **RLS Policies**: The policies allow public read access and authenticated write access
4. **Foreign Key Errors**: The salon_services table won't have FK constraints until the salons table exists

## Data Structure

Each service includes:
- **Basic Info**: Name, description, category
- **Pricing**: Low and high price ranges
- **Duration**: Typical service duration in minutes
- **Classification**: Specialization level (basic/standard/advanced)
- **Trends**: Current trend status (stable/growing/trending)
- **Filtering**: Priority for search and filter features
- **Keywords**: For search functionality

This comprehensive service catalog will make your NailNav platform much more useful for both salon owners and customers!