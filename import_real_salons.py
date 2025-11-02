#!/usr/bin/env python3
"""
Import real nail salon data from Excel file to Supabase
This script will:
1. Delete existing fake salon data
2. Import real data from Nail_Salons_Aus_250.xlsx
3. Create proper relationships and structure
"""

import pandas as pd
import sys
import os
import json
from dotenv import load_dotenv
import re
import unicodedata

# Load environment variables
load_dotenv('.env.local')

# Get Supabase credentials
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ Error: Supabase credentials not found in .env.local")
    print("\nPlease create .env.local with:")
    print("NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co")
    print("SUPABASE_SERVICE_ROLE_KEY=your_service_role_key")
    sys.exit(1)

# Install supabase-py if not available
try:
    from supabase import create_client, Client
except ImportError:
    print("Installing supabase-py...")
    os.system("pip install supabase -q")
    from supabase import create_client, Client

def slugify(text):
    """Convert text to URL-friendly slug"""
    if pd.isna(text):
        return ""
    text = str(text).lower()
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text).strip('-')
    return text

def clean_phone(phone):
    """Clean and format phone number"""
    if pd.isna(phone):
        return None
    phone = str(phone).strip()
    if not phone or phone == 'nan':
        return None
    return phone

def clean_website(website):
    """Clean and format website URL"""
    if pd.isna(website):
        return None
    website = str(website).strip()
    if not website or website == 'nan':
        return None
    if not website.startswith('http'):
        website = 'https://' + website
    return website

def parse_price_range(price_str):
    """Convert price range string to database format"""
    if pd.isna(price_str):
        return 'mid-range'
    
    price_str = str(price_str).strip()
    if '$$$' in price_str:
        return 'premium'
    elif '$$' in price_str:
        return 'mid-range'
    else:
        return 'budget'

def parse_hours(hours_str):
    """Parse operating hours"""
    if pd.isna(hours_str):
        return None
    
    # Simple parsing - can be enhanced
    return {
        "monday": {"open": "09:00", "close": "18:00"},
        "tuesday": {"open": "09:00", "close": "18:00"},
        "wednesday": {"open": "09:00", "close": "18:00"},
        "thursday": {"open": "09:00", "close": "18:00"},
        "friday": {"open": "09:00", "close": "18:00"},
        "saturday": {"open": "09:00", "close": "17:00"},
        "sunday": {"open": "10:00", "close": "16:00"}
    }

def parse_languages(row):
    """Extract languages spoken from the Excel columns"""
    languages = []
    language_columns = ['Basic English', 'Fluent English', 'Spanish', 'Vietnamese', 'Chinese', 'Korean']
    
    for lang_col in language_columns:
        if lang_col in row and not pd.isna(row[lang_col]) and row[lang_col]:
            lang_name = lang_col.replace(' English', '').replace('Fluent ', '').replace('Basic ', '')
            if lang_name == 'English':
                lang_name = 'English'
            languages.append(lang_name)
    
    return languages if languages else ['English']

def parse_specialties(row):
    """Extract specialties from the Excel columns"""
    specialties = []
    specialty_columns = [
        'Qualified technicians', 'Experienced Team', 'Quick Service',
        'Award winning staff', 'Master Nail Artist', 'Bridal Nails'
    ]
    
    for spec_col in specialty_columns:
        if spec_col in row and not pd.isna(row[spec_col]) and row[spec_col]:
            specialties.append(spec_col)
    
    return specialties

def parse_services(row):
    """Extract services offered from the Excel columns"""
    services = []
    service_columns = [
        'Gel Manicure', 'Gel X', 'Gel Extensions', 'Acrylic Nails',
        'Pedicure', 'Gel Pedicure', 'Dip Powder', 'Builders Gel',
        'Nail Art', 'Massage', 'Facials', 'Eyelashes', 'Brows',
        'Waxing', 'Hair cuts', 'Hand and Foot Treatment'
    ]
    
    for svc_col in service_columns:
        if svc_col in row and not pd.isna(row[svc_col]) and row[svc_col]:
            services.append(svc_col)
    
    return services

