import os
from dotenv import load_dotenv
load_dotenv('.env.local')
from supabase import create_client

url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
service_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHZqZ3VsY2lwaGRxeXF1Y3h2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5NDgyOSwiZXhwIjoyMDc1NDcwODI5fQ.RI4GwUsqpq0Xi9oGhRgFjAk1i8gFnTYQTnLpUwfOpVA'

supabase = create_client(url, service_key)

# Address corrections with coordinates where provided
corrections = [
    {
        "name": "JENNI LASHES, BROWS ART & BEAUTY",
        "address": "15 Temple Terrace, Palmerston City NT 0830",
        "city": "Darwin"
    },
    {
        "name": "Golden Nails and Beauty Palmerston",
        "address": "10 Temple Terrace, Palmerston City NT 0830",
        "city": "Darwin"
    },
    {
        "name": "The Palm Nails and Beauty (next to Good Times Bar & Grill)",
        "address": "11 University Ave, Palmerston City NT 0830",
        "city": "Darwin",
        "lat": -12.4744,
        "lng": 130.9856
    },
    {
        "name": "Star's Nail Salon",
        "address": "19 Kitchener Drive, Darwin City, NT 0800",
        "city": "Darwin"
    },
    {
        "name": "Anjali Brow Studio Casuarina Square",
        "address": "247 Trower Rd, Casuarina NT 0810",
        "city": "Darwin"
    },
    {
        "name": "Unforgettable Salon",
        "address": "130 University Ave, Durack NT 0830",
        "city": "Darwin"
    },
    {
        "name": "Charms SPA Nails & Beauty Oasis",
        "address": "15 Temple Terrace, Palmerston City NT 0830",
        "city": "Darwin"
    },
    {
        "name": "Alina Huck Nails",
        "address": "122 McEvoy St, Alexandria NSW 2015",
        "city": "Sydney"
    },
    {
        "name": "Glossy Nails Alice Springs",
        "address": "91 Todd St, Alice Springs NT 0870",
        "city": "Alice Springs"
    },
    {
        "name": "Nails Boulevard Town Hall",
        "address": "436 George St, Sydney, New South Wales, 2000",
        "city": "Sydney"
    },
    {
        "name": "Nails By Phuong",
        "address": "70 Todd St, Alice Springs NT 0870",
        "city": "Alice Springs"
    },
    {
        "name": "Stay Classy By Helen SYDNEY",
        "address": "95 Bathurst St, Sydney NSW 2000",
        "city": "Sydney"
    },
    {
        "name": "W Nails",
        "address": "29 Dixon St, Haymarket NSW 2000",
        "city": "Sydney"
    },
    {
        "name": "AYU NAIL & BEAUTY",
        "address": "383 Pitt St, Sydney NSW 2000",
        "city": "Sydney"
    },
    {
        "name": "Vivid Nail Salon",
        "address": "90 Pitt St, Sydney NSW 2000",
        "city": "Sydney"
    },
    {
        "name": "BP Deluxe Nails & Beauty - Martin Place",
        "address": "108 King St, Sydney NSW 2000",
        "city": "Sydney"
    },
    {
        "name": "suminails",
        "address": "227 Elizabeth St, Sydney NSW 2000",
        "city": "Sydney"
    },
    {
        "name": "INSTYLE NAILS & BEAUTY - METCENTRE Wynyard station ( Previously BP Deluxe Nails)",
        "address": "273 George Street Sydney NSW 2000",
        "city": "Sydney"
    },
    {
        "name": "AOUO Press-On Nails & Manicure Salon",
        "address": "401 Sussex St, Haymarket NSW 2000",
        "city": "Sydney"
    },
    {
        "name": "MD nails and beauty",
        "address": "1 Dixon St, Sydney NSW 2000",
        "city": "Sydney"
    }
]

print(f"🔄 Updating {len(corrections)} salon addresses...\n")

updated = 0
failed = 0

for correction in corrections:
    try:
        # Find salon by name
        result = supabase.table('salons').select('id, name').eq('name', correction['name']).limit(1).execute()
        
        if result.data and len(result.data) > 0:
            salon_id = result.data[0]['id']
            
            # Prepare update data
            update_data = {'address': correction['address']}
            
            # Add coordinates if provided
            if 'lat' in correction and 'lng' in correction:
                update_data['latitude'] = correction['lat']
                update_data['longitude'] = correction['lng']
            else:
                # Clear coordinates so they can be re-geocoded
                update_data['latitude'] = None
                update_data['longitude'] = None
            
            # Update address
            update_result = supabase.table('salons').update(update_data).eq('id', salon_id).execute()
            
            if update_result.data:
                coord_status = f" (coords: {correction['lat']}, {correction['lng']})" if 'lat' in correction else " (coords cleared)"
                print(f"✅ {correction['name']}{coord_status}")
                updated += 1
            else:
                print(f"❌ Failed to update: {correction['name']}")
                failed += 1
        else:
            print(f"⚠️  Not found: {correction['name']}")
            failed += 1
            
    except Exception as e:
        print(f"❌ Error updating {correction['name']}: {str(e)}")
        failed += 1

print(f"\n{'='*60}")
print(f"✅ Updated: {updated}")
print(f"❌ Failed: {failed}")
print(f"{'='*60}")
