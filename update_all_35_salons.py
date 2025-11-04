import os
from dotenv import load_dotenv
load_dotenv('.env.local')
from supabase import create_client

url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

supabase = create_client(url, service_key)

# Get city IDs
darwin_city = supabase.table('cities').select('id').eq('name', 'Darwin').limit(1).execute()
darwin_city_id = darwin_city.data[0]['id'] if darwin_city.data else None

alice_springs_city = supabase.table('cities').select('id').eq('name', 'Alice Springs').limit(1).execute()
alice_springs_city_id = alice_springs_city.data[0]['id'] if alice_springs_city.data else None

sydney_city = supabase.table('cities').select('id').eq('name', 'Sydney').limit(1).execute()
sydney_city_id = sydney_city.data[0]['id'] if sydney_city.data else None

print(f"City IDs: Darwin={darwin_city_id}, Alice Springs={alice_springs_city_id}, Sydney={sydney_city_id}\n")

# Address corrections with coordinates where provided
# User provided corrections for all 35 salons
corrections = [
    # Darwin area salons (1-7)
    {
        "name": "JENNI LASHES, BROWS ART & BEAUTY",
        "address": "15 Temple Terrace, Palmerston City NT 0830",
        "city_id": darwin_city_id
    },
    {
        "name": "Golden Nails and Beauty Palmerston",
        "address": "10 Temple Terrace, Palmerston City NT 0830",
        "city_id": darwin_city_id
    },
    {
        "name": "The Palm Nails and Beauty (next to Good Times Bar & Grill)",
        "address": "11 University Ave, Palmerston City NT 0830",
        "city_id": darwin_city_id,
        "lat": -12.4744,
        "lng": 130.9856
    },
    {
        "name": "Star's Nail Salon",
        "address": "19 Kitchener Drive, Darwin City, NT 0800",
        "city_id": darwin_city_id
    },
    {
        "name": "Anjali Brow Studio Casuarina Square",
        "address": "247 Trower Rd, Casuarina NT 0810",
        "city_id": darwin_city_id
    },
    {
        "name": "Unforgettable Salon",
        "address": "130 University Ave, Durack NT 0830",
        "city_id": darwin_city_id
    },
    {
        "name": "Charms SPA Nails & Beauty Oasis",
        "address": "15 Temple Terrace, Palmerston City NT 0830",
        "city_id": darwin_city_id,
        "note": "Cross reference with Google for coordinates"
    },
    
    # Darwin area salons - need Google lookup (8-14)
    {
        "name": "Flourishing Bodies",
        "address": "56 Packard Ave, Durack NT 0830",
        "city_id": darwin_city_id
    },
    {
        "name": "Regal Beauty nails &spa",
        "address": "1 Roystonea Ave, Yarrawonga NT 0830",
        "city_id": darwin_city_id,
        "note": "Cross reference with Google for coordinates"
    },
    {
        "name": "Tiffany Nail Spa",
        "address": "8 Dillon Cct, Gray NT 0830",
        "city_id": darwin_city_id,
        "note": "Cross reference with Google for coordinates"
    },
    {
        "name": "Td Nails & Spa",
        "address": "49 Roystonea Ave, Palmerston City NT 0830",
        "city_id": darwin_city_id,
        "note": "Cross reference with Google for coordinates"
    },
    {
        "name": "LeBeauty",
        "address": "56 Packard Ave, Durack NT 0830",
        "city_id": darwin_city_id,
        "note": "Cross reference with Google for coordinates"
    },
    {
        "name": "Darwin Nails",
        "address": "1 Roystonea Ave, Yarrawonga NT 0830",
        "city_id": darwin_city_id,
        "note": "Cross reference with Google for coordinates"
    },
    {
        "name": "Nails designed by James and waxing",
        "address": "1 Mannikan Ct, Bakewell NT 0832",
        "city_id": darwin_city_id,  # User specified: "set to NT (not Darwin)"
        "note": "Cross reference with Google for coordinates"
    },
    
    # Sydney area salons (15-31)
    {
        "name": "Alina Huck Nails",
        "address": "122 McEvoy St, Alexandria NSW 2015",
        "city_id": sydney_city_id
    },
    {
        "name": "Nails Boulevard Town Hall",
        "address": "436 George St, Sydney, New South Wales, 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "Stay Classy By Helen SYDNEY",
        "address": "95 Bathurst St, Sydney NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "W Nails",
        "address": "29 Dixon St, Haymarket NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "AYU NAIL & BEAUTY",
        "address": "383 Pitt St, Sydney NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "Vivid Nail Salon",
        "address": "90 Pitt St, Sydney NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "BP Deluxe Nails & Beauty - Martin Place",
        "address": "108 King St, Sydney NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "suminails",
        "address": "227 Elizabeth St, Sydney NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "INSTYLE NAILS & BEAUTY - METCENTRE Wynyard station ( Previously BP Deluxe Nails)",
        "address": "273 George Street Sydney NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "AOUO Press-On Nails & Manicure Salon",
        "address": "401 Sussex St, Haymarket NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "MD nails and beauty",
        "address": "1 Dixon St, Sydney NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "Nails Avenue Westfield Sydney",
        "address": "188 Pitt St, Sydney NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "DEPOT NAIL BAR",
        "address": "36A Goulburn St, Haymarket NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "ProfessioNAIL",
        "address": "239 George St, Sydney NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "Elan Nail Atelier",
        "address": "1 Dixon St, Sydney NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "Velvet Nails",
        "address": "264 George St, Sydney NSW 2000",
        "city_id": sydney_city_id
    },
    {
        "name": "Professionail Randwick",
        "address": "45 St Pauls St, Randwick NSW 2031",
        "city_id": sydney_city_id
    },
    
    # Alice Springs salons (32-33)
    {
        "name": "Glossy Nails Alice Springs",
        "address": "91 Todd St, Alice Springs NT 0870",
        "city_id": alice_springs_city_id
    },
    {
        "name": "Nails By Phuong",
        "address": "70 Todd St, Alice Springs NT 0870",
        "city_id": alice_springs_city_id
    },
    
    # Sydney area salons continued (34-35)
    {
        "name": "Pearl Nails Eastgardens",
        "address": "152 Bunnerong Rd, Eastgardens NSW 2036",
        "city_id": sydney_city_id
    },
    {
        "name": "Amo Japanese Nail Salon",
        "address": "2 Elizabeth Bay Rd, Elizabeth Bay NSW 2011",
        "city_id": sydney_city_id
    }
]

