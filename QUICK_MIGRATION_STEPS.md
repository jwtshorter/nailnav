# Quick Migration Steps

Follow these steps to complete the database migrations in Supabase.

## Step 1: Backup Database
1. Go to Supabase Dashboard
2. Navigate to Database → Backups
3. Click "Create backup"
4. Wait for confirmation

## Step 2: Open SQL Editor
1. In Supabase Dashboard, go to SQL Editor
2. Click "New query"

## Step 3: Run Migrations (In Order)

### Migration 1: Remove Unused Filter Columns
**File**: `remove_unused_filter_columns.sql`

```sql
-- Copy and paste contents of remove_unused_filter_columns.sql
-- This removes: adult_only, injectables, tanning, cosmetic_tattoo columns
```

Click "Run" and wait for "Success" message.

**Verify**:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'salons' 
AND column_name IN ('adult_only', 'injectables', 'tanning', 'cosmetic_tattoo');
-- Should return 0 rows
```

---

### Migration 2: Insert Australian Cities
**File**: `insert_australian_cities_v4.sql`

```sql
-- Copy and paste contents of insert_australian_cities_v4.sql
-- This adds 8 states and 51 cities
```

Click "Run" and wait for "Success" message.

**Verify**:
```sql
-- Check states (should return 8 rows)
SELECT code, name FROM states 
WHERE code IN ('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA')
ORDER BY code;

-- Check cities (should return 51+ rows)
SELECT COUNT(*) FROM cities c
JOIN states s ON c.state_id = s.id
WHERE s.code IN ('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA');
```

---

### Migration 3: Cleanup Suburbs
**File**: `cleanup_australian_suburbs.sql`

⚠️ **IMPORTANT**: This migration updates salons and deletes cities!

```sql
-- Copy and paste contents of cleanup_australian_suburbs.sql
-- This merges 19 suburbs into their parent cities
```

Click "Run" and wait for "Success" message.

**Verify**:
```sql
-- Check suburbs are gone (should return 0 rows)
SELECT * FROM cities 
WHERE id IN (31, 3, 6, 5, 4, 14, 13, 23, 25, 24, 27, 11, 10, 9, 8, 20, 60, 19, 21);

-- Check parent cities have salons (should show counts)
SELECT c.name, c.id, COUNT(s.id) as salon_count
FROM cities c
LEFT JOIN salons s ON c.id = s.city_id
WHERE c.id IN (30, 2, 12, 36, 22, 26, 7, 17)
GROUP BY c.id, c.name
ORDER BY c.name;
```

---

## Step 4: Test the Application

### Test City Pages
1. **Sydney**: https://your-domain.com/nail-salons/nsw/sydney
2. **Melbourne**: https://your-domain.com/nail-salons/vic/melbourne
3. **Brisbane**: https://your-domain.com/nail-salons/qld/brisbane
4. **Perth**: https://your-domain.com/nail-salons/wa/perth

### Test Badge Generator
1. Go to: https://your-domain.com/badge-generator
2. Search for "Sydney" - should show Sydney, NSW
3. Search for "Melbourne" - should show Melbourne, VIC

### Test Homepage
1. Go to homepage
2. Scroll to "Explore Popular Cities"
3. Check "Popular Australian Cities" section
4. Click on a few cities - should navigate correctly

---

## Expected Results Summary

✅ **Filters Updated**:
- "Acrylic Nails" → "Shellac / Acrylic Nails"
- "SNS Dip Powder" → "SNS / Dip Powder"
- "Builders Gel / BIAB" → "BIAB / Builders Gel"
- Removed: Adult Only, Injectables, Tanning, Cosmetic Tattoo

✅ **Cities Organized**:
- 19 suburbs merged into parent cities
- Clean city structure for Australian locations
- Homepage shows separate US/Australian sections

✅ **Badge Generator**:
- Accessible via footer "Claim 1 Month Free" link
- Supports Australian cities
- SEO-optimized landing page

✅ **City Pages**:
- Dynamic routes work: `/nail-salons/[state]/[city]`
- Shows salons for each city
- Related cities navigation
- Breadcrumb navigation

---

## Rollback Plan

If something goes wrong:

1. **Restore from backup** (Step 1)
2. Check Supabase logs for error details
3. Identify which migration failed
4. Fix the issue and re-run from that point

---

## After Migration Complete

Update `existing_cities.csv` with new city structure:

```bash
cd /home/user/webapp && supabase db dump --data-only cities > new_cities_export.sql
```

---

## Need Help?

- Check `SQL_MIGRATION_GUIDE.md` for detailed information
- Review `cleanup_australian_suburbs.sql` for specific suburb mappings
- Check Supabase logs if queries fail

---

## Migration Status Checklist

- [ ] Database backed up
- [ ] Migration 1: Filter columns removed
- [ ] Migration 2: Australian cities inserted
- [ ] Migration 3: Suburbs cleaned up
- [ ] Sydney city page tested
- [ ] Melbourne city page tested
- [ ] Badge generator tested
- [ ] Homepage cities section tested
- [ ] Footer "Claim 1 Month Free" link verified

---

**Estimated Total Time**: 15-20 minutes

**Risk Level**: Medium (Migration 3 modifies existing salon data)

**Recommended Time**: Run during low-traffic period
