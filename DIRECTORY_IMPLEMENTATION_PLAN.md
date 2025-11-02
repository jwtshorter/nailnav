# Directory & SEO Implementation Plan

## Completed ✅

### 1. Salon Page Simplification
- Removed tabbed interface
- Single long scrolling page with all content
- PR Created: https://github.com/jwtshorter/nailnav/pull/1

### 2. Database Schema Updates
- Created migration file: `supabase/migrations/0003_directory_and_filters.sql`
- Added location hierarchy tables (countries, states, cities)
- Added comprehensive filter columns to salons table (53 new boolean fields)
- Added Google Places data fields
- Created indexes for performance
- Added helper functions for nearby cities (150km radius)

### 3. Data Import Script
- Created `import-salons.js` to import Australian salons data
- Maps Excel columns (BE:DE) to database filter fields
- Handles city/state creation automatically
- Ready to import 249 Australian salons

## Pending 📋

### 4. Directory Page Components
Need to create Next.js pages for SEO structure:
- `/nail-salons/page.tsx` - Root directory page
- `/nail-salons/[country]/page.tsx` - Country page (australia, usa)
- `/nail-salons/[country]/[state]/page.tsx` - State page
- `/nail-salons/[country]/[state]/[city]/page.tsx` - City page

### 5. Directory Features
- Nearby cities links (within 150km)
- FAQ sections at bottom of each page
- SEO-optimized meta tags
- Breadcrumb navigation
- Internal linking structure

### 6. API Endpoints
Need to create:
- `/api/directory/cities?state=nsw` - Get cities in a state
- `/api/directory/nearby?cityId=xxx` - Get nearby cities
- `/api/directory/salons?cityId=xxx` - Get salons in a city

## Excel File Structure

### Columns Mapped:
- **A**: place_id (Google Places ID)
- **B**: name
- **C**: description (original)
- **H**: phone
- **I**: website
- **S**: address
- **W**: state code (NT, NSW, VIC, etc.)
- **X**: City (format: "City: Y = Darwin")
- **BE-DE**: Filter columns (53 boolean fields)
- **DG**: Generated description (from filters)

### Filter Categories:
1. **Services** (17): Manicure, Gel, Acrylic, Pedicure, etc.
2. **Languages** (6): English, Spanish, Vietnamese, Chinese, Korean
3. **Expertise** (5): Qualified technicians, Master artist, etc.
4. **Booking** (5): Walk-ins, Appointments, Group bookings, etc.
5. **Atmosphere** (5): Kid-friendly, Pet-friendly, LGBTQI+, etc.
6. **Amenities** (5): Wi-Fi, Parking, Massage chairs, etc.
7. **Health & Safety** (6): Sterilization, LED curing, Eco-friendly, etc.

## URL Structure

```
/nail-salons/                                    → Root directory
/nail-salons/australia/                          → Country page
/nail-salons/australia/new-south-wales/          → State page
/nail-salons/australia/new-south-wales/sydney/   → City page with nearby cities
/nail-salons/australia/new-south-wales/sydney/orchid-nails-spa/ → Individual salon
```

## Next Steps

1. Run the database migration in Supabase
2. Run the import script to load Australian salons
3. Create directory page components
4. Test the complete flow
5. Deploy to sandbox for review
