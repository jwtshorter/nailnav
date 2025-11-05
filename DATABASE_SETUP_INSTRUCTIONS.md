# Database Setup Instructions for FAQ & Filter Updates

## Overview
This document provides step-by-step instructions to add the new columns to your Supabase database for the FAQ sections and updated filters.

## Method 1: Using Supabase SQL Editor (Recommended)

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New query"**

### Step 2: Copy and Execute SQL Script
Copy the entire SQL script below and paste it into the SQL editor, then click **"Run"**:

```sql
-- Add new FAQ columns
ALTER TABLE salons ADD COLUMN IF NOT EXISTS review_summary TEXT;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS about TEXT;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS customers_saying TEXT;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS health_wellbeing_care TEXT;

-- Add/rename service columns that may be missing or have wrong names
ALTER TABLE salons ADD COLUMN IF NOT EXISTS gel_extensions BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS sns_dip_powder BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS builders_gel_biab BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS lash_extensions BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS lash_lift_tint BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS brows BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS injectables BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS tanning BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS cosmetic_tattoo BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS haircuts BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS spa_hand_foot_treatment BOOLEAN DEFAULT FALSE;

-- Add language columns
ALTER TABLE salons ADD COLUMN IF NOT EXISTS english BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS spanish BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS vietnamese BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS chinese BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS korean BOOLEAN DEFAULT FALSE;

-- Add specialty columns (renamed from old ones)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS qualified_technicians BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS experienced_team BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS award_winning_staff BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS master_nail_artist BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS bridal_nails BOOLEAN DEFAULT FALSE;

-- Add appointment type columns
ALTER TABLE salons ADD COLUMN IF NOT EXISTS appointment_required BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS walk_ins_welcome BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS group_bookings BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS mobile_nails BOOLEAN DEFAULT FALSE;

-- Add amenity/space columns (some renamed)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS child_friendly BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS adult_only BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS pet_friendly BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS lgbtqi_friendly BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS autoclave_sterilisation BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS led_curing BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS clean_ethical_products BOOLEAN DEFAULT FALSE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS vegan_polish BOOLEAN DEFAULT FALSE;
```

### Step 3: Verify Columns Were Added
After running the script, verify the columns were added:

1. Go to **"Table Editor"** in the left sidebar
2. Click on the **"salons"** table
3. Scroll right to see the new columns

You should see:
- **4 TEXT columns:** `review_summary`, `about`, `customers_saying`, `health_wellbeing_care`
- **40+ BOOLEAN columns:** All the service, language, specialty, appointment, and amenity columns

## Method 2: Using Supabase Table Editor (Manual - Not Recommended)

If you prefer to add columns manually:

1. Go to **Table Editor** → **salons** table
2. Click **"+ New Column"** button
3. Add each column one by one with the correct type and default value

**This is tedious for 44 columns, so Method 1 is strongly recommended!**

## After Adding Columns

### Run Data Import Script

Once the columns are added, import the data from the Excel file:

```bash
cd /home/user/webapp
source .env.local
python3 import_updated_simple.py
```

Expected output:
```
================================================================================
IMPORTING UPDATED SALON DATA (Services, Languages, Specialties, Amenities)
================================================================================

Loading Excel file: Nail_Salons_Aus_250_updated.xlsx
  ✓ Found 102 columns
  ✓ Total rows: 1000

Importing salon data...
  ✓ Processed 50 salons...
  ✓ Processed 100 salons...
  ✓ Processed 150 salons...
  ✓ Processed 200 salons...

  ✓ Import complete!
    - Updated: 249 salons
    - Skipped: 1 salons
    - Errors: 0 salons

================================================================================
✓ IMPORT COMPLETED
================================================================================
```

## Column Summary

### FAQ Columns (4 TEXT columns)
- `review_summary` - Summary of customer reviews
- `about` - About the salon description
- `customers_saying` - What customers are saying
- `health_wellbeing_care` - Health and wellbeing practices

### Service Columns (11 BOOLEAN columns)
- `gel_extensions`, `sns_dip_powder`, `builders_gel_biab`
- `lash_extensions`, `lash_lift_tint`, `brows`
- `injectables`, `tanning`, `cosmetic_tattoo`
- `haircuts`, `spa_hand_foot_treatment`

### Language Columns (5 BOOLEAN columns)
- `english`, `spanish`, `vietnamese`, `chinese`, `korean`

### Specialty Columns (5 BOOLEAN columns)
- `qualified_technicians`, `experienced_team`
- `award_winning_staff`, `master_nail_artist`, `bridal_nails`

### Appointment Type Columns (4 BOOLEAN columns)
- `appointment_required`, `walk_ins_welcome`
- `group_bookings`, `mobile_nails`

### Amenity Columns (8 BOOLEAN columns)
- `child_friendly`, `adult_only`, `pet_friendly`, `lgbtqi_friendly`
- `autoclave_sterilisation`, `led_curing`
- `clean_ethical_products`, `vegan_polish`

**Total: 44 new columns**

## Troubleshooting

### Issue: "Column already exists" errors
**Solution:** The script uses `IF NOT EXISTS`, so this is safe. The column won't be re-added.

### Issue: Import script shows column not found errors
**Solution:** 
1. Refresh the Supabase schema cache (wait 5 minutes or restart Supabase connection)
2. Or manually verify columns exist in Table Editor

### Issue: Import script shows 0 salons updated
**Solution:**
1. Check that salon names in Excel match database exactly
2. Verify the Excel file path is correct
3. Check environment variables are loaded correctly

## Need Help?

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify all environment variables are set correctly in `.env.local`
3. Ensure you have the correct permissions (SERVICE_ROLE_KEY)

## Files in This Update

- `add_new_columns.sql` - SQL migration script (THIS FILE)
- `import_updated_simple.py` - Python import script
- `Nail_Salons_Aus_250_updated.xlsx` - Updated Excel data file
- `DATABASE_SETUP_INSTRUCTIONS.md` - This instructions file
