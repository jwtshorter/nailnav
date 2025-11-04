import os
import time
import re
from dotenv import load_dotenv
load_dotenv('.env.local')
from supabase import create_client
import requests

url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
service_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHZqZ3VsY2lwaGRxeXF1Y3h2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5NDgyOSwiZXhwIjoyMDc1NDcwODI5fQ.RI4GwUsqpq0Xi9oGhRgFjAk1i8gFnTYQTnLpUwfOpVA'

supabase = create_client(url, service_key)

def clean_address(address):
    """Clean address by removing shop numbers, unit numbers, and complex prefixes"""
    if not address:
        return address
    
    # Remove patterns like "Shop 31/", "147/", "Unit 5/", "Kiosk K25/", etc.
    # This regex matches: optional word (Shop, Unit, etc.) + optional space + number/letter + /
    address = re.sub(r'(?:(?:Shop|Unit|Kiosk|Suite|Level|Store)\s+)?[A-Za-z0-9]+/', '', address, flags=re.IGNORECASE)
    
    # Remove standalone shop/unit references like "Shop 31" at the start
    address = re.sub(r'^(?:Shop|Unit|Kiosk|Suite|Level|Store)\s+[A-Za-z0-9]+,?\s*', '', address, flags=re.IGNORECASE)
    
    # Remove "Shopping Centre" or "Shopping Center" - too generic
    address = re.sub(r'\s*,?\s*Shopping\s+Cen(?:ter|tre)\s*,?', '', address, flags=re.IGNORECASE)
    
    # Clean up multiple commas or spaces
    address = re.sub(r'\s*,\s*,\s*', ', ', address)
    address = re.sub(r'\s+', ' ', address)
    address = address.strip(', ')
    
    return address

def geocode_address(address, city, state, country='Australia'):
    """Geocode an address using Nominatim (free OpenStreetMap service)"""
    try:
        # Clean the address first
        cleaned_address = clean_address(address)
        
        # Build full address
        full_address = f"{cleaned_address}, {city}, {state}, {country}"
        
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
                return lat, lng, cleaned_address
        
        return None, None, cleaned_address
    except Exception as e:
        print(f"  ✗ Geocoding error: {str(e)[:50]}")
        return None, None, cleaned_address

# Get salons WITHOUT coordinates
print("Fetching salons without coordinates from database...")
result = supabase.table('salons').select('id, name, address, cities(name), state').eq('is_published', True).execute()
all_salons = result.data

# Filter for salons without coordinates
salons = [s for s in all_salons if not s.get('latitude') or not s.get('longitude') or s['latitude'] == 0 or s['longitude'] == 0]

print(f"\n🗺️  Found {len(salons)} salons without coordinates")
print(f"⏱️  Rate limit: 1 request per second (Nominatim free tier)")
print(f"⏱️  Estimated time: ~{int(len(salons) / 60) + 1} minutes\n")

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
    
    cleaned = clean_address(address)
    print(f"{idx}/{len(salons)} 📍 Geocoding: {name} ({city})...")
    if cleaned != address:
        print(f"  🧹 Cleaned: '{address}' → '{cleaned}'")
    
    lat, lng, cleaned_addr = geocode_address(address, city, state or '')
    
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
print(f"📊 Total now with coordinates: {102 + geocoded}")
print(f"{'='*60}")
