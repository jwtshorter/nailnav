# Salons Without Coordinates (35 Total - UPDATED)

**After implementing advanced street address extraction, only 35 salons (14%) remain without coordinates.**

## Progress Summary

- ✅ **213 salons** (85%) now have exact coordinates
- ❌ **35 salons** (14%) failed geocoding  
- 📍 **248 total salons** in database

**Improvement Timeline:**
- Initial (basic cleaning): 186 salons (75%)
- After street extraction: 213 salons (85%)
- **Net gain: +27 salons geocoded! 🚀**

---

## The 35 Remaining Salons

### 1. JENNI LASHES, BROWS ART & BEAUTY
- **City:** Darwin, NT
- **Address:** Oasis shopping village, T30, 15 Temple Terrace, Palmerston City NT 0830

### 2. Golden Nails and Beauty Palmerston
- **City:** Darwin, NT
- **Address:** Shop 53/10 Temple Terrace, Palmerston City NT 0830

### 3. Nails designed by James and waxing
- **City:** Sydney, NSW *(incorrect - should be Bakewell, NT)*
- **Address:** Shopping centre, Shop P2/1 Mannikan Ct, Bakewell NT 0831

### 4. Alina Huck Nails
- **City:** Sydney, NSW
- **Address:** 35/112-122A McEvoy St, Alexandria NSW 2015

### 5. Glossy Nails Alice Springs
- **City:** Sydney, NSW *(incorrect - should be Alice Springs, NT)*
- **Address:** 7-8/91 Todd St, Alice Springs NT 0870

### 6. Nails Boulevard Town Hall
- **City:** Sydney, NSW
- **Address:** corner of Pitt and, Shop 26 level M, Myer Market St, Sydney NSW 2000

### 7. The Palm Nails and Beauty (next to Good Times Bar & Grill)
- **City:** Darwin, NT
- **Address:** 11 University Ave, Palmerston City NT 0830

### 8. Flourishing Bodies
- **City:** Darwin, NT
- **Address:** 2/42 Toupein Rd, Yarrawonga NT 0830

### 9. Regal Beauty nails &spa
- **City:** Darwin, NT
- **Address:** Shop T49/1 Roystonea Ave, Yarrawonga NT 0830

### 10. Amo Japanese Nail Salon
- **City:** Sydney, NSW
- **Address:** 87-89 worldtower Level 12 number 1216, Sydney NSW 2000

### 11. Tiffany Nail Spa
- **City:** Darwin, NT
- **Address:** 8 Dillon Cct, Gray NT 0830

### 12. Star's Nail Salon
- **City:** Darwin, NT
- **Address:** E3 the waterfront, Darwin City 0800

### 13. Anjali Brow Studio Casuarina Square
- **City:** Darwin, NT
- **Address:** Casuarina Square, Shop GD008/247 Trower Rd, Casuarina NT 0810

### 14. Unforgettable Salon
- **City:** Darwin, NT
- **Address:** Shop 3A 130 University Ave Durack, Palmerston City NT 0830

### 15. Td Nails & Spa
- **City:** Darwin, NT
- **Address:** 49 Roystonea Ave, Palmerston City NT 0830

### 16. LeBeauty
- **City:** Darwin, NT
- **Address:** 56 Packard Ave, Durack NT 0830

### 17. Charms SPA Nails & Beauty Oasis
- **City:** Darwin, NT
- **Address:** Shop 23/15 Temple Terrace, Palmerston City NT 0830

### 18. Darwin Nails
- **City:** Darwin, NT
- **Address:** Shop T34/1 Roystonea Ave, Yarrawonga NT 0830

### 19. Nails By Phuong
- **City:** Sydney, NSW *(incorrect - should be Alice Springs, NT)*
- **Address:** Shop 7/70 Todd St, Alice Springs NT 0870

### 20. Stay Classy By Helen SYDNEY
- **City:** Sydney, NSW
- **Address:** At Vbeauty Clinic, Level 3/95 Bathurst St, Sydney NSW 2000

### 21. W Nails
- **City:** Sydney, NSW
- **Address:** Harbour Arcade, Shop 105, Shop 107/29 Dixon St, Haymarket NSW 2000

