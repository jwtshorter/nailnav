# Remaining Salons Without Coordinates (35 Total - 14%)

After implementing advanced street address extraction logic, these 35 salons (14%) still could not be geocoded due to very vague or incomplete addresses.

**Progress Summary:**
- ✅ **213 salons** (85%) now have exact coordinates
- ❌ **35 salons** (14%) failed geocoding
- 📍 **248 total salons** in database

**Improvement from street address extraction:**
- Before: 186 salons (75%)
- After:  213 salons (85%)
- **Gained: 27 additional salons geocoded! 🚀**

---

## Common Issues with Remaining Addresses:

1. **Very small suburbs not in OpenStreetMap** (Yarrawonga, Gray, Durack, Bakewell)
2. **Extremely vague locations** ("E3 the waterfront", "corner of Pitt and")
3. **Within other businesses** ("At Vbeauty Clinic", "Based in Molly Jordan Beauty")
4. **Complex shopping centre codes** ("Shop GD008", "Shop T49", "Shop 103A")
5. **Multiple conflicting designations** ("Shop 105, Shop 107/29")
6. **No actual street address** ("Sussex Centre Food Court", "Westfield Bondi Junction Shopping Centre")

---

## The 35 Salons:

### Darwin/NT Salons (15 salons)

## 1. JENNI LASHES, BROWS ART & BEAUTY
- **City:** Darwin, NT
- **Address:** Oasis shopping village, T30, 15 Temple Terrace, Palmerston City NT 0830
- **Issue:** Generic shopping village reference

## 2. Golden Nails and Beauty Palmerston
- **City:** Darwin, NT
- **Address:** Shop 53/10 Temple Terrace, Palmerston City NT 0830
- **Issue:** Temple Terrace not found in OSM

## 3. The Palm Nails and Beauty (next to Good Times Bar & Grill)
- **City:** Darwin, NT
- **Address:** 11 University Ave, Palmerston City NT 0830
- **Issue:** Palmerston City University Ave not found

## 4. Flourishing Bodies
- **City:** Darwin, NT
- **Address:** 2/42 Toupein Rd, Yarrawonga NT 0830
- **Issue:** Yarrawonga NT is a small suburb not in OSM

## 5. Regal Beauty nails &spa
- **City:** Darwin, NT
- **Address:** Shop T49/1 Roystonea Ave, Yarrawonga NT 0830
- **Issue:** Yarrawonga NT not in OSM

## 6. Tiffany Nail Spa
- **City:** Darwin, NT
- **Address:** 8 Dillon Cct, Gray NT 0830
- **Issue:** Gray NT is a small suburb not in OSM

## 7. Star's Nail Salon
- **City:** Darwin, NT
- **Address:** E3 the waterfront, Darwin City 0800
- **Issue:** Generic waterfront reference with building code

## 8. Anjali Brow Studio Casuarina Square
- **City:** Darwin, NT
- **Address:** Casuarina Square, Shop GD008/247 Trower Rd, Casuarina NT 0810
- **Issue:** Generic shopping centre with complex code

## 9. Unforgettable Salon
- **City:** Darwin, NT
- **Address:** Shop 3A 130 University Ave Durack, Palmerston City NT 0830
- **Issue:** Durack/Palmerston address not found

## 10. Td Nails & Spa
- **City:** Darwin, NT
- **Address:** 49 Roystonea Ave, Palmerston City NT 0830
- **Issue:** Roystonea Ave not in OSM

## 11. LeBeauty
- **City:** Darwin, NT
- **Address:** 56 Packard Ave, Durack NT 0830
- **Issue:** Durack is small suburb not in OSM

## 12. Charms SPA Nails & Beauty Oasis
- **City:** Darwin, NT
- **Address:** Shop 23/15 Temple Terrace, Palmerston City NT 0830
- **Issue:** Temple Terrace not found

## 13. Darwin Nails
- **City:** Darwin, NT
- **Address:** Shop T34/1 Roystonea Ave, Yarrawonga NT 0830
- **Issue:** Yarrawonga/Roystonea not in OSM

### Sydney/NSW Salons (20 salons)

## 14. Nails designed by James and waxing
- **City:** Sydney, NSW (incorrect - should be Darwin/Bakewell)
- **Address:** Shopping centre, Shop P2/1 Mannikan Ct, Bakewell NT 0831
- **Issue:** Bakewell NT not in OSM, city incorrectly set to Sydney

## 15. Alina Huck Nails
- **City:** Sydney, NSW
- **Address:** 35/112-122A McEvoy St, Alexandria NSW 2015
- **Issue:** Street number range format "112-122A" not recognized

## 16. Glossy Nails Alice Springs
- **City:** Sydney, NSW (incorrect - should be Alice Springs)
- **Address:** 7-8/91 Todd St, Alice Springs NT 0870
- **Issue:** Complex shop range format, city incorrectly set

## 17. Nails Boulevard Town Hall
- **City:** Sydney, NSW
- **Address:** corner of Pitt and, Shop 26 level M, Myer Market St, Sydney NSW 2000
- **Issue:** Incomplete address "corner of Pitt and..."

