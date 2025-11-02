#!/usr/bin/env python3
"""
Import real nail salon data from Excel file to Supabase
This version properly handles city_id foreign key constraint
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
    sys.exit(1)

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

def parse_hours(hours_str, closed_on_str=None):
    """Parse operating hours into JSON format"""
    if pd.isna(hours_str):
        return {
            "monday": "9:00 AM - 6:00 PM",
            "tuesday": "9:00 AM - 6:00 PM",
            "wednesday": "9:00 AM - 6:00 PM",
            "thursday": "9:00 AM - 6:00 PM",
            "friday": "9:00 AM - 6:00 PM",
            "saturday": "9:00 AM - 5:00 PM",
            "sunday": "10:00 AM - 4:00 PM"
        }
    
    # Simple default for now
    return {
        "monday": str(hours_str),
        "tuesday": str(hours_str),
        "wednesday": str(hours_str),
        "thursday": str(hours_str),
        "friday": str(hours_str),
        "saturday": str(hours_str),
        "sunday": "Closed" if closed_on_str and 'sunday' in str(closed_on_str).lower() else str(hours_str)
    }

def bool_value(value):
    """Convert Excel value to boolean"""
    if pd.isna(value):
        return False
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value > 0
    if isinstance(value, str):
        return value.strip().lower() in ['yes', 'true', '1', 'x']
    return bool(value)

def get_city_id_mapping(supabase):
    """Create a mapping of city names to IDs"""
    print("\n🏙️  Loading cities from database...")
    try:
        result = supabase.table('cities').select('*').execute()
        
        city_map = {}
        for city in result.data:
            city_name = city.get('name', '').lower()
            city_id = city.get('id')
            city_map[city_name] = city_id
        
        print(f"✅ Loaded {len(city_map)} cities")
        return city_map
    except Exception as e:
        print(f"❌ Failed to load cities: {e}")
        return {}

def find_city_id(city_name, city_map):
    """Find the best matching city ID"""
    if pd.isna(city_name):
        return 2  # Default to Sydney
    
    city_name_clean = str(city_name).strip().lower()
    
    # Exact match
    if city_name_clean in city_map:
        return city_map[city_name_clean]
    
    # Partial match
    for db_city, city_id in city_map.items():
        if city_name_clean in db_city or db_city in city_name_clean:
            return city_id
    
    # Default to Sydney if no match
    return 2

def create_missing_cities(supabase, df):
    """Create any missing cities from the Excel data"""
    print("\n🏙️  Checking for missing cities...")
    
    # Get existing cities
    result = supabase.table('cities').select('name').execute()
    existing_cities = {city['name'].lower() for city in result.data}
    
    # Get unique cities from Excel
    excel_cities = df['City'].dropna().unique()
    
    new_cities = []
    for city in excel_cities:
        city_clean = str(city).strip()
        if city_clean.lower() not in existing_cities:
            new_cities.append({'name': city_clean})
    
    if new_cities:
        print(f"   Found {len(new_cities)} new cities to add")
        try:
            result = supabase.table('cities').insert(new_cities).execute()
            print(f"   ✅ Added {len(new_cities)} new cities")
        except Exception as e:
            print(f"   ⚠️  Could not add cities: {e}")
    else:
        print("   ✅ All cities already exist")

def main():
    print("=" * 80)
    print("🚀 NAIL SALON DATA IMPORT TOOL V3")
    print("=" * 80)
    
    # Initialize Supabase client
    print("\n📡 Connecting to Supabase...")
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        print("✅ Connected to Supabase")
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {e}")
        sys.exit(1)
    
    # Check current salon count
    print("\n📊 Checking current database state...")
    try:
        current = supabase.table('salons').select('*', count='exact').execute()
        current_count = current.count if hasattr(current, 'count') else len(current.data)
        print(f"   Current salons in database: {current_count}")
    except Exception as e:
        print(f"   Warning: Could not count salons: {e}")
        current_count = 0
    
    # Read Excel file
    print("\n📂 Reading Excel file: Nail_Salons_Aus_250.xlsx")
    try:
        df = pd.read_excel('Nail_Salons_Aus_250.xlsx', sheet_name=0)
        print(f"✅ Loaded {len(df)} rows from Excel")
    except Exception as e:
        print(f"❌ Failed to read Excel file: {e}")
        sys.exit(1)
    
    # Create missing cities first
    create_missing_cities(supabase, df)
    
    # Get city mapping
    city_map = get_city_id_mapping(supabase)
    if not city_map:
        print("❌ Could not load city mapping. Aborting.")
        sys.exit(1)
    
    # Ask user confirmation before deletion
    if current_count > 0:
        print(f"\n⚠️  WARNING: This will delete {current_count} existing salons!")
        response = input("   Do you want to continue? (yes/no): ")
        if response.lower() != 'yes':
            print("❌ Import cancelled by user")
            sys.exit(0)
    
    # Delete existing salon data
    print("\n🗑️  Deleting existing fake salon data...")
    try:
        result = supabase.table('salons').delete().neq('id', 0).execute()
        print(f"✅ Deleted existing salon data")
    except Exception as e:
        print(f"⚠️  Warning: Could not delete existing data: {e}")
        print("   Continuing anyway...")
    
    # Process and import salons
    print(f"\n📥 Importing {len(df)} salons...")
    success_count = 0
    error_count = 0
    errors = []
    
    for idx, row in df.iterrows():
        try:
            # Extract basic information
            name = str(row['name']) if not pd.isna(row['name']) else f"Salon {idx+1}"
            
            # Create unique slug
            base_slug = slugify(name)
            slug = f"{base_slug}-{idx+1}"
            
            # Parse address components
            address = str(row['address']) if not pd.isna(row['address']) else ""
            city_name = str(row['City']) if not pd.isna(row['City']) else ""
            
            # Get city ID
            city_id = find_city_id(city_name, city_map)
            
            # Description
            description = str(row['Description']) if 'Description' in row and not pd.isna(row['Description']) else ""
            if not description:
                description = str(row['description']) if not pd.isna(row['description']) else ""
            
            # Detailed description from review summary
            detailed_desc = str(row['Reveiw summarry']) if 'Reveiw summarry' in row and not pd.isna(row['Reveiw summarry']) else description
            
            # Rating
            rating = float(row['rating']) if not pd.isna(row['rating']) else 4.5
            
            # Create salon object matching the actual schema
            salon_data = {
                'name': name,
                'slug': slug,
                'address': address,
                'city_id': city_id,
                'phone': clean_phone(row['phone']) if 'phone' in row else None,
                'website': clean_website(row['website']) if 'website' in row else None,
                'latitude': None,
                'longitude': None,
                'description': description[:500] if description else None,
                'detailed_description': detailed_desc if detailed_desc else None,
                'rating': rating,
                'opening_hours': parse_hours(
                    row['workday_timing'] if 'workday_timing' in row else None,
                    row['closed_on'] if 'closed_on' in row else None
                ),
                
                # Amenities
                'kid_friendly': bool_value(row.get('Kid friendly')),
                'parking': bool_value(row.get('Parking')),
                'wheelchair_accessible': bool_value(row.get('Wheel chair accessable')),
                'accepts_walk_ins': bool_value(row.get('Walk-ins Welcome')),
                'appointment_only': bool_value(row.get('Appointment Required')),
                'credit_cards_accepted': True,
                'cash_only': False,
                'gift_cards_available': False,
                'loyalty_program': False,
                'online_booking': bool_value(row.get('Appointment Required')),
                
                # Services
                'manicure': bool_value(row.get('Gel Manicure')),
                'pedicure': bool_value(row.get('Pedicure')) or bool_value(row.get('Gel Pedicure')),
                'gel_nails': bool_value(row.get('Gel Manicure')) or bool_value(row.get('Gel X')),
                'acrylic_nails': bool_value(row.get('Acrylic Nails')),
                'nail_art': bool_value(row.get('Nail Art')),
                'dip_powder': bool_value(row.get('Dip Powder')),
                'shellac': bool_value(row.get('Gel Manicure')),
                'nail_extensions': bool_value(row.get('Gel Extensions')),
                'nail_repair': bool_value(row.get('Hand and Foot Treatment')),
                'cuticle_care': True,
                
                # Features
                'master_artist': bool_value(row.get('Master Nail Artist')),
                'certified_technicians': bool_value(row.get('Qualified technicians')),
                'experienced_staff': bool_value(row.get('Experienced Team')),
                'luxury_experience': 'luxury' in description.lower() or 'spa' in description.lower(),
                'relaxing_atmosphere': 'relax' in description.lower() or bool_value(row.get('Massage')),
                'modern_facilities': bool_value(row.get('LED curing')),
                'clean_hygienic': bool_value(row.get('Autoclave sterlisation')),
                'friendly_service': True,
                'quick_service': bool_value(row.get('Quick Service')),
                'premium_products': bool_value(row.get('Eco-friendly products')) or bool_value(row.get('Non-toxic treatments')),
                
                # Publication status
                'is_published': True,
                'is_verified': False,
                'is_featured': False,
            }
            
            # Insert salon
            result = supabase.table('salons').insert(salon_data).execute()
            
            if result.data:
                success_count += 1
                if success_count % 25 == 0:
                    print(f"  ✅ Imported {success_count} salons...")
            else:
                error_count += 1
                errors.append(f"{name}: No data returned")
                
        except Exception as e:
            error_count += 1
            error_msg = f"Salon {idx+1} ({name if 'name' in locals() else 'unknown'}): {str(e)[:100]}"
            errors.append(error_msg)
            if error_count <= 5:
                print(f"  ❌ Error: {error_msg}")
            continue
    
    # Final summary
    print("\n" + "=" * 80)
    print("📊 IMPORT SUMMARY")
    print("=" * 80)
    print(f"✅ Successfully imported: {success_count} salons")
    print(f"❌ Failed to import: {error_count} salons")
    print(f"📝 Total processed: {len(df)} salons")
    
    if errors and error_count > 5:
        print(f"\n⚠️  Showing first 5 errors (total: {len(errors)})")
    
    print("=" * 80)
    
    if success_count > 0:
        print("\n🎉 Import complete!")
        print("\n📋 Next steps:")
        print("   1. Visit your Supabase dashboard to verify the data")
        print("   2. Add latitude/longitude using a geocoding service")
        print("   3. Upload salon photos to gallery_images")
        print("   4. Review and verify high-quality listings")
    else:
        print("\n❌ Import failed. Please check the errors above.")

if __name__ == "__main__":
    main()
