
# Directory SEO + Interlinking Architecture Brief

## Project Overview
Create a large-scale directory website for nail salons across the USA and Australia (~50,000 listings).  
Tech stack: Next.js (Vercel) + Supabase + ISR.

Goal: Strong SEO foundation, scalable routing, automated internal linking (like scratchanddentlocator.com).

---

## URL Structure
/nail-salons/
/nail-salons/usa/
/nail-salons/usa/california/
/nail-salons/usa/california/los-angeles/
/nail-salons/usa/california/los-angeles/salon-name/

Same pattern for Australia.

---

## Database Model (Supabase)

### Table: locations
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | primary key |
| country | text | 'usa' or 'australia' |
| state | text | e.g. 'california' |
| city | text | |
| lat | float | |
| lng | float | |
| slug | text | |
| salon_count | int | |

### Table: salons
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | primary key |
| name | text | |
| city_id | uuid | FK to locations |
| address | text | |
| slug | text | unique per city |
| website | text | |
| phone | text | |
| description | text | |

---

## Page Generation (ISR)
Use Incremental Static Regeneration for:
- /country/
- /country/state/
- /country/state/city/
- /country/state/city/salon-name/

Pages revalidate automatically when data updates.

---

## Internal Linking System

### 1. Vertical Links
City → State (“See all salons in California”)  
State → Country

### 2. Horizontal Links (City → City)
Show nearby cities (within 100km) via Supabase query:

```sql
select city, slug, state
from locations
where country = $country
and state = $state
and earth_distance(
  ll_to_earth(lat, lng),
  ll_to_earth($currentLat, $currentLng)
) < 100000
and city != $currentCity
order by salon_count desc
limit 10;
```

### 3. Regional Hubs
Each state page lists all cities in that state.  
City pages link back to state hub.

### 4. Country Index
/nail-salons/usa/ and /nail-salons/australia/ list all states with salon counts.

### 5. Crawl Loop
Country → State → City → Nearby Cities → State → Country

---

## Frontend Components
**CityPage.tsx**: salon listings + nearby cities + link to state.  
**StatePage.tsx**: list all cities with counts.  
**CountryPage.tsx**: list all states with totals.

---

## API Endpoints
- /api/cities?state=california  
- /api/nearby-cities?lat=34.05&lng=-118.24&country=usa&state=california  
- /api/salons?city=los-angeles

---

## SEO
- Descriptive anchor text (“Nail salons in Santa Monica”)  
- Schema markup: LocalBusiness, PostalAddress  
- Lazy-load map embeds  
- Titles:
  - City: “Best Nail Salons in [City], [State]”  
  - State: “Nail Salons in [State]”  
  - Country: “Find Nail Salons Across [Country]”

---

## Scalability
- 50k pages fine with ISR + CDN caching.  
- Index on country, state, lat/lng.  
- Auto-generate sitemap from slugs.

---

## Deliverables for Claude
1. Supabase schema migrations  
2. Next.js page generation (ISR)  
3. Nearby city API logic  
4. Auto SEO linking
