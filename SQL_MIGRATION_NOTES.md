# SQL Migration Notes for Supabase

## Overview
This document outlines the SQL commands needed to drop unused filter columns from the `salons` table in Supabase.

## Columns to Drop
The following columns are no longer used in the UI and can be safely dropped:

1. `adult_only` - Adult Only amenity (removed from UI)
2. `injectables` - Injectables service (removed from UI)
3. `tanning` - Tanning service (removed from UI)
4. `cosmetic_tattoo` - Cosmetic Tattoo service (removed from UI)

## SQL Commands

```sql
-- Drop unused amenity column
ALTER TABLE public.salons 
DROP COLUMN IF EXISTS adult_only;

-- Drop unused service columns
ALTER TABLE public.salons 
DROP COLUMN IF EXISTS injectables,
DROP COLUMN IF EXISTS tanning,
DROP COLUMN IF EXISTS cosmetic_tattoo;
```

## Alternative: Single Command
If you prefer to drop all columns in one statement:

```sql
ALTER TABLE public.salons 
DROP COLUMN IF EXISTS adult_only,
DROP COLUMN IF EXISTS injectables,
DROP COLUMN IF EXISTS tanning,
DROP COLUMN IF EXISTS cosmetic_tattoo;
```

## Backup Recommendation
Before executing these commands, it's recommended to:
1. Create a backup of the `salons` table
2. Verify no other code references these columns
3. Test in a development environment first

## Verification Query
After running the migration, verify the columns are dropped:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'salons' 
AND column_name IN ('adult_only', 'injectables', 'tanning', 'cosmetic_tattoo');
```

This query should return 0 rows if the migration was successful.

## Date Created
2025-11-07

## Status
⚠️ PENDING - These SQL commands need to be executed in Supabase by the user

## Notes
- These columns were removed from the UI based on user request
- The filter names have been updated throughout the codebase:
  - "Acrylic Nails" → "Shellac / Acrylic Nails"
  - "SNS Dip Powder" → "SNS / Dip Powder"
  - "Builders Gel / BIAB" → "BIAB / Builders Gel"
- All API routes and UI components have been updated to reflect these changes
