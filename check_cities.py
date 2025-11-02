#!/usr/bin/env python3
"""
Check what cities exist in the database
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

print("=" * 80)
print("🏙️  CHECKING CITIES TABLE")
print("=" * 80)

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    # Try to get cities
    print("\n📊 Fetching cities from database...")
    result = supabase.table('cities').select('*').execute()
    
    if result.data:
        print(f"✅ Found {len(result.data)} cities:\n")
        for city in result.data[:20]:  # Show first 20
            print(f"   ID: {city.get('id')} - {city.get('name')} ({city.get('state', 'N/A')})")
        
        if len(result.data) > 20:
            print(f"\n   ... and {len(result.data) - 20} more cities")
    else:
        print("⚠️  No cities found in database")
        
except Exception as e:
    error_str = str(e)
    if 'PGRST205' in error_str or 'not find' in error_str:
        print("❌ Cities table does not exist!")
        print("\n💡 Solution: We need to either:")
        print("   1. Create city_id = NULL (if the column allows NULL)")
        print("   2. Create cities first based on Excel data")
        print("   3. Disable the foreign key constraint temporarily")
    else:
        print(f"❌ Error: {e}")
