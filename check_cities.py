import os
from supabase import create_client

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase = create_client(url, key)

# Get all cities
result = supabase.table('cities').select('id, name').limit(100).execute()
print(f"Total cities: {len(result.data)}")
for city in sorted(result.data, key=lambda x: x['name']):
    print(f"  {city['name']}")

# Get count by city
print("\nSalons per city:")
salons_result = supabase.table('salons').select('city_id, cities(name)', count='exact').eq('is_published', True).execute()
city_counts = {}
for salon in salons_result.data:
    city_name = salon.get('cities', {}).get('name') if salon.get('cities') else None
    if city_name:
        city_counts[city_name] = city_counts.get(city_name, 0) + 1

for city, count in sorted(city_counts.items(), key=lambda x: -x[1])[:20]:
    print(f"  {city}: {count} salons")
