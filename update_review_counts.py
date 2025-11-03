#!/usr/bin/env python3
"""
Update salon review counts from Excel file
"""

import pandas as pd
import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv('.env.local')

# Get Supabase credentials
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def main():
    print("=" * 80)
    print("🔄 UPDATING SALON REVIEW COUNTS")
    print("=" * 80)
    
    # Read Excel file
    print("\n📂 Reading Excel file...")
    df = pd.read_excel('Nail_Salons_Aus_250.xlsx')
    print(f"✅ Loaded {len(df)} salons from Excel")
    
    # Connect to Supabase
    print("\n📡 Connecting to Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    print("✅ Connected")
    
    # Get all salons from database
    print("\n📊 Fetching salons from database...")
    result = supabase.table('salons').select('id, name').execute()
    db_salons = {salon['name'].lower().strip(): salon['id'] for salon in result.data}
    print(f"✅ Found {len(db_salons)} salons in database")
    
    # Update review counts
    print("\n🔄 Updating review counts...")
    updated = 0
    skipped = 0
    
    for idx, row in df.iterrows():
        name = str(row['name']).lower().strip()
        review_count = int(row['reviews']) if not pd.isna(row['reviews']) else 0
        
        if name in db_salons:
            salon_id = db_salons[name]
            try:
                supabase.table('salons').update({
                    'review_count': review_count
                }).eq('id', salon_id).execute()
                updated += 1
                if updated % 25 == 0:
                    print(f"  ✅ Updated {updated} salons...")
            except Exception as e:
                print(f"  ❌ Error updating {row['name']}: {e}")
                skipped += 1
        else:
            skipped += 1
    
    print("\n" + "=" * 80)
    print("📊 UPDATE SUMMARY")
    print("=" * 80)
    print(f"✅ Updated: {updated} salons")
    print(f"⏭️  Skipped: {skipped} salons")
    print("=" * 80)

if __name__ == "__main__":
    main()
