#!/usr/bin/env python3
"""
COMPREHENSIVE import: ALL columns from spreadsheet (including AV-CV service/amenity columns)
Maps columns 0-CX from Nail_Salons_Aus_250.xlsx to Supabase
"""

import pandas as pd
import sys
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ Error: Supabase credentials not found")
    sys.exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Column mapping from spreadsheet to database
# These are columns AV-CV (indices 47-99) that contain service/amenity booleans
SERVICE_AMENITY_COLUMNS = {
    # Column index: (spreadsheet_name, database_column_name)
    47: ('c', 'manicure'),  # AV - appears to be manicure indicator
    48: ('Gel Manicure', 'gel_manicure'),  # AW
    49: ('Gel X', 'gel_x'),  # AX
    50: ('Gel Extensions', 'gel_extensions'),  # AY
    51: ('Acrylic Nails', 'acrylic_nails'),  # AZ
    52: ('Pedicure', 'pedicure'),  # BA
    53: ('Gel Pedicure', 'gel_pedicure'),  # BB
    54: ('Dip Powder', 'dip_powder'),  # BC
    55: ('Builders Gel', 'builders_gel'),  # BD
    56: ('Nail Art', 'nail_art'),  # BE
    57: ('Massage', 'massage'),  # BF
    58: ('Facials', 'facials'),  # BG
    59: ('Eyelashes', 'eyelashes'),  # BH
    60: ('Brows', 'brows'),  # BI
    61: ('Waxing', 'waxing'),  # BJ
    62: ('Hair cuts', 'hair_cuts'),  # BK
    63: ('Hand and Foot Treatment', 'hand_foot_treatment'),  # BL
    # Skip BM (Price) - it's text, not boolean
    65: ('Basic English', 'basic_english'),  # BN
    66: ('Fluent English', 'fluent_english'),  # BO
    67: ('Spanish', 'spanish'),  # BP
    68: ('Vietnamese', 'vietnamese'),  # BQ
    69: ('Chinese', 'chinese'),  # BR
    70: ('Korean', 'korean'),  # BS
    71: ('Qualified technicians', 'certified_technicians'),  # BT
    72: ('Experienced Team', 'experienced_staff'),  # BU
    73: ('Quick Service', 'quick_service'),  # BV
    74: ('Award winning staff', 'award_winning_staff'),  # BW
    75: ('Master Nail Artist', 'master_artist'),  # BX
    76: ('Bridal Nails', 'bridal_nails'),  # BY
    77: ('Appointment Required', 'appointment_only'),  # BZ
    78: ('Walk-ins Welcome', 'accepts_walk_ins'),  # CA
    79: ('Group Bookings', 'group_bookings'),  # CB
    80: ('Mobile Nails', 'mobile_nails'),  # CC
    81: ('Kid friendly', 'kid_friendly'),  # CD
    82: ('Child play area', 'child_play_area'),  # CE
    83: ('Adult only', 'adult_only'),  # CF
    84: ('Pet friendly', 'pet_friendly'),  # CG
    85: ('LGBTQI+ friendly', 'lgbtqi_friendly'),  # CH
    86: ('Wheel chair accessable', 'wheelchair_accessible'),  # CI
    87: ('Female owned salon', 'female_owned'),  # CJ
    88: ('Minority owned salon', 'minority_owned'),  # CK
    89: ('Complimentary drink', 'complimentary_drink'),  # CL
    90: ('Heated Massage Chairs', 'heated_massage_chairs'),  # CM
    91: ('Foot Spas', 'foot_spas'),  # CN
    92: ('Free Wi-fi', 'free_wifi'),  # CO
    93: ('Parking', 'parking'),  # CP
    94: ('Autoclave sterlisation', 'autoclave_sterilisation'),  # CQ
    95: ('LED curing', 'led_curing'),  # CR
    96: ('Non-toxic treatments', 'non_toxic_treatments'),  # CS
    97: ('Eco-friendly products', 'eco_friendly_products'),  # CT
    98: ('Cruelty free products', 'cruelty_free_products'),  # CU
    99: ('Vegan polish', 'vegan_polish'),  # CV
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
        return value.strip().lower() in ['yes', 'true', '1', 'x', 'y']
    return bool(value)

def main():
    print("📊 Reading Excel file...")
    df = pd.read_excel('Nail_Salons_Aus_250.xlsx')
    
    print(f"Found {len(df)} salons in spreadsheet")
    print(f"Spreadsheet has {len(df.columns)} columns")
    
    # Get all salons from database
    print("\n🔍 Fetching salons from database...")
    result = supabase.table('salons').select('id, name').execute()
    db_salons = {s['name']: s['id'] for s in result.data}
    
    print(f"Found {len(db_salons)} salons in database")
    
    updated = 0
    not_found = 0
    errors = 0
    
    print("\n🔄 Updating salon data...")
    
    for idx, row in df.iterrows():
        salon_name = row.iloc[1] if len(row) > 1 else None  # Column B = name
        
        if pd.isna(salon_name):
            continue
            
        salon_name = str(salon_name).strip()
        
        # Find salon in database
        if salon_name not in db_salons:
            not_found += 1
            print(f"⚠️  Salon not found in DB: {salon_name}")
            continue
        
        salon_id = db_salons[salon_name]
        
        # Build update data with all service/amenity columns
        update_data = {}
        
        for col_idx, (sheet_name, db_col) in SERVICE_AMENITY_COLUMNS.items():
            if col_idx < len(row):
                value = bool_value(row.iloc[col_idx])
                update_data[db_col] = value
        
        # Update salon
        try:
            supabase.table('salons').update(update_data).eq('id', salon_id).execute()
            updated += 1
            if updated % 10 == 0:
                print(f"✅ Updated {updated} salons...")
        except Exception as e:
            errors += 1
            print(f"❌ Error updating {salon_name}: {e}")
    
    print(f"\n✨ Import complete!")
    print(f"✅ Updated: {updated}")
    print(f"⚠️  Not found: {not_found}")
    print(f"❌ Errors: {errors}")

if __name__ == '__main__':
    main()
