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

def extract_street_address(address):
    """
    Extract the actual street address from complex format.
    Strategy: Look for pattern "NUMBER STREET_NAME" and extract that portion.
    
    Examples:
    - "Oasis shopping village, T30, 15 Temple Terrace, Palmerston" → "15 Temple Terrace"
    - "Shop 53/10 Temple Terrace, Palmerston City" → "10 Temple Terrace"
    - "Shop 5 mascot arcade, 1205 Botany Rd, Mascot NSW 2020" → "1205 Botany Rd"
    - "35/112-122A McEvoy St, Alexandria NSW 2015" → "122A McEvoy St"
    """
    if not address:
        return address
    
    # Split by commas to get parts
    parts = [p.strip() for p in address.split(',')]
    
    # Look for parts that start with a number followed by a street name
    # Pattern: number (possibly with letters/dashes) followed by street name/type
    street_pattern = r'^\d+[A-Za-z]?(?:-\d+[A-Za-z]?)?\s+[A-Za-z]'
    
    for part in parts:
        # Remove common prefixes first
        cleaned_part = part
        
        # Remove shop/unit prefixes like "Shop 5", "Unit 3A", etc.
        cleaned_part = re.sub(r'^(?:Shop|Unit|Kiosk|Suite|Level|Store|Building)\s+[A-Za-z0-9]+\s+', '', cleaned_part, flags=re.IGNORECASE)
        
        # Remove patterns like "35/" or "T30," or "LG1/" from the start
        cleaned_part = re.sub(r'^[A-Za-z0-9]+[,/]\s*', '', cleaned_part)
        
        # Check if this part matches street address pattern
        if re.match(street_pattern, cleaned_part):
            # Extract just the street number and name (before any suburb/state)
            # Stop at NSW, NT, VIC, QLD, etc.
            match = re.match(r'^(\d+[A-Za-z]?(?:-\d+[A-Za-z]?)?\s+(?:[A-Za-z]+\s+)*(?:St|Street|Rd|Road|Ave|Avenue|Dr|Drive|Parade|Terrace|Blvd|Boulevard|Pl|Place|Ct|Court|Lane|La|Way|Crescent|Cres))\b', cleaned_part, re.IGNORECASE)
            if match:
                return match.group(1).strip()
    
    # If no clear street address found, apply basic cleaning
    cleaned = address
    
    # Remove everything before the last comma that comes before a number
    # This handles cases like "corner of Pitt and, Shop 26 level M, Myer Market St"
    match = re.search(r',\s*(\d+.*)', cleaned)
    if match:
        cleaned = match.group(1)
    
    # Remove shop/unit numbers with slashes
    cleaned = re.sub(r'(?:(?:Shop|Unit|Kiosk|Suite|Level|Store)\s+)?[A-Za-z0-9]+/', '', cleaned, flags=re.IGNORECASE)
    
    # Remove level designations like "Level 12 number 1216"
    cleaned = re.sub(r'\s+Level\s+\d+\s+number\s+\d+', '', cleaned, flags=re.IGNORECASE)
    
    # Remove "Shopping Centre" or similar
    cleaned = re.sub(r'\s*,?\s*Shopping\s+(?:Cen(?:ter|tre)|Village|Mall|Arcade)\s*,?', '', cleaned, flags=re.IGNORECASE)
    
    # Remove building/complex names at start (before comma)
    cleaned = re.sub(r'^[A-Za-z\s]+(?:Arcade|Centre|Center|Plaza|Tower|Towers|Building|Mall|Village),\s*', '', cleaned, flags=re.IGNORECASE)
    
    # Remove Westfield prefix
    cleaned = re.sub(r'^Westfield,\s*Shop\s+\d+,\s*', '', cleaned, flags=re.IGNORECASE)
    
    # Clean up
    cleaned = re.sub(r'\s*,\s*,\s*', ', ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned)
    cleaned = cleaned.strip(', ')
    
    return cleaned

def geocode_address(address, city, state, country='Australia'):
    """Geocode an address using Nominatim (free OpenStreetMap service)"""
    try:
        # Extract the street address
        street_address = extract_street_address(address)
        
        # Build full address
        full_address = f"{street_address}, {city}, {state}, {country}"
        
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
                return lat, lng, street_address
        
        return None, None, street_address
    except Exception as e:
        print(f"  ✗ Geocoding error: {str(e)[:50]}")
        return None, None, extract_street_address(address)

# Get salons WITHOUT coordinates
print("Fetching salons without coordinates from database...")
result = supabase.table('salons').select('id, name, address, cities(name), state').eq('is_published', True).execute()
all_salons = result.data

# Filter for salons without coordinates (None values)
salons = [s for s in all_salons if s.get('latitude') is None or s.get('longitude') is None]

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
    
    extracted = extract_street_address(address)
    print(f"{idx}/{len(salons)} 📍 Geocoding: {name} ({city})...")
    if extracted != address:
        print(f"  🔍 Extracted: '{address}'")
        print(f"           → '{extracted}'")
    
    lat, lng, street_addr = geocode_address(address, city, state or '')
    
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
print(f"📊 Total with coordinates: {len(all_salons) - len(salons) + geocoded}")
print(f"📊 Success rate: {((len(all_salons) - len(salons) + geocoded) * 100 // len(all_salons))}%")
print(f"{'='*60}")
