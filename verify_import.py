#!/usr/bin/env python3
"""
Verify the imported salon data
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

print("=" * 80)
print("✅ IMPORT VERIFICATION")
print("=" * 80)

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    # Get total count
    result = supabase.table('salons').select('*', count='exact').execute()
    total = result.count if hasattr(result, 'count') else len(result.data)
    
    print(f"\n📊 Total salons in database: {total}")
    
    # Get sample data
    sample = supabase.table('salons').select('name, city_id, address, phone, rating').limit(5).execute()
    
    print("\n📋 Sample salons:\n")
    for salon in sample.data:
        print(f"   • {salon['name']}")
        print(f"     Address: {salon['address']}")
        print(f"     Phone: {salon['phone']}")
        print(f"     Rating: {salon['rating']}⭐")
        print()
    
    # Statistics
    print("=" * 80)
    print("📈 STATISTICS")
    print("=" * 80)
    
    # Published salons
    published = supabase.table('salons').select('id', count='exact').eq('is_published', True).execute()
    pub_count = published.count if hasattr(published, 'count') else len(published.data)
    print(f"✅ Published salons: {pub_count}")
    
    # Services statistics
    with_manicure = supabase.table('salons').select('id', count='exact').eq('manicure', True).execute()
    man_count = with_manicure.count if hasattr(with_manicure, 'count') else len(with_manicure.data)
    print(f"💅 Offering manicures: {man_count}")
    
    with_pedicure = supabase.table('salons').select('id', count='exact').eq('pedicure', True).execute()
    ped_count = with_pedicure.count if hasattr(with_pedicure, 'count') else len(with_pedicure.data)
    print(f"🦶 Offering pedicures: {ped_count}")
    
    with_acrylic = supabase.table('salons').select('id', count='exact').eq('acrylic_nails', True).execute()
    acr_count = with_acrylic.count if hasattr(with_acrylic, 'count') else len(with_acrylic.data)
    print(f"✨ Offering acrylic nails: {acr_count}")
    
    # Amenities
    with_parking = supabase.table('salons').select('id', count='exact').eq('parking', True).execute()
    park_count = with_parking.count if hasattr(with_parking, 'count') else len(with_parking.data)
    print(f"🅿️  With parking: {park_count}")
    
    with_walkins = supabase.table('salons').select('id', count='exact').eq('accepts_walk_ins', True).execute()
    walk_count = with_walkins.count if hasattr(with_walkins, 'count') else len(with_walkins.data)
    print(f"🚶 Accepting walk-ins: {walk_count}")
    
    print("\n" + "=" * 80)
    print("✅ VERIFICATION COMPLETE!")
    print("=" * 80)
    print("\n🎯 Your database now contains real Australian nail salon data!")
    print("🌐 Visit your Supabase dashboard to explore the data:")
    print("   https://supabase.com/dashboard/project/bmlvjgulciphdqyqucxv/editor")
    
except Exception as e:
    print(f"❌ Error: {e}")
