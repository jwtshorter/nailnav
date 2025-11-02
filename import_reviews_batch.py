#!/usr/bin/env python3
"""
Import real reviews from Excel file to Supabase (BATCH VERSION)
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
    """Parse review text with rating"""
    if pd.isna(review_text):
        return None, None
    
    text = str(review_text).strip()
    rating_match = re.match(r'rating\s+(\d+(?:\.\d+)?)\s*:\s*(.*)', text, re.IGNORECASE)
    
    if rating_match:
        rating = float(rating_match.group(1))
        content = rating_match.group(2).strip()
        return rating, content
    
    return 5.0, text

def generate_reviewer_name():
    """Generate a reviewer name"""
    adjectives = ['Happy', 'Satisfied', 'Regular', 'Valued', 'Loyal', 'Delighted', 'Pleased']
    nouns = ['Customer', 'Client', 'Visitor', 'Patron', 'Guest']
    return f"{random.choice(adjectives)} {random.choice(nouns)}"

def main():
    print("=" * 80)
    print("🌟 IMPORTING REAL REVIEWS (BATCH MODE)")
    print("=" * 80)
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    print("\n📂 Reading Excel file...")
    df = pd.read_excel('Nail_Salons_Aus_250.xlsx', sheet_name=0)
    print(f"✅ Loaded {len(df)} salons")
    
    print("\n🔍 Mapping salons...")
    salons_result = supabase.table('salons').select('id, name').execute()
    salon_map = {salon['name']: salon['id'] for salon in salons_result.data}
    print(f"✅ Found {len(salon_map)} salons")
    
    # Prepare batch reviews
    print("\n📋 Preparing reviews...")
    review_cols = [col for col in df.columns if col.startswith('Review  ')]
    all_reviews = []
    
    for idx, row in df.iterrows():
        salon_name = row['name']
        if salon_name not in salon_map:
            continue
        
        salon_id = salon_map[salon_name]
        
        # Limit to first 5 reviews per salon for speed
        for i, review_col in enumerate(review_cols[:5], 1):
            review_text = row[review_col]
            
            if pd.isna(review_text):
                continue
            
            rating, content = parse_review_text(review_text)
            
            if not content or len(content) < 10:
                continue
            
            all_reviews.append({
                'salon_id': salon_id,
                'rating': min(5.0, max(1.0, rating)),
                'content': content[:1000],
                'reviewer_name': generate_reviewer_name(),
                'is_verified': random.random() > 0.3,
                'is_published': True,
                'is_moderated': True,
                'helpful_count': random.randint(0, 15),
                'created_at': (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat()
            })
    
    print(f"✅ Prepared {len(all_reviews)} reviews")
    
    # Import in batches of 100
    print(f"\n📥 Importing in batches of 100...")
    batch_size = 100
    total_imported = 0
    
    for i in range(0, len(all_reviews), batch_size):
        batch = all_reviews[i:i+batch_size]
        try:
            supabase.table('reviews').insert(batch).execute()
            total_imported += len(batch)
            print(f"  ✅ Imported {total_imported}/{len(all_reviews)} reviews...")
        except Exception as e:
            print(f"  ⚠️  Batch {i//batch_size + 1} error: {str(e)[:100]}")
    
    print("\n" + "=" * 80)
    print("📊 IMPORT COMPLETE")
    print("=" * 80)
    print(f"✅ Imported: {total_imported} reviews")
    print(f"📝 Average per salon: {total_imported / len(salon_map):.1f} reviews")
    print("=" * 80)
    
    # Verify
    result = supabase.table('reviews').select('*', count='exact').execute()
    count = result.count if hasattr(result, 'count') else len(result.data)
    print(f"\n✅ Total reviews in database: {count}")
    print("\n🎉 Done!")

if __name__ == "__main__":
    main()
