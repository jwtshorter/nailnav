# SQL Migration Guide

This document outlines all SQL migrations that need to be run in Supabase to complete the recent updates.

## Migration Order

Run these migrations in the following order:

### 1. Remove Unused Filter Columns (Optional - Cleanup)
**File**: `remove_unused_filter_columns.sql`
**Purpose**: Drop 4 unused filter columns from salons table
**Impact**: Low - These columns are no longer used in the UI
**Rollback**: Cannot rollback - columns will be permanently deleted

```bash
# Run in Supabase SQL Editor
```

**What it does**:
- Drops: `adult_only`, `injectables`, `tanning`, `cosmetic_tattoo` columns
- These filters were removed from the UI in previous updates

---

### 2. Insert Australian Cities (CRITICAL)
**File**: `insert_australian_cities_v4.sql`
**Purpose**: Add all Australian states and cities to the database
**Impact**: High - Required for Australian city pages to work
**Rollback**: Can delete cities and states by state code if needed

```bash
# Run in Supabase SQL Editor
```

**What it does**:
- Inserts 8 Australian states (NSW, VIC, QLD, etc.)
- Inserts 51 Australian cities across all states
- Uses WHERE NOT EXISTS to prevent duplicates
- Safe to run multiple times

**States added**:
- ACT (Australian Capital Territory)
- NSW (New South Wales)
- NT (Northern Territory)
- QLD (Queensland)
- SA (South Australia)
- TAS (Tasmania)
- VIC (Victoria)
- WA (Western Australia)

---

### 3. Cleanup Australian Suburbs (CRITICAL)
**File**: `cleanup_australian_suburbs.sql`
**Purpose**: Merge suburbs into their parent cities
**Impact**: High - Fixes data quality issues with suburbs listed as cities
**Rollback**: Complex - would need to restore backed up data

```bash
# IMPORTANT: Backup first!
# Run in Supabase SQL Editor
```

**What it does**:
- Updates all salons that reference suburb city_ids to use parent city_id
- Deletes suburb records from cities table
- Uses transaction (BEGIN/COMMIT) for safety

**Suburbs being merged**:

| Suburb | Parent City | State |
|--------|-------------|-------|
| Civic | Canberra | ACT |
| Bondi, Chatswood, Manly, Parramatta | Sydney | NSW |
| Fortitude Valley | Brisbane | QLD |
| Surfers Paradise | Gold Coast | QLD |
| Glenelg, Hindmarsh, Norwood | Adelaide | SA |
| Sandy Bay | Hobart | TAS |
| Fitzroy, Prahran, Richmond, St Kilda | Melbourne | VIC |
| Joondalup, Mandurah, Scarborough, Subiaco | Perth | WA |

---

## Pre-Migration Checklist

Before running any migrations:

1. **Backup your database**
   - Go to Supabase Dashboard → Database → Backups
   - Create a manual backup point

2. **Test in development first** (if you have a dev environment)

3. **Run during low-traffic period**

4. **Have rollback plan ready**

---

## Verification Steps

After running all migrations:

### 1. Verify Filter Columns Removed
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'salons' 
AND column_name IN ('adult_only', 'injectables', 'tanning', 'cosmetic_tattoo');
-- Should return 0 rows
```

### 2. Verify Australian States Exist
```sql
SELECT code, name 
FROM states 
WHERE code IN ('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA')
ORDER BY code;
-- Should return 8 rows
```

### 3. Verify Cities Inserted
```sql
SELECT COUNT(*) as city_count
FROM cities c
JOIN states s ON c.state_id = s.id
WHERE s.code IN ('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA');
-- Should return 51 cities (or more if additional cities were already present)
```

### 4. Verify Suburbs Removed
```sql
SELECT * FROM cities 
WHERE id IN (31, 3, 6, 5, 4, 14, 13, 23, 25, 24, 27, 11, 10, 9, 8, 20, 60, 19, 21);
-- Should return 0 rows
```

### 5. Verify Salons Updated
```sql
-- Check Sydney salons (should include former Bondi, Chatswood, Manly, Parramatta salons)
SELECT COUNT(*) FROM salons WHERE city_id = 2;

-- Check Melbourne salons (should include former Fitzroy, Prahran, Richmond, St Kilda salons)
SELECT COUNT(*) FROM salons WHERE city_id = 7;

-- Check Perth salons (should include former Joondalup, Mandurah, Scarborough, Subiaco salons)
SELECT COUNT(*) FROM salons WHERE city_id = 17;
```

---

## Expected Results

After successful migration:

1. ✅ 4 unused filter columns removed from salons table
2. ✅ 8 Australian states added to states table
3. ✅ 51 Australian cities added to cities table
4. ✅ 19 suburb records removed from cities table
5. ✅ All salons previously assigned to suburbs now assigned to parent cities
6. ✅ Australian city pages work correctly (e.g., `/nail-salons/nsw/sydney`)

---

## Troubleshooting

### If migration fails:

1. **Check error message** - Note the exact error
2. **Restore from backup** if needed
3. **Check for locks** - Ensure no other processes are using the tables
4. **Run migrations one at a time** - Don't run all in one script

### Common issues:

- **Foreign key violations**: Check if salons reference cities that don't exist
- **Duplicate key errors**: Cities/states already exist (safe to ignore if using WHERE NOT EXISTS pattern)
- **Permission errors**: Ensure you have appropriate database permissions

---

## Post-Migration Testing

After migrations complete, test these pages:

1. **Homepage** - Check "Popular Australian Cities" section
2. **City Pages** - Test a few: `/nail-salons/nsw/sydney`, `/nail-salons/vic/melbourne`
3. **Badge Generator** - Ensure Australian cities appear in search
4. **Search** - Try searching for salons in merged suburbs (should show under parent city)

---

## Files Reference

- `remove_unused_filter_columns.sql` - Filter cleanup
- `insert_australian_cities_v4.sql` - Australian states and cities
- `cleanup_australian_suburbs.sql` - Suburb merging
- `existing_cities.csv` - Current database snapshot (before cleanup)
- This file: `SQL_MIGRATION_GUIDE.md` - You are here!