## 18. Nails By Phuong
- **City:** Sydney, NSW (incorrect - should be Alice Springs)
- **Address:** Shop 7/70 Todd St, Alice Springs NT 0870
- **Issue:** City incorrectly set to Sydney

## 19. Stay Classy By Helen SYDNEY
- **City:** Sydney, NSW
- **Address:** At Vbeauty Clinic, Level 3/95 Bathurst St, Sydney NSW 2000
- **Issue:** Located within another business

## 20. W Nails
- **City:** Sydney, NSW
- **Address:** Harbour Arcade, Shop 105, Shop 107/29 Dixon St, Haymarket NSW 2000
- **Issue:** Two conflicting shop numbers

## 21. AYU NAIL & BEAUTY
- **City:** Sydney, NSW
- **Address:** Level 1 . Suit 101/379-383 Pitt St, Sydney NSW 2000
- **Issue:** Period separator, typo "Suit", street range

## 22. Vivid Nail Salon
- **City:** Sydney, NSW
- **Address:** Martin Place, level 4/90 Pitt St, Sydney NSW 2000
- **Issue:** Generic place reference

## 23. BP Deluxe Nails & Beauty - Martin Place
- **City:** Sydney, NSW
- **Address:** Royal Theater Sydney, Shop 604, level 6/108 King St, Sydney NSW 2000
- **Issue:** Generic theatre reference

## 24. Nails Avenue Westfield Sydney (Myer foodcourt)
- **City:** Sydney, NSW
- **Address:** SH, G17 Sydney Central Plaza, Shop/G17 Pitt St, Sydney NSW 2000
- **Issue:** Complex shop codes, generic plaza

## 25. suminails
- **City:** Sydney, NSW
- **Address:** Shop 15, Lower Ground Floor/227 Elizabeth St, Sydney NSW 2000
- **Issue:** Level designation format

## 26. INSTYLE NAILS & BEAUTY - METCENTRE Wynyard station
- **City:** Sydney, NSW
- **Address:** Shop G16C / 273 George Street MetCentre, Ground Level, Sydney NSW 2000
- **Issue:** Complex shop code with slash

## 27. AOUO Press-On Nails & Manicure Salon
- **City:** Sydney, NSW
- **Address:** Sussex Centre Food Court, LG Shop 2/401 Sussex St, Haymarket NSW 2000
- **Issue:** Generic food court reference

## 28. MD nails and beauty
- **City:** Sydney, NSW
- **Address:** Top Floor, Shop 75, Level 5/1 Dixon St, Sydney NSW 2000
- **Issue:** Multiple conflicting floor designations

## 29. DEPOT NAIL BAR
- **City:** Sydney, NSW
- **Address:** South Eveleigh Commercial Industry Shop B2 S015, Ground Level, Eveleigh NSW 2015
- **Issue:** Complex industrial park designation

## 30. ProfessioNAIL
- **City:** Sydney, NSW
- **Address:** Westfield Bondi Junction Shopping Centre Shop 2055, Shop 2055/500 Oxford St, Bondi Junction NSW 2022
- **Issue:** Duplicate shop number, generic Westfield

## 31. Elan Nail Atelier
- **City:** Sydney, NSW
- **Address:** Based in Molly Jordan Beauty, Unit 3/277 Bronte Rd, Waverley NSW 2024
- **Issue:** Located within another business

## 32. Velvet Nails
- **City:** Sydney, NSW
- **Address:** Exit Edgecliff train station, go to the back towards New Mclean st, Shop 32/235 New South Head Rd, Edgecliff NSW 2027
- **Issue:** Full directions as address

## 33. Professionail Randwick
- **City:** Sydney, NSW
- **Address:** Royal Randwick Shopping Centre, Shop 1035/73 Belmore Rd, Randwick NSW 2031
- **Issue:** Generic shopping centre

## 34. Pearl Nails Eastgardens
- **City:** Sydney, NSW
- **Address:** Shop 103A . Westfield Eastgardens 152 Bunnerong road . Pagewood, Eastgardens NSW 2036
- **Issue:** Periods as separators, generic Westfield

## 35. Amo Japanese Nail Salon (Bonus)
- **City:** Sydney, NSW
- **Address:** 87-89 worldtower Level 12 number 1216, Sydney NSW 2000
- **Issue:** Complex format, typo "worldtower" (should be World Tower)

---

## Recommendations:

### 1. Fix Database Issues
- **3 salons** incorrectly have `city` set to Sydney when they're in Alice Springs or Bakewell:
  - Glossy Nails Alice Springs
  - Nails By Phuong  
  - Nails designed by James and waxing

### 2. Get Better Addresses
Contact these salons for complete street addresses:
- Salons in small Darwin suburbs (Yarrawonga, Gray, Durack, Bakewell)
- Salons with generic "shopping centre" or "arcade" references
- Salons with full directions instead of addresses

### 3. Manual Geocoding
For salons with known locations but poor address data, manually add coordinates using Google Maps

### 4. Alternative Geocoding Service
Consider using Google Maps Geocoding API (paid) for the remaining addresses - it has better coverage of shopping centres and complex address formats

---

## Current Map Behavior

These 35 salons will display on the map near their city center with a small random offset (±0.05 degrees), keeping them visible and searchable while better addresses are obtained.
