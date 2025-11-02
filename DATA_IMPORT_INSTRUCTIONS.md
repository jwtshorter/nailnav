# 📥 Real Salon Data Import Instructions

This guide will help you replace the fake salon data in your Supabase database with real data from the Excel file `Nail_Salons_Aus_250.xlsx`.

## 📋 Prerequisites

1. ✅ Supabase project is set up (Project: `ddenulleuvyhwqsulrod`)
2. ✅ Database schema is created (run `SUPABASE_COMPLETE_SETUP.sql`)
3. ✅ Excel file downloaded: `Nail_Salons_Aus_250.xlsx` (249 rows)
4. ⏳ Supabase credentials ready

## 🔑 Step 1: Get Supabase Credentials

You need three pieces of information from your Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/ddenulleuvyhwqsulrod/settings/api
2. Copy the following values:
   - **Project URL** (e.g., `https://ddenulleuvyhwqsulrod.supabase.co`)
   - **Anon/Public Key** (`anon` key under "Project API keys")
   - **Service Role Key** (`service_role` key under "Project API keys")

⚠️ **IMPORTANT**: Keep your Service Role Key secret! Never commit it to GitHub.

## 🛠️ Step 2: Set Up Environment Variables

### Option A: Interactive Setup (Recommended)
```bash
chmod +x setup_env.sh
./setup_env.sh
```

### Option B: Manual Setup
Create a file named `.env.local` in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ddenulleuvyhwqsulrod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://nailnav.com
NEXT_PUBLIC_APP_NAME=NailNav
```

## 📥 Step 3: Run the Import Script

The import script will:
1. ✅ Connect to your Supabase database
2. 🗑️ Delete existing fake salon data
3. 📊 Parse the Excel file (249 Australian nail salons)
4. ✨ Import real salon data with proper formatting

### Install Dependencies
```bash
pip install openpyxl pandas python-dotenv supabase
```

### Run the Import
```bash
python3 import_real_salons.py
```

Expected output:
```
================================================================================
🚀 NAIL SALON DATA IMPORT TOOL
================================================================================

📡 Connecting to Supabase...
✅ Connected to Supabase

📂 Reading Excel file: Nail_Salons_Aus_250.xlsx
✅ Loaded 249 rows from Excel

🗑️  Deleting existing fake salon data...
✅ Deleted existing salon data

🎫 Getting vendor tier information...
✅ Found free tier ID: ...

📥 Importing 249 salons...
  ✅ Imported 10 salons...
  ✅ Imported 20 salons...
  ...

================================================================================
📊 IMPORT SUMMARY
================================================================================
✅ Successfully imported: 249 salons
❌ Failed to import: 0 salons
📝 Total processed: 249 salons
================================================================================

🎉 Import complete!
```

## 📊 What Data Gets Imported?

The script extracts and imports the following information from the Excel file:

### Basic Information
- Salon name
- Description
- Address (street, city, state, postal code)
- Phone number
- Website

### Services & Features
- **Services Offered**: Gel Manicure, Acrylic Nails, Pedicure, Nail Art, etc.
- **Specialties**: Qualified technicians, Master Nail Artist, Quick Service, etc.
- **Languages**: English, Spanish, Vietnamese, Chinese, Korean
- **Amenities**: Walk-ins welcome, Parking, Wi-Fi, etc.

### Business Details
- Price range ($, $$, $$$)
- Operating hours
- Booking preferences
- Customer reviews and ratings

### Default Settings
All imported salons will have:
- ✅ Published status: `true` (visible on the site)
- ❌ Verified status: `false` (admin can verify later)
- ❌ Featured status: `false` (admin can feature later)
- 🆓 Tier: Free tier (can be upgraded later)
- 🌏 Country: Australia

## ✅ Step 4: Verify the Import

After the import completes, verify the data in Supabase:

1. Go to: https://supabase.com/dashboard/project/ddenulleuvyhwqsulrod/editor
2. Select the `salons` table
3. You should see ~249 rows of Australian nail salons

### SQL Verification Query
```sql
-- Check total salon count
SELECT COUNT(*) as total_salons FROM salons;

-- Check salons by state
SELECT state, COUNT(*) as salon_count 
FROM salons 
GROUP BY state 
ORDER BY salon_count DESC;

-- Check salons with services
SELECT name, services_offered, specialties 
FROM salons 
LIMIT 10;
```

## 🔄 Step 5: Test Your Application

Start your development server to see the real data:

```bash
npm run dev
```

Visit http://localhost:3000 and you should see real Australian nail salons!

## 🐛 Troubleshooting

### Issue: "Supabase credentials not found"
**Solution**: Make sure `.env.local` exists and contains valid credentials

### Issue: "Free tier not found in database"
**Solution**: Run `SUPABASE_COMPLETE_SETUP.sql` in Supabase SQL Editor first

### Issue: "Failed to connect to Supabase"
**Solution**: 
- Check that your SUPABASE_URL is correct
- Verify SERVICE_ROLE_KEY is the service_role key (not anon key)
- Ensure your Supabase project is active

### Issue: Some salons failed to import
**Solution**: Check the error messages - usually due to:
- Missing required fields (name, address)
- Data format issues (phone, website)
- Database constraints (unique slugs)

## 📝 Data Cleanup Options

If you want to re-import or clean up the data:

### Delete All Salons
```sql
DELETE FROM salons;
```

### Delete Specific State
```sql
DELETE FROM salons WHERE state = 'NSW';
```

### Reset Auto-Generated Fields
```sql
UPDATE salons 
SET 
  view_count = 0,
  contact_form_submissions = 0,
  is_verified = false,
  is_featured = false;
```

## 🎯 Next Steps

After importing the real data:

1. ✅ **Verify Salons**: Review and verify high-quality salon listings
2. 🌟 **Feature Salons**: Mark premium salons as featured
3. 📸 **Add Photos**: Upload salon photos (currently defaults)
4. 🗺️ **Geocode Addresses**: Add accurate latitude/longitude for each salon
5. 👥 **Contact Owners**: Invite salon owners to claim their listings
6. 💳 **Enable Payments**: Set up Stripe for premium upgrades

## 📚 Related Files

- `import_real_salons.py` - Main import script
- `setup_env.sh` - Environment setup helper
- `Nail_Salons_Aus_250.xlsx` - Source data file
- `SUPABASE_COMPLETE_SETUP.sql` - Database schema
- `.env.local.example` - Environment template

## 🤝 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Supabase logs in the dashboard
3. Check the import script output for specific errors
4. Verify your database schema is up to date

---

**Last Updated**: November 2, 2025  
**Data Source**: Nail_Salons_Aus_250.xlsx (249 Australian nail salons)  
**Target Database**: Supabase Project `ddenulleuvyhwqsulrod`
