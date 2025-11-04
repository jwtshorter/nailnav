import os
import time
from dotenv import load_dotenv
load_dotenv('.env.local')
from supabase import create_client
import requests

url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
service_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHZqZ3VsY2lwaGRxeXF1Y3h2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5NDgyOSwiZXhwIjoyMDc1NDcwODI5fQ.RI4GwUsqpq0Xi9oGhRgFjAk1i8gFnTYQTnLpUwfOpVA'

supabase = create_client(url, service_key)

def geocode_address(address, city, state, country='Australia'):
    """Geocode an address using Nominatim (free OpenStreetMap service)"""
    try:
        # Build full address
        full_address = f"{address}, {city}, {state}, {country}"
        
        # Nominatim API (free, but rate limited to 1 request per second)
        nominatim_url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': full_address,
            'format': 'json',
            'limit': 1
        }
        headers = {
            'User-Agent': 'NailNav Directory App (contact@nailnav.com)'
        }
        
        response = requests.get(nominatim_url, params=params, headers=headers, timeout=10)
        
        if response.status_code == 200:
            results = response.json()
            if results and len(results) > 0:
                lat = float(results[0]['lat'])
                lng = float(results[0]['lon'])
                return lat, lng
        
        return None, None
    except Exception as e:
        print(f"  ✗ Geocoding error: {str(e)[:50]}")
        return None, None

# Get all salons
print("Fetching salons from database...")
result = supabase.table('salons').select('id, name, address, cities(name), state').eq('is_published', True).execute()
salons = result.data

print(f"\n🗺️  Starting geocoding for {len(salons)} salons...")
print("⏱️  Rate limit: 1 request per second (Nominatim free tier)")
print("⏱️  Estimated time: ~{} minutes\n".format(int(len(salons) / 60) + 1))

geocoded = 0
failed = 0
skipped = 0

for idx, salon in enumerate(salons, 1):
    salon_id = salon['id']
    name = salon['name']
    address = salon['address']
    city = salon.get('cities', {}).get('name') if salon.get('cities') else None
    state = salon.get('state')
    
    if not address or not city:
        print(f"{idx}/{len(salons)} ⊘ {name}: Missing address/city")
        skipped += 1
        continue
    
    print(f"{idx}/{len(salons)} 📍 Geocoding: {name} ({city})...")
    
    lat, lng = geocode_address(address, city, state or '')
    
    if lat and lng:
        # Update database
        update_result = supabase.table('salons').update({
            'latitude': lat,
            'longitude': lng
        }).eq('id', salon_id).execute()
        
        if update_result.data:
            print(f"  ✓ Success: {lat:.4f}, {lng:.4f}")
            geocoded += 1
        else:
            print(f"  ✗ DB update failed")
            failed += 1
    else:
        print(f"  ✗ Could not geocode")
        failed += 1
    
    # Rate limit: 1 request per second for Nominatim
    if idx < len(salons):
        time.sleep(1.1)

print(f"\n{'='*60}")
print(f"✅ Successfully geocoded: {geocoded}")
print(f"❌ Failed: {failed}")
print(f"⊘ Skipped (no address): {skipped}")
print(f"{'='*60}")

