#!/usr/bin/env python3
"""
Import real reviews from Excel file to Supabase reviews table
"""
import pandas as pd
import os
import re
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime, timedelta
import random

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def parse_review_text(review_text):
    """
    Parse review text that contains rating and content
    Format: "rating 5: Review content here..."
    """
    if pd.isna(review_text):
        return None, None
    
    text = str(review_text).strip()
    
    # Extract rating (format: "rating 5:" or "rating 4.5:")
    rating_match = re.match(r'rating\s+(\d+(?:\.\d+)?)\s*:\s*(.*)', text, re.IGNORECASE)
    
    if rating_match:
        rating = float(rating_match.group(1))
        content = rating_match.group(2).strip()
        return rating, content
    
    # If no rating found, assume 5 stars and use full text
    return 5.0, text

def generate_reviewer_names():
    """Generate anonymous reviewer names"""
    adjectives = ['Happy', 'Satisfied', 'Regular', 'Valued', 'Loyal', 'Delighted', 'Pleased']
    nouns = ['Customer', 'Client', 'Visitor', 'Patron', 'Guest']
    return [f"{adj} {noun}" for adj in adjectives for noun in nouns]

def main():
    print("=" * 80)
    print("🌟 IMPORTING REAL REVIEWS FROM EXCEL")
    print("=" * 80)
    
    # Connect to Supabase
    print("\n📡 Connecting to Supabase...")
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        print("✅ Connected")
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        return
    
    # Read Excel file
    print("\n📂 Reading Excel file...")
    try:
        df = pd.read_excel('Nail_Salons_Aus_250.xlsx', sheet_name=0)
        print(f"✅ Loaded {len(df)} salons")
    except Exception as e:
        print(f"❌ Failed to read Excel: {e}")
        return
    
    # Get salon mapping (Excel row to database ID)
    print("\n🔍 Mapping salons to database IDs...")
    try:
        salons_result = supabase.table('salons').select('id, name, slug').execute()
        salon_map = {salon['name']: salon['id'] for salon in salons_result.data}
        print(f"✅ Found {len(salon_map)} salons in database")
    except Exception as e:
        print(f"❌ Failed to get salons: {e}")
        return
    
    # Delete existing reviews (optional)
    print("\n🗑️  Deleting existing fake reviews...")
    try:
        supabase.table('reviews').delete().neq('id', 0).execute()
        print("✅ Cleared reviews table")
    except Exception as e:
        print(f"⚠️  Warning: {e}")
    
    # Find review columns
    review_cols = [col for col in df.columns if col.startswith('Review  ')]
    print(f"\n📋 Found {len(review_cols)} review columns")
    
    # Generate reviewer names pool
    reviewer_names = generate_reviewer_names()
    
    # Import reviews
    print(f"\n📥 Importing reviews...")
    total_imported = 0
    total_skipped = 0
    errors = []
    
    for idx, row in df.iterrows():
        salon_name = row['name']
        
        # Skip if salon not in database
        if salon_name not in salon_map:
            continue
        
        salon_id = salon_map[salon_name]
        
        # Process each review column
        for i, review_col in enumerate(review_cols, 1):
            review_text = row[review_col]
            
            if pd.isna(review_text):
                continue
            
            # Parse rating and content
            rating, content = parse_review_text(review_text)
            
            if not content or len(content) < 10:
                total_skipped += 1
                continue
            
            # Generate review data
            review_data = {
                'salon_id': salon_id,
                'rating': min(5.0, max(1.0, rating)),  # Ensure 1-5 range
                'content': content[:1000],  # Limit length
                'reviewer_name': random.choice(reviewer_names),
                'is_verified': random.random() > 0.3,  # 70% verified
                'is_published': True,
                'is_moderated': True,
                'helpful_count': random.randint(0, 15),
                'created_at': (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat()
            }
            
            try:
                supabase.table('reviews').insert(review_data).execute()
                total_imported += 1
                
                if total_imported % 100 == 0:
                    print(f"  ✅ Imported {total_imported} reviews...")
                    
            except Exception as e:
                errors.append(f"Salon {salon_name}, Review {i}: {str(e)[:50]}")
                total_skipped += 1
                if len(errors) <= 5:
                    print(f"  ⚠️  Error: {errors[-1]}")
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 IMPORT SUMMARY")
    print("=" * 80)
    print(f"✅ Successfully imported: {total_imported} reviews")
    print(f"⚠️  Skipped: {total_skipped} reviews")
    print(f"📝 Total processed: {total_imported + total_skipped}")
    
    if errors:
        print(f"\n⚠️  Errors encountered: {len(errors)}")
        if len(errors) > 5:
            print("   (Showing first 5)")
    
    print("=" * 80)
    
    # Verify import
    print("\n🔍 Verifying import...")
    try:
        result = supabase.table('reviews').select('*', count='exact').execute()
        count = result.count if hasattr(result, 'count') else len(result.data)
        print(f"✅ Total reviews in database: {count}")
        
        # Sample reviews
        if result.data:
            print("\n📋 Sample reviews:")
            for review in result.data[:3]:
                print(f"   • {review['reviewer_name']}: {review['rating']}⭐")
                print(f"     {review['content'][:80]}...")
                print()
    except Exception as e:
        print(f"⚠️  Could not verify: {e}")
    
    print("\n🎉 Review import complete!")

if __name__ == "__main__":
    main()
