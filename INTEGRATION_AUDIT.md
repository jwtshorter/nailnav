# 🔍 NailNav Website-Database Integration Audit

**Date**: November 2, 2025  
**Database**: Supabase Project `bmlvjgulciphdqyqucxv`  
**Real Data Status**: ✅ 248 Australian salons imported

---

## 📊 CURRENT STATUS OVERVIEW

### ✅ What's Working
1. **Database Connection** - Supabase client configured correctly
2. **Real Data Import** - 248 real salons in database
3. **Authentication** - Vendor/admin login system functional
4. **API Routes** - Basic endpoints exist

### ❌ Critical Issues (NOT Working)

#### 1. **Schema Mismatch** - CRITICAL
The frontend code expects different database schema than what actually exists.

**Expected by Frontend Code:**
```typescript
- vendor_tiers (table) - DOES NOT EXIST
- service_categories (table) - DOES NOT EXIST  
- service_types (table) - DOES NOT EXIST
- salon_services (table) - DOES NOT EXIST
- reviews (table) - DOES NOT EXIST
- users (table) - DOES NOT EXIST
```

**Actually Exists:**
```sql
✅ salons (248 rows)
✅ vendor_applications (2 rows)
✅ cities (42 rows)
```

**Salon Schema Mismatch:**
```typescript
// Frontend expects:
- owner_id (UUID)
- tier_id (UUID) 
- specialties (string[])
- services_offered (string[])
- languages_spoken (string[])
- price_range (string: 'budget'|'mid-range'|'premium')
- country (string)
- state (string)
- city (string)
- postal_code (string)

// Database has:
- id (integer, not UUID!)
- city_id (integer foreign key)
- [Boolean service flags instead of array]
- [No specialties or languages_spoken arrays]
- [No country, state as separate columns]
```

#### 2. **Mock Data Everywhere** - CRITICAL
All pages are using hardcoded mock data instead of Supabase:

**Homepage** (`src/app/page.tsx`):
- Lines 62-80: `loadFeaturedSalons()` returns mock data
- Lines 83-102: `loadPopularSalons()` returns mock data
- Lines 105-132: `handleSearch()` uses setTimeout with mock results

**Search Page** (`src/app/search/page.tsx`):
- Lines 88-120: Entire mockSalons array hardcoded
- No actual database queries

**Salon Detail Page** (`src/app/salon/[slug]/page.tsx`):
- Line 91: Checks localStorage first (!)
- No Supabase query for salon details

**Vendor Claim Page** (`src/app/vendor/claim/page.tsx`):
- Line 45: Queries non-existent `existing_listings` table
- Should query `salons` table instead

#### 3. **API Routes Not Used** - CRITICAL
Frontend makes NO API calls to `/api/salons` route:
- API route exists and works
- But homepage/search never call it
- All data is mocked in components

#### 4. **Missing Database Functions** - HIGH
Frontend code expects these Supabase functions:
```sql
❌ search_salons_by_location() - Not created
❌ get_featured_salons() - Not created  
❌ increment_salon_view_count() - Not created
```

#### 5. **LocalStorage Pollution** - MEDIUM
Code stores and retrieves fake salons from localStorage:
- `salonListings` key used in salon detail page
- `claimingSalon` key used in vendor claim
- This overrides real database data

---

## 🗂️ DETAILED FILE-BY-FILE ANALYSIS

### **Homepage** (`src/app/page.tsx`)
| Line | Issue | Status |
|------|-------|--------|
| 11-12 | Imports from supabase commented out | ❌ Not using real data |
| 62-80 | loadFeaturedSalons() returns mock data | ❌ Hardcoded |
| 83-102 | loadPopularSalons() returns mock data | ❌ Hardcoded |
| 105-132 | handleSearch() uses setTimeout | ❌ No API call |

**What It Should Do:**
- Call `/api/salons?featured=true` for featured salons
- Call SalonService.getFeaturedSalons() directly
- Use real Supabase data with proper schema

### **Search Page** (`src/app/search/page.tsx`)
| Line | Issue | Status |
|------|-------|--------|
| 88-250 | Entire mockSalons array | ❌ Hardcoded fake data |
| 61-80 | Auto-search filters mockSalons | ❌ Not querying DB |

**What It Should Do:**
- Query `/api/salons` with filter params
- Use SalonService.searchSalons() 
- Display real Australian salons

### **Salon Detail** (`src/app/salon/[slug]/page.tsx`)
| Line | Issue | Status |
|------|-------|--------|
| 91 | Checks localStorage for salons | ❌ Wrong data source |
| 90-100 | No Supabase query | ❌ Missing DB call |

