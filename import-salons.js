const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Helper function to convert Yes/No to boolean
const yesNoToBool = (val) => {
  if (!val) return false;
  const str = String(val).toLowerCase().trim();
  return str === 'yes' || str === 'true' || str === '1';
};

// Helper function to create slug
const createSlug = (name, city) => {
  const slug = `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug;
};

// Helper function to extract city name from "City: Y = Darwin" format
const extractCityName = (cityField) => {
  if (!cityField) return '';
  const match = cityField.match(/Y\s*=\s*(.+)/);
  return match ? match[1].trim() : cityField.trim();
};

async function ensureCityExists(cityName, stateName, country = 'Australia') {
  // Get country
  const { data: countryData } = await supabase
    .from('countries')
    .select('id')
    .eq('name', country)
    .single();
  
  if (!countryData) {
    console.log(`Country ${country} not found`);
    return null;
  }

  // Get state
  let { data: stateData } = await supabase
    .from('states')
    .select('id')
    .eq('country_id', countryData.id)
    .eq('code', stateName)
    .single();

  if (!stateData) {
    console.log(`State ${stateName} not found`);
    return null;
  }

  // Check if city exists
  const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  let { data: cityData } = await supabase
    .from('cities')
    .select('id')
    .eq('state_id', stateData.id)
    .eq('slug', citySlug)
    .single();

  if (!cityData) {
    // Create city (we'll use approximate coordinates from the first salon)
    const { data: newCity, error } = await supabase
      .from('cities')
      .insert({
        state_id: stateData.id,
        country_id: countryData.id,
        name: cityName,
        slug: citySlug,
        latitude: -25.0, // Default Australia center
        longitude: 135.0,
        meta_title: `Best Nail Salons in ${cityName}, ${stateName}`,
        meta_description: `Find top-rated nail salons in ${cityName}. Browse manicure, pedicure, gel nails, and nail art services with reviews and ratings.`
      })
      .select()
      .single();

    if (error) {
      console.error(`Error creating city ${cityName}:`, error);
      return null;
    }
    
    cityData = newCity;
    console.log(`Created city: ${cityName}`);
  }

  return cityData.id;
}

async function importSalons() {
  console.log('📖 Reading Excel file...');
  const workbook = XLSX.readFile('Australian_Salons.xlsx');
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
  console.log(`Found ${data.length} salons to import\n`);
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    try {
      // Extract city name from the "City: Y = Darwin" format
      const cityName = extractCityName(row['City']);
      const stateName = row['state'];
      
      if (!cityName || !stateName) {
        console.log(`⚠️  Row ${i + 1}: Missing city or state, skipping`);
        skipped++;
        continue;
      }

      // Ensure city exists in database
      const cityId = await ensureCityExists(cityName, stateName);
      
      if (!cityId) {
        console.log(`⚠️  Row ${i + 1}: Could not create/find city, skipping`);
        skipped++;
        continue;
      }

      const slug = createSlug(row['name'], cityName);
      
      // Check if salon already exists
      const { data: existing } = await supabase
        .from('salons')
        .select('id')
        .eq('slug', slug)
        .single();
      
      if (existing) {
        console.log(`⏭️  Row ${i + 1}: ${row['name']} already exists, skipping`);
        skipped++;
        continue;
      }

      // Prepare salon data
      const salonData = {
        // Basic info
        name: row['name'],
        slug: slug,
        description: row['description'] || '',
        generated_description: row['Description'] || '', // From DG column
        phone: row['phone'] || null,
        website: row['website'] || null,
        
        // Location
        address: row['address'],
        city: cityName,
        state: stateName,
        country: 'Australia',
        postal_code: null,
        latitude: 0, // TODO: Extract from address or use geocoding
        longitude: 0,
        city_id: cityId,
        
        // Google data
        place_id: row['place_id'],
        google_rating: row['rating'] ? parseFloat(row['rating']) : null,
        google_review_count: row['reviews'] ? parseInt(row['reviews']) : 0,
        review_keywords: row['review_keywords'] ? row['review_keywords'].split(',').map(k => k.trim()) : [],
        owner_name: row['owner_name'],
        is_spending_on_ads: yesNoToBool(row['is_spending_on_ads']),
        is_temporarily_closed: yesNoToBool(row['is_temporarily_closed']),
        can_claim: yesNoToBool(row['can_claim']),
        
        // Status
        is_published: true,
        is_verified: false,
        
        // Services (BE-BN)
        offers_manicure: yesNoToBool(row['Manicure']),
        offers_gel_manicure: yesNoToBool(row['Gel Manicure']),
        offers_gel_x: yesNoToBool(row['Gel X']),
        offers_gel_extensions: yesNoToBool(row['Gel Extensions']),
        offers_acrylic_nails: yesNoToBool(row['Acrylic Nails']),
        offers_pedicure: yesNoToBool(row['Pedicure']),
        offers_gel_pedicure: yesNoToBool(row['Gel Pedicure']),
        offers_dip_powder: yesNoToBool(row['Dip Powder']),
        offers_builders_gel: yesNoToBool(row['Builders Gel']),
        offers_nail_art: yesNoToBool(row['Nail Art']),
        offers_massage: yesNoToBool(row['Massage']),
        offers_facials: yesNoToBool(row['Facials']),
        offers_eyelashes: yesNoToBool(row['Eyelashes']),
        offers_brows: yesNoToBool(row['Brows']),
        offers_waxing: yesNoToBool(row['Waxing']),
        offers_haircuts: yesNoToBool(row['Hair cuts']),
        offers_hand_foot_treatment: yesNoToBool(row['Hand and Foot Treatment']),
        
        // Languages
        lang_basic_english: yesNoToBool(row['Basic English']),
        lang_fluent_english: yesNoToBool(row['Fluent English']),
        lang_spanish: yesNoToBool(row['Spanish']),
        lang_vietnamese: yesNoToBool(row['Vietnamese']),
        lang_chinese: yesNoToBool(row['Chinese']),
        lang_korean: yesNoToBool(row['Korean']),
        
        // Expertise
        qualified_technicians: yesNoToBool(row['Qualified technicians']),
        experienced_team: yesNoToBool(row['Experienced Team']),
        quick_service: yesNoToBool(row['Quick Service']),
        award_winning_staff: yesNoToBool(row['Award winning staff']),
        master_nail_artist: yesNoToBool(row['Master Nail Artist']),
        
        // Booking
        bridal_nails: yesNoToBool(row['Bridal Nails']),
        appointment_required: yesNoToBool(row['Appointment Required']),
        walk_ins_welcome: yesNoToBool(row['Walk-ins Welcome']),
        group_bookings: yesNoToBool(row['Group Bookings']),
        mobile_nails: yesNoToBool(row['Mobile Nails']),
        
        // Atmosphere
        kid_friendly: yesNoToBool(row['Kid friendly']),
        child_play_area: yesNoToBool(row['Child play area']),
        adult_only: yesNoToBool(row['Adult only']),
        pet_friendly: yesNoToBool(row['Pet friendly']),
        lgbtqi_friendly: yesNoToBool(row['LGBTQI+ friendly']),
        
        // Accessibility & Ownership
        wheelchair_accessible: yesNoToBool(row['Wheel chair accessable']),
        female_owned: yesNoToBool(row['Female owned salon']),
        minority_owned: yesNoToBool(row['Minority owned salon']),
        
        // Amenities
        complimentary_drink: yesNoToBool(row['Complimentary drink']),
        heated_massage_chairs: yesNoToBool(row['Heated Massage Chairs']),
        foot_spas: yesNoToBool(row['Foot Spas']),
        free_wifi: yesNoToBool(row['Free Wi-fi']),
        parking: yesNoToBool(row['Parking']),
        
        // Health & Safety
        autoclave_sterilisation: yesNoToBool(row['Autoclave sterlisation']),
        led_curing: yesNoToBool(row['LED curing']),
        non_toxic_treatments: yesNoToBool(row['Non-toxic treatments']),
        eco_friendly_products: yesNoToBool(row['Eco-friendly products']),
        cruelty_free_products: yesNoToBool(row['Cruelty free products']),
        vegan_polish: yesNoToBool(row['Vegan polish']),
        
        // Default values
        currency: 'AUD',
        price_range: 'mid-range',
        accepts_walk_ins: yesNoToBool(row['Walk-ins Welcome']),
        parking_available: yesNoToBool(row['Parking']),
      };
      
      // Insert salon
      const { error } = await supabase
        .from('salons')
        .insert(salonData);
      
      if (error) {
        console.error(`❌ Row ${i + 1}: Error importing ${row['name']}:`, error.message);
        errors++;
      } else {
        imported++;
        if (imported % 10 === 0) {
          console.log(`✅ Imported ${imported} salons...`);
        }
      }
      
      // Rate limiting - wait a bit every 50 salons
      if (i % 50 === 0 && i > 0) {
        console.log(`⏸️  Pausing briefly...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error(`❌ Row ${i + 1}: Unexpected error:`, error.message);
      errors++;
    }
  }
  
  console.log('\n=== IMPORT COMPLETE ===');
  console.log(`✅ Imported: ${imported}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📊 Total processed: ${imported + skipped + errors}`);
  
  // Update location counts
  console.log('\n📊 Updating location counts...');
  const { error: countError } = await supabase.rpc('update_location_salon_counts');
  if (countError) {
    console.error('Error updating counts:', countError);
  } else {
    console.log('✅ Location counts updated');
  }
}

// Run import
importSalons().catch(console.error);
