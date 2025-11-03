# Remaining Tasks - November 3, 2025

## ✅ COMPLETED

### Salon Detail Page
- ✅ **REMOVED ALL FAKE REVIEWS** (Jessica L., Sarah M., etc. - GONE!)
- ✅ Changed from tabbed to single-page layout
- ✅ Added embedded Google Maps
- ✅ Fixed operating hours display
- ✅ Shows ONLY real reviews from database
- ✅ Proper section formatting
- ✅ Committed and pushed to GitHub

---

## 🔴 REMAINING TASKS

### 1. Homepage - Reinstate Two Search Boxes Side by Side
**Current**: Single search box  
**Required**: Two search boxes side by side
- Location/City search
- Service/Business search  

**File**: `src/app/page.tsx`  
**Component**: `SearchFilter` component

---

### 2. Search Page - Add "Search This Area" Button
**Required**: Button on map to search salons in visible map area  
**File**: Need to find/create search page with map  
**Features needed**:
- Detect map bounds
- Filter salons by coordinates
- "Search this area" button above/on map

---

### 3. Location-Based Featured Salons
**Current**: Shows top-rated salons globally  
**Required**: 
- Ask for user location permission
- Show featured salons near user's location
- Default map to user's area
- Fallback to general featured if location denied

**Files**: 
- `src/app/page.tsx` - Featured salons logic
- `src/app/api/salons/featured/route.ts` - Add location filtering

---

### 4. Salon Detail Page - Description Formatting
**Current**: Plain text block  
**Required**: Parsed sections with headers:

```
About {Salon Name}
[Business description]

What do the reviews say?
[Average rating + highlights]

What services do they offer?
[Service list]

What amenities does the salon offer?
[Amenities list]

How qualified are the staff?
[Staff qualifications]

What specialised treatment options are available?
[Special treatments]

What are their opening hours?
[Hours with special notes like "Extended hours on Friday"]

What appointment types do they accept?
[Appointment info + mobile nails]

What sort of space is this salon?
[Kid friendly, wheelchair accessible, etc.]

Who owns the salon?
[Ownership info]

What languages do they speak?
[Languages]
```

**Current implementation**: Basic sections exist but need enhancement  
**File**: `src/app/salon/[slug]/page.tsx`

---

## 📊 PROGRESS TRACKING

| Task | Status | Priority | Estimated Time |
|------|--------|----------|----------------|
| Salon detail page fake reviews | ✅ DONE | CRITICAL | - |
| Salon detail page tabs removal | ✅ DONE | HIGH | - |
| Salon detail page map | ✅ DONE | HIGH | - |
| Salon detail operating hours | ✅ DONE | HIGH | - |
| Two search boxes on homepage | ❌ TODO | HIGH | 30 min |
| Search this area button | ❌ TODO | MEDIUM | 1 hour |
| Location-based featured | ❌ TODO | MEDIUM | 1 hour |
| Enhanced description formatting | ❌ TODO | LOW | 30 min |

---

## 🎯 PRIORITY ORDER

1. **Homepage: Two search boxes** (user explicitly requested, simple fix)
2. **Search page: Search this area button** (core functionality)
3. **Location-based featured salons** (nice UX improvement)
4. **Enhanced description parsing** (polish, can be done last)

---

## 📝 NOTES

- All fake review data has been eliminated
- Database has 1,226 real reviews from 241 salons
- API endpoints are working correctly
- All changes pushed to GitHub (commit d95fe3f)
- Server is running cleanly with no errors

---

## 🔗 CURRENT STATUS

**Repository**: https://github.com/jwtshorter/nailnav  
**Latest Commit**: d95fe3f - "fix: COMPLETE rebuild of salon detail page"  
**Server**: Running on port 3000  
**Database**: 248 salons + 1,226 reviews  

---

**Next action**: Implement two search boxes on homepage