**What It Should Do:**
- Call SalonService.getSalonBySlug(slug)
- Query `/api/salons/${slug}`
- Show real salon from database

### **Vendor Claim** (`src/app/vendor/claim/page.tsx`)
| Line | Issue | Status |
|------|-------|--------|
| 44-56 | Queries 'existing_listings' table | ❌ Table doesn't exist |

**What It Should Do:**
- Query `salons` table
- Filter by unclaimed (owner_id IS NULL)
- Allow vendors to claim real listings

### **API Route** (`src/app/api/salons/route.ts`)
| Component | Issue | Status |
|-----------|-------|--------|
| Homepage | Never calls this API | ❌ Unused |
| Search | Never calls this API | ❌ Unused |
| Salon Detail | Never calls this API | ❌ Unused |

**Good News:**
- API route itself works correctly
- Queries real `salons` table
- Returns proper data structure

### **Salon Service** (`src/lib/api/salons.ts`)
| Function | Issue | Status |
|----------|-------|--------|
| searchSalons() | Calls non-existent RPC functions | ❌ Will fail |
| getFeaturedSalons() | Calls non-existent RPC | ❌ Will fail |
| getPopularSalons() | Queries non-existent reviews table | ❌ Will fail |
| getSalonBySlug() | Uses wrong schema | ⚠️ Partial fail |

---

## 🔧 WHAT NEEDS TO BE FIXED

### Priority 1: CRITICAL (Must Fix First)

#### 1.1. **Update Database Schema to Match Frontend**
Either:
- **Option A**: Modify database to match frontend expectations (RECOMMENDED)
- **Option B**: Modify frontend to match database schema

**Option A Steps** (Recommended):
```sql
-- Add missing columns to salons table
ALTER TABLE salons 
  ADD COLUMN IF NOT EXISTS state VARCHAR(100),
  ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Australia',
  ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS specialties TEXT[],
  ADD COLUMN IF NOT EXISTS services_offered TEXT[],
  ADD COLUMN IF NOT EXISTS languages_spoken TEXT[] DEFAULT ARRAY['English'],
  ADD COLUMN IF NOT EXISTS price_range VARCHAR(20) DEFAULT 'mid-range',
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Populate new columns from existing data
UPDATE salons SET 
  specialties = ARRAY[]::TEXT[],
  services_offered = ARRAY[]::TEXT[],
  state = (SELECT name FROM cities WHERE cities.id = salons.city_id);
```

#### 1.2. **Replace Mock Data with Real API Calls**

**Homepage Changes:**
```typescript
// BEFORE (lines 62-80)
const loadFeaturedSalons = async () => {
  const mockSalons = [...] // Hardcoded
  setFeaturedSalons(mockSalons)
}

// AFTER
const loadFeaturedSalons = async () => {
  const response = await fetch('/api/salons?featured=true&limit=8')
  const { salons } = await response.json()
  setFeaturedSalons(salons)
}
```

**Search Page Changes:**
```typescript
// BEFORE (lines 88-250)
const mockSalons: Salon[] = [...]

// AFTER
const [salons, setSalons] = useState<Salon[]>([])
useEffect(() => {
  fetchSalons()
}, [])

const fetchSalons = async () => {
  const response = await fetch('/api/salons')
  const { salons } = await response.json()
  setSalons(salons)
}
```

#### 1.3. **Fix Salon Detail Page to Query Database**
```typescript
// BEFORE (line 87-100)
const loadSalonDetails = async (slug: string) => {
  const salonListings = JSON.parse(localStorage.getItem('salonListings') || '[]')
  const autoCreatedSalon = salonListings.find((salon: any) => salon.slug === slug)
  // ...
}

// AFTER
const loadSalonDetails = async (slug: string) => {
  const response = await fetch(`/api/salons/${slug}`)
  const { salon } = await response.json()
  setSalon(salon)
}
```

#### 1.4. **Create Missing API Routes**
Need to add:
- `/api/salons/[slug]/route.ts` - Get single salon by slug
- `/api/salons/featured/route.ts` - Get featured salons
- Update `/api/salons/route.ts` to accept query params

### Priority 2: HIGH (Fix Soon)