def main():
    print("=" * 80)
    print("🚀 NAIL SALON DATA IMPORT TOOL")
    print("=" * 80)
    
    # Initialize Supabase client
    print("\n📡 Connecting to Supabase...")
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        print("✅ Connected to Supabase")
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {e}")
        sys.exit(1)
    
    # Read Excel file
    print("\n📂 Reading Excel file: Nail_Salons_Aus_250.xlsx")
    try:
        df = pd.read_excel('Nail_Salons_Aus_250.xlsx', sheet_name=0)
        print(f"✅ Loaded {len(df)} rows from Excel")
    except Exception as e:
        print(f"❌ Failed to read Excel file: {e}")
        sys.exit(1)
    
    # Delete existing salon data
    print("\n🗑️  Deleting existing fake salon data...")
    try:
        result = supabase.table('salons').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        print(f"✅ Deleted existing salon data")
    except Exception as e:
        print(f"⚠️  Warning: Could not delete existing data: {e}")
    
    # Get the free tier ID
    print("\n🎫 Getting vendor tier information...")
    try:
        tier_result = supabase.table('vendor_tiers').select('*').eq('name', 'free').execute()
        if tier_result.data:
            free_tier_id = tier_result.data[0]['id']
            print(f"✅ Found free tier ID: {free_tier_id}")
        else:
            print("❌ Free tier not found in database. Please run SUPABASE_COMPLETE_SETUP.sql first")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Failed to get tier information: {e}")
        sys.exit(1)
    
    # Process and import salons
    print(f"\n📥 Importing {len(df)} salons...")
    success_count = 0
    error_count = 0
    
    for idx, row in df.iterrows():
        try:
            # Extract basic information
            name = str(row['name']) if not pd.isna(row['name']) else f"Salon {idx+1}"
            slug = slugify(name) + f"-{idx}"
            
            # Parse address components
            address = str(row['address']) if not pd.isna(row['address']) else ""
            city = str(row['City']) if not pd.isna(row['City']) else ""
            state = str(row['state']) if not pd.isna(row['state']) else ""
            postal_code = str(row['Postcode']) if not pd.isna(row['Postcode']) else ""
            
            # Create salon object
            salon_data = {
                'tier_id': free_tier_id,
                'name': name,
                'slug': slug,
                'description': str(row['description']) if not pd.isna(row['description']) else None,
                'address': address,
                'city': city,
                'state': state,
                'country': 'Australia',
                'postal_code': postal_code,
                'latitude': -33.8688,  # Default Sydney coordinates - should geocode in production
                'longitude': 151.2093,
                'phone': clean_phone(row['phone']) if 'phone' in row else None,
                'website': clean_website(row['website']) if 'website' in row else None,
                'price_range': parse_price_range(row['Price ($-$$$)']) if 'Price ($-$$$)' in row else 'mid-range',
                'currency': 'AUD',
                'specialties': parse_specialties(row),
                'services_offered': parse_services(row),
                'languages_spoken': parse_languages(row),
                'accepts_walk_ins': bool(row['Walk-ins Welcome']) if 'Walk-ins Welcome' in row and not pd.isna(row['Walk-ins Welcome']) else True,
                'parking_available': bool(row['Parking']) if 'Parking' in row and not pd.isna(row['Parking']) else False,
                'operating_hours': parse_hours(row['workday_timing']) if 'workday_timing' in row else None,
                'is_published': True,
                'is_verified': False,
                'is_featured': False,
                'view_count': 0,
                'contact_form_submissions': 0
            }
            
            # Insert salon
            result = supabase.table('salons').insert(salon_data).execute()
            
            if result.data:
                success_count += 1
                if success_count % 10 == 0:
                    print(f"  ✅ Imported {success_count} salons...")
            else:
                error_count += 1
                print(f"  ❌ Failed to import: {name}")
                
        except Exception as e:
            error_count += 1
            print(f"  ❌ Error importing salon {idx+1}: {e}")
            continue
    
    # Final summary
    print("\n" + "=" * 80)
    print("📊 IMPORT SUMMARY")
    print("=" * 80)
    print(f"✅ Successfully imported: {success_count} salons")
    print(f"❌ Failed to import: {error_count} salons")
    print(f"📝 Total processed: {len(df)} salons")
    print("=" * 80)
    print("\n🎉 Import complete!")

if __name__ == "__main__":
    main()