### 22. AYU NAIL & BEAUTY
- **City:** Sydney, NSW
- **Address:** Level 1 . Suit 101/379-383 Pitt St, Sydney NSW 2000

### 23. Vivid Nail Salon
- **City:** Sydney, NSW
- **Address:** Martin Place, level 4/90 Pitt St, Sydney NSW 2000

### 24. BP Deluxe Nails & Beauty - Martin Place
- **City:** Sydney, NSW
- **Address:** Royal Theater Sydney, Shop 604, level 6/108 King St, Sydney NSW 2000

### 25. Nails Avenue Westfield Sydney (Myer foodcourt)
- **City:** Sydney, NSW
- **Address:** SH, G17 Sydney Central Plaza, Shop/G17 Pitt St, Sydney NSW 2000

### 26. suminails
- **City:** Sydney, NSW
- **Address:** Shop 15, Lower Ground Floor/227 Elizabeth St, Sydney NSW 2000

### 27. INSTYLE NAILS & BEAUTY - METCENTRE Wynyard station
- **City:** Sydney, NSW
- **Address:** Shop G16C / 273 George Street MetCentre, Ground Level, Sydney NSW 2000

### 28. AOUO Press-On Nails & Manicure Salon
- **City:** Sydney, NSW
- **Address:** Sussex Centre Food Court, LG Shop 2/401 Sussex St, Haymarket NSW 2000

### 29. MD nails and beauty
- **City:** Sydney, NSW
- **Address:** Top Floor, Shop 75, Level 5/1 Dixon St, Sydney NSW 2000

### 30. DEPOT NAIL BAR
- **City:** Sydney, NSW
- **Address:** South Eveleigh Commercial Industry Shop B2 S015, Ground Level, Eveleigh NSW 2015

### 31. ProfessioNAIL
- **City:** Sydney, NSW
- **Address:** Westfield Bondi Junction Shopping Centre Shop 2055, Shop 2055/500 Oxford St, Bondi Junction NSW 2022

### 32. Elan Nail Atelier
- **City:** Sydney, NSW
- **Address:** Based in Molly Jordan Beauty, Unit 3/277 Bronte Rd, Waverley NSW 2024

### 33. Velvet Nails
- **City:** Sydney, NSW
- **Address:** Exit Edgecliff train station, go to the back towards New Mclean st, Shop 32/235 New South Head Rd, Edgecliff NSW 2027

### 34. Professionail Randwick
- **City:** Sydney, NSW
- **Address:** Royal Randwick Shopping Centre, Shop 1035/73 Belmore Rd, Randwick NSW 2031

### 35. Pearl Nails Eastgardens
- **City:** Sydney, NSW
- **Address:** Shop 103A . Westfield Eastgardens 152 Bunnerong road . Pagewood, Eastgardens NSW 2036

---

## Common Issues

### Darwin/NT Salons (15 salons)
- **Small suburbs not in OpenStreetMap:** Yarrawonga, Gray, Durack, Bakewell
- **Generic references:** "Shopping village", "Casuarina Square", "waterfront"
- **Temple Terrace addresses:** Multiple salons on this street not recognized by OSM

### Sydney/NSW Salons (20 salons)
- **Database errors:** 3 salons marked as Sydney but are in Alice Springs or Bakewell NT
- **Within other businesses:** "At Vbeauty Clinic", "Based in Molly Jordan Beauty"
- **Complex shopping codes:** Multiple shop numbers, generic centres
- **Vague descriptions:** "corner of Pitt and", "Exit train station..."

## Recommendations

1. **Fix Database Issues**
   - Update city for: Glossy Nails Alice Springs, Nails By Phuong, Nails designed by James and waxing

2. **Contact Salons**
   - Request complete street addresses for Darwin area salons
   - Get building names for "within business" locations

3. **Manual Geocoding**
   - Use Google Maps to find exact coordinates for known locations
   - Add coordinates directly to database

4. **Alternative Geocoding**
   - Consider Google Maps Geocoding API (paid) for better shopping centre coverage

## Current Map Behavior

These 35 salons display near their city center with a small random offset (±0.05 degrees), keeping them visible and searchable while better addresses are obtained.