#### 2.1. **Create Database Functions**
```sql
-- Function to get featured salons
CREATE OR REPLACE FUNCTION get_featured_salons(limit_count INTEGER DEFAULT 8)
RETURNS SETOF salons AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM salons
  WHERE is_featured = true 
    AND is_published = true
  ORDER BY rating DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_salon_view_count(salon_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  -- Note: salons.id is INTEGER not UUID in current schema
  UPDATE salons 
  SET view_count = view_count + 1
  WHERE id = salon_id
  RETURNING view_count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;
```

#### 2.2. **Fix Vendor Claim Page**
```typescript
// BEFORE (line 44)
const { data, error } = await supabase
  .from('existing_listings') // ❌ Doesn't exist
  .select('*')

// AFTER
const { data, error } = await supabase
  .from('salons') // ✅ Real table
  .select('id, name, address, city_id, slug, is_published')
  .eq('is_published', true)
  .is('owner_id', null) // Unclaimed salons
```

#### 2.3. **Add Reviews Table**
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  salon_id INTEGER REFERENCES salons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT,
  service_type VARCHAR(100),
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_reviews_salon_id ON reviews(salon_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

### Priority 3: MEDIUM (Improvements)

#### 3.1. **Remove LocalStorage Dependencies**
Remove all code that stores/retrieves salons from localStorage

#### 3.2. **Add Proper Error Handling**
Replace `setTimeout()` with real async/await + try/catch

#### 3.3. **Add Loading States**
Show proper loading indicators while fetching real data

#### 3.4. **Schema Markup**
Add JSON-LD structured data for SEO once real data is displayed

### Priority 4: LOW (Polish)

#### 4.1. **Add Geocoding**
Populate latitude/longitude for all 248 salons

#### 4.2. **Add Photos**
Upload salon images to Supabase Storage

#### 4.3. **Implement Filters**
Make search filters actually work with real data

---

## 🎯 RECOMMENDED ACTION PLAN

### Phase 1: Fix Database Schema (Day 1)
1. ✅ Run SQL migration to add missing columns
2. ✅ Populate new columns with data from existing boolean flags
3. ✅ Create database functions (get_featured_salons, increment_view_count)
4. ✅ Add reviews table

### Phase 2: Fix API Integration (Day 1-2)
1. ✅ Update `/api/salons/route.ts` to accept query parameters
2. ✅ Create `/api/salons/[slug]/route.ts`
3. ✅ Create `/api/salons/featured/route.ts`
4. ✅ Test all API routes return correct data

### Phase 3: Replace Mock Data in Frontend (Day 2)
1. ✅ Update Homepage - connect to real API
2. ✅ Update Search Page - remove mock data
3. ✅ Update Salon Detail - query database
4. ✅ Update Vendor Claim - fix table name

### Phase 4: Test & Verify (Day 2-3)
1. ✅ Test homepage shows real featured salons
2. ✅ Test search returns real Australian salons
3. ✅ Test salon detail pages load correctly
4. ✅ Test vendor claim shows real unclaimed listings
5. ✅ Test all filters work

### Phase 5: Polish & Deploy (Day 3)
1. ✅ Add error handling
2. ✅ Add loading states
3. ✅ Add schema markup
4. ✅ Test on staging
5. ✅ Deploy to production

---

## 📈 SUCCESS METRICS

After fixes, you should see:
- ✅ Homepage displays 248 real Australian salons
- ✅ Featured section shows highest-rated salons
- ✅ Search results come from database, not mock data
- ✅ Salon detail pages show real business information
- ✅ Vendor claim page lists actual unclaimed salons
- ✅ All filters work with real data
- ✅ No more localStorage or setTimeout hacks
- ✅ Fast page loads (< 2 seconds)
- ✅ Proper error messages when things fail

---

## 🔒 SECURITY CONSIDERATIONS

### Current Issues:
1. ❌ No Row Level Security (RLS) policies on salons table
2. ❌ Service role key in code (should be server-side only)
3. ❌ No input validation on API routes

### To Add:
```sql
-- Enable RLS
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;

-- Public can read published salons
CREATE POLICY "Public read published salons"
  ON salons FOR SELECT
  USING (is_published = true);

-- Vendors can update their own salons
CREATE POLICY "Vendors update own salons"
  ON salons FOR UPDATE
  USING (auth.uid() = owner_id);
```

---

## 📝 NOTES

1. **Why Mock Data Exists**: Original development was done offline/without database
2. **Why Schema Mismatch**: Database was created independently from frontend
3. **Quick Fix**: Easiest path is to align database with frontend expectations
4. **Long-term**: Consider using Prisma or Drizzle ORM for type-safe queries

---

**Next Step**: Would you like me to start with Phase 1 (Database Schema Fixes)?