print(f"🔄 Updating {len(corrections)} salon addresses...\n")

updated = 0
failed = 0
not_found = 0

for idx, correction in enumerate(corrections, 1):
    try:
        # Find salon by name
        result = supabase.table('salons').select('id, name, city_id').eq('name', correction['name']).limit(1).execute()
        
        if result.data and len(result.data) > 0:
            salon_id = result.data[0]['id']
            old_city_id = result.data[0]['city_id']
            
            # Prepare update data
            update_data = {
                'address': correction['address'],
                'city_id': correction['city_id']
            }
            
            # Add coordinates if provided
            if 'lat' in correction and 'lng' in correction:
                update_data['latitude'] = correction['lat']
                update_data['longitude'] = correction['lng']
            else:
                # Clear coordinates so they can be re-geocoded
                update_data['latitude'] = None
                update_data['longitude'] = None
            
            # Update address and city
            update_result = supabase.table('salons').update(update_data).eq('id', salon_id).execute()
            
            if update_result.data:
                coord_status = f" (coords: {correction['lat']}, {correction['lng']})" if 'lat' in correction else " (coords cleared)"
                city_change = f" [city: {old_city_id} → {correction['city_id']}]" if old_city_id != correction['city_id'] else ""
                note = f" 📝 {correction['note']}" if 'note' in correction else ""
                print(f"✅ {idx:2}. {correction['name'][:50]}{coord_status}{city_change}{note}")
                updated += 1
            else:
                print(f"❌ {idx:2}. Failed to update: {correction['name']}")
                failed += 1
        else:
            print(f"⚠️  {idx:2}. Not found: {correction['name']}")
            not_found += 1
            
    except Exception as e:
        print(f"❌ {idx:2}. Error updating {correction['name']}: {str(e)}")
        failed += 1

print(f"\n{'='*80}")
print(f"✅ Successfully updated: {updated}")
print(f"⚠️  Not found: {not_found}")
print(f"❌ Failed: {failed}")
print(f"{'='*80}")

if not_found > 0:
    print("\n💡 Tip: Salons not found may have slightly different names in the database.")
    print("   Check the exact names in the database and update the script accordingly.")
