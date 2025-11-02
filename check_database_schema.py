#!/usr/bin/env python3
"""
Check what tables exist in the Supabase database
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

print("=" * 80)
print("🔍 DATABASE SCHEMA INSPECTION")
print("=" * 80)

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    # List of tables to check
    tables_to_check = [
        'salons',
        'vendor_tiers',
        'vendor_applications',
        'service_categories',
        'service_types',
        'salon_services',
        'reviews',
        'users'
    ]
    
    print("\n📊 Checking which tables exist:\n")
    
    existing_tables = []
    for table in tables_to_check:
        try:
            result = supabase.table(table).select('*').limit(1).execute()
            count = len(result.data)
            existing_tables.append(table)
            print(f"  ✅ {table} - EXISTS")
            
            # Get row count
            try:
                count_result = supabase.table(table).select('*', count='exact').execute()
                row_count = count_result.count if hasattr(count_result, 'count') else 'Unknown'
                print(f"     └─ Rows: {row_count}")
            except:
                pass
                
        except Exception as e:
            error_msg = str(e)
            if 'PGRST205' in error_msg or 'not find' in error_msg:
                print(f"  ❌ {table} - DOES NOT EXIST")
            else:
                print(f"  ⚠️  {table} - ERROR: {str(e)[:60]}")
    
    print("\n" + "=" * 80)
    print(f"📋 Summary: Found {len(existing_tables)} existing tables")
    print("=" * 80)
    
    if existing_tables:
        print("\n🔍 Inspecting 'salons' table structure:")
        try:
            result = supabase.table('salons').select('*').limit(1).execute()
            if result.data:
                sample = result.data[0]
                print(f"\n   Columns found:")
                for key in sample.keys():
                    print(f"     - {key}: {type(sample[key]).__name__}")
            else:
                print("   No data in salons table yet")
        except Exception as e:
            print(f"   Error: {e}")
            
except Exception as e:
    print(f"❌ Connection failed: {e}")
