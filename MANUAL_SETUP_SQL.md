# 🔧 **Manual Database Setup (Copy & Paste)**

Since we're having issues with the service role key, let's set up the database manually! This is actually faster and you'll see exactly what's happening.

---

## 🎯 **Step 1: Open Supabase SQL Editor**

1. Go to: https://supabase.com/dashboard/project/bmlvjgulciphdqyqucxv
2. Click **"SQL Editor"** in the left sidebar
3. You'll see a big text area where you can run SQL

---

## 📋 **Step 2: Copy & Paste Each SQL Block**

Copy each block below, paste it in the SQL Editor, and click **"RUN"**. I'll show you what each one does!

---

### **Block 1: Create Countries Table** 🌍

```sql
-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(2) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Australia
INSERT INTO countries (name, code) VALUES ('Australia', 'AU') 
ON CONFLICT (code) DO NOTHING;
```

**What this does**: Creates a table for countries and adds Australia

---

### **Block 2: Create States Table** 🗺️

```sql
-- Create states table  
CREATE TABLE IF NOT EXISTS states (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) NOT NULL,
  country_id INTEGER REFERENCES countries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, country_id)
);

-- Insert Australian states
INSERT INTO states (name, code, country_id) 
SELECT 'New South Wales', 'NSW', id FROM countries WHERE code = 'AU' 
ON CONFLICT (name, country_id) DO NOTHING;

INSERT INTO states (name, code, country_id) 
SELECT 'Victoria', 'VIC', id FROM countries WHERE code = 'AU' 
ON CONFLICT (name, country_id) DO NOTHING;

INSERT INTO states (name, code, country_id) 
SELECT 'Queensland', 'QLD', id FROM countries WHERE code = 'AU' 
ON CONFLICT (name, country_id) DO NOTHING;

INSERT INTO states (name, code, country_id) 
SELECT 'Western Australia', 'WA', id FROM countries WHERE code = 'AU' 
ON CONFLICT (name, country_id) DO NOTHING;

INSERT INTO states (name, code, country_id) 
SELECT 'South Australia', 'SA', id FROM countries WHERE code = 'AU' 
ON CONFLICT (name, country_id) DO NOTHING;

INSERT INTO states (name, code, country_id) 
SELECT 'Tasmania', 'TAS', id FROM countries WHERE code = 'AU' 
ON CONFLICT (name, country_id) DO NOTHING;

INSERT INTO states (name, code, country_id) 
SELECT 'Northern Territory', 'NT', id FROM countries WHERE code = 'AU' 
ON CONFLICT (name, country_id) DO NOTHING;

INSERT INTO states (name, code, country_id) 
SELECT 'Australian Capital Territory', 'ACT', id FROM countries WHERE code = 'AU' 
ON CONFLICT (name, country_id) DO NOTHING;
```

**What this does**: Creates states table and adds all Australian states

---

### **Block 3: Create Cities Table** 🏙️

```sql
-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state_id INTEGER REFERENCES states(id),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  salon_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, state_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cities_state_id ON cities(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
```

**What this does**: Creates cities table where salons will be located

---

### **Block 4: Create/Update Salons Table** 💅

```sql
-- Create or update salons table with all filter columns
CREATE TABLE IF NOT EXISTS salons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city_id INTEGER REFERENCES cities(id),
  phone VARCHAR(20),
  website VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add all the filter columns (these might already exist, so we use ALTER TABLE IF NOT EXISTS pattern)
DO $$ 
BEGIN
  -- Add filter columns one by one
  BEGIN
    ALTER TABLE salons ADD COLUMN kid_friendly BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN parking BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN wheelchair_accessible BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN accepts_walk_ins BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN appointment_only BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN credit_cards_accepted BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN cash_only BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN gift_cards_available BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN loyalty_program BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN online_booking BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;

END $$;
```

**What this does**: Creates the main salons table and adds filter columns

---

### **Block 5: Add More Filter Columns** ✨

```sql
-- Add more filter columns
DO $$ 
BEGIN
  -- Beauty services
  BEGIN
    ALTER TABLE salons ADD COLUMN manicure BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN pedicure BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN gel_nails BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN acrylic_nails BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN nail_art BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN dip_powder BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN shellac BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN nail_extensions BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN nail_repair BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN cuticle_care BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;

END $$;
```

**What this does**: Adds nail service filter options

---

### **Block 6: Add Staff & Atmosphere Filters** 👥

```sql
-- Add staff and atmosphere filters
DO $$ 
BEGIN
  -- Staff qualifications
  BEGIN
    ALTER TABLE salons ADD COLUMN master_artist BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN certified_technicians BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN experienced_staff BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  -- Atmosphere
  BEGIN
    ALTER TABLE salons ADD COLUMN luxury_experience BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN relaxing_atmosphere BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN modern_facilities BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN clean_hygienic BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN friendly_service BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN quick_service BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE salons ADD COLUMN premium_products BOOLEAN DEFAULT FALSE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;

END $$;
```

**What this does**: Adds staff quality and atmosphere filters

---

### **Block 7: Create Indexes for Performance** ⚡

```sql
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_salons_city_id ON salons(city_id);
CREATE INDEX IF NOT EXISTS idx_salons_name ON salons(name);
CREATE INDEX IF NOT EXISTS idx_salons_location ON salons(latitude, longitude);

-- Create indexes for popular filters
CREATE INDEX IF NOT EXISTS idx_salons_kid_friendly ON salons(kid_friendly) WHERE kid_friendly = true;
CREATE INDEX IF NOT EXISTS idx_salons_parking ON salons(parking) WHERE parking = true;
CREATE INDEX IF NOT EXISTS idx_salons_wheelchair ON salons(wheelchair_accessible) WHERE wheelchair_accessible = true;
CREATE INDEX IF NOT EXISTS idx_salons_walk_ins ON salons(accepts_walk_ins) WHERE accepts_walk_ins = true;
CREATE INDEX IF NOT EXISTS idx_salons_online_booking ON salons(online_booking) WHERE online_booking = true;
```

**What this does**: Makes searches super fast

---

## ✅ **Step 3: Verify Everything Worked**

After running all the blocks above, run this to check:

```sql
-- Check if everything was created properly
SELECT 
  'countries' as table_name, 
  COUNT(*) as row_count 
FROM countries
UNION ALL
SELECT 
  'states' as table_name, 
  COUNT(*) as row_count 
FROM states  
UNION ALL
SELECT 
  'cities' as table_name, 
  COUNT(*) as row_count 
FROM cities
UNION ALL  
SELECT 
  'salons' as table_name, 
  COUNT(*) as row_count 
FROM salons;
```

**Expected result**:
- countries: 1 (Australia)
- states: 8 (Australian states)  
- cities: 0 (we'll add these when importing salons)
- salons: 0 (we'll import 249 salons next)

---

## 🎉 **Step 4: Tell Me When You're Done!**

Once you've run all the SQL blocks above, reply with:

**"Database setup complete!"**

And I'll immediately start importing the 249 Australian salons! The import will take about 2-3 minutes and you'll see:

- ✅ 249 salons imported
- ✅ Cities created automatically  
- ✅ All filters populated
- ✅ Salon counts updated
- ✅ Live website with real data!

---

## 💡 **Tips**

- **Copy one block at a time** - don't try to copy everything at once
- **Click "RUN" after each block** - you'll see "Success" or error messages
- **If you get "already exists" errors** - that's totally fine, just continue!
- **If you get stuck** - take a screenshot and I'll help immediately

Ready? **Start with Block 1!** 🚀