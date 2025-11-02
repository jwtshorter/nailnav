#!/usr/bin/env python3
"""
Test Supabase connection with current credentials
"""
import os
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

print("=" * 80)
print("🔍 SUPABASE CONNECTION TEST")
print("=" * 80)
print(f"\n📡 Supabase URL: {SUPABASE_URL}")
print(f"🔑 Service Key (first 20 chars): {SUPABASE_SERVICE_KEY[:20] if SUPABASE_SERVICE_KEY else 'NOT SET'}...")
print(f"🔑 Service Key length: {len(SUPABASE_SERVICE_KEY) if SUPABASE_SERVICE_KEY else 0} characters")

try:
    from supabase import create_client, Client
    
    print("\n📡 Testing connection...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    # Try to fetch vendor tiers
    result = supabase.table('vendor_tiers').select('*').execute()
    
    if result.data:
        print(f"✅ Connection successful!")
        print(f"✅ Found {len(result.data)} vendor tiers:")
        for tier in result.data:
            print(f"   - {tier.get('display_name', tier.get('name'))}")
    else:
        print("⚠️ Connected but no data returned")
        
except Exception as e:
    print(f"❌ Connection failed: {e}")
    print("\n💡 Tips:")
    print("   1. Make sure your service role key is the FULL JWT token")
    print("   2. It should start with 'eyJ' and be very long (200+ characters)")
    print("   3. Get it from: https://supabase.com/dashboard/project/bmlvjgulciphdqyqucxv/settings/api")
    print("   4. Look for 'service_role' key under 'Project API keys'")
