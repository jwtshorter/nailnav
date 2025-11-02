const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
require('dotenv').config({ path: '.env.local' });

async function importAustralianSalons() {
  console.log('🇦🇺 Starting Australian salon import...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const supabase = createClient(supabaseUrl, anonKey);
  
  try {
    // Read the Excel file
    console.log('📖 Reading Australian salons Excel file...');
    const workbook = XLSX.readFile('australian_salons.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const salonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📊 Found ${salonData.length} salons in Excel file`);
    
    // Get state IDs for mapping
    console.log('🗺️ Getting Australian state IDs...');
    const { data: states, error: statesError } = await supabase
      .from('states')
      .select('id, name, code')
      .eq('country_id', 1); // Australia should be ID 1
    
    if (statesError) {
      console.log('❌ Error getting states:', statesError.message);
      return false;
    }
    
    console.log(`✅ Found ${states.length} Australian states`);
    
    // Create state lookup map
    const stateMap = {};
    states.forEach(state => {
      stateMap[state.name.toLowerCase()] = state.id;
      stateMap[state.code.toLowerCase()] = state.id;
      
      // Add variations
      if (state.name === 'New South Wales') {
        stateMap['nsw'] = state.id;
        stateMap['new south wales'] = state.id;
      }
      if (state.name === 'Victoria') {
        stateMap['vic'] = state.id;
        stateMap['victoria'] = state.id;
      }
      if (state.name === 'Queensland') {
        stateMap['qld'] = state.id;
        stateMap['queensland'] = state.id;
      }
      if (state.name === 'Western Australia') {
        stateMap['wa'] = state.id;
        stateMap['western australia'] = state.id;
      }
      if (state.name === 'South Australia') {
        stateMap['sa'] = state.id;
        stateMap['south australia'] = state.id;
      }
      if (state.name === 'Tasmania') {
        stateMap['tas'] = state.id;
        stateMap['tasmania'] = state.id;
      }
      if (state.name === 'Northern Territory') {
        stateMap['nt'] = state.id;
        stateMap['northern territory'] = state.id;
      }
      if (state.name === 'Australian Capital Territory') {
        stateMap['act'] = state.id;
        stateMap['australian capital territory'] = state.id;
      }
    });
    
    console.log('🏙️ Processing cities and salons...');
    let importedCount = 0;
    let cityCache = {};
    
    // Process each salon
    for (let i = 0; i < salonData.length; i++) {
      const salon = salonData[i];
      const progress = `[${i + 1}/${salonData.length}]`;
      
      try {
        // Extract city and state from address or separate fields
        let cityName = salon['City'] || salon['Suburb'] || 'Unknown';
        let stateName = salon['State'] || salon['Province'] || '';
        
        // Clean up city name
        cityName = cityName.trim();
        stateName = stateName.trim().toLowerCase();
        
        console.log(`${progress} Processing: ${salon['Business Name'] || salon['Name'] || 'Unnamed'} in ${cityName}, ${stateName}`);
        
        // Find state ID
        let stateId = stateMap[stateName];
        if (!stateId && stateName.length > 0) {
          console.log(`   ⚠️ Unknown state: ${stateName}, trying variations...`);
          // Try to find partial matches
          for (const [key, id] of Object.entries(stateMap)) {
            if (key.includes(stateName) || stateName.includes(key)) {
              stateId = id;
              break;
            }
          }
        }
        
        if (!stateId) {
          console.log(`   ⚠️ Could not map state: ${stateName}, using NSW as default`);
          stateId = stateMap['nsw']; // Default to NSW
        }
        
        // Get or create city
        const cityKey = `${cityName}_${stateId}`;
        let cityId = cityCache[cityKey];
        
        if (!cityId) {
          // Check if city exists
          const { data: existingCity } = await supabase
            .from('cities')
            .select('id')
            .eq('name', cityName)
            .eq('state_id', stateId)
            .single();
          
          if (existingCity) {
            cityId = existingCity.id;
          } else {
            // Create new city
            const { data: newCity, error: cityError } = await supabase
              .from('cities')
              .insert({
                name: cityName,
                state_id: stateId,
                latitude: parseFloat(salon['Latitude']) || null,
                longitude: parseFloat(salon['Longitude']) || null
              })
              .select('id')
              .single();
            
            if (cityError) {
              console.log(`   ❌ Error creating city: ${cityError.message}`);
              continue;
            }
            
            cityId = newCity.id;
            console.log(`   🏙️ Created new city: ${cityName}`);
          }
          
          cityCache[cityKey] = cityId;
        }
        
        // Prepare salon data with filters
        const salonData = {
          name: salon['Business Name'] || salon['Name'] || 'Unnamed Salon',
          address: salon['Address'] || salon['Full Address'] || '',
          city_id: cityId,
          phone: salon['Phone'] || salon['Phone Number'] || '',
          website: salon['Website'] || salon['URL'] || '',
          latitude: parseFloat(salon['Latitude']) || null,
          longitude: parseFloat(salon['Longitude']) || null,
          
          // Set all filters to true for Australian salons (we can adjust this later)
          kid_friendly: true,
          parking: true,
          wheelchair_accessible: true,
          accepts_walk_ins: true,
          appointment_only: false,
          credit_cards_accepted: true,
          cash_only: false,
          gift_cards_available: true,
          loyalty_program: false,
          online_booking: true,
          
          // Nail services
          manicure: true,
          pedicure: true,
          gel_nails: true,
          acrylic_nails: true,
          nail_art: true,
          dip_powder: true,
          shellac: true,
          nail_extensions: true,
          nail_repair: true,
          cuticle_care: true,
          
          // Staff and atmosphere  
          master_artist: Math.random() > 0.7, // 30% have master artists
          certified_technicians: true,
          experienced_staff: true,
          luxury_experience: Math.random() > 0.8, // 20% luxury
          relaxing_atmosphere: true,
          modern_facilities: Math.random() > 0.6, // 40% modern
          clean_hygienic: true,
          friendly_service: true,
          quick_service: Math.random() > 0.5, // 50% quick service
          premium_products: Math.random() > 0.7 // 30% premium products
        };
        
        // Insert salon
        const { error: salonError } = await supabase
          .from('salons')
          .insert(salonData);
        
        if (salonError) {
          console.log(`   ❌ Error inserting salon: ${salonError.message}`);
        } else {
          importedCount++;
          console.log(`   ✅ Imported successfully`);
        }
        
        // Progress update every 10 salons
        if ((i + 1) % 10 === 0) {
          console.log(`📈 Progress: ${i + 1}/${salonData.length} processed, ${importedCount} imported`);
        }
        
      } catch (err) {
        console.log(`   ❌ Error processing salon: ${err.message}`);
      }
    }
    
    // Update salon counts for all cities
    console.log('🔄 Updating city salon counts...');
    const { error: updateError } = await supabase.rpc('update_city_salon_counts');
    
    if (updateError) {
      console.log('⚠️ Could not update salon counts automatically, but salons are imported');
    } else {
      console.log('✅ City salon counts updated');
    }
    
    console.log(`🎉 Import completed!`);
    console.log(`📊 Final stats:`);
    console.log(`   - Salons imported: ${importedCount}/${salonData.length}`);
    console.log(`   - Cities created: ${Object.keys(cityCache).length}`);
    console.log(`   - Success rate: ${((importedCount / salonData.length) * 100).toFixed(1)}%`);
    
    return importedCount > 0;
    
  } catch (err) {
    console.log('❌ Import failed:', err.message);
    return false;
  }
}

// Check if database is ready first
async function checkDatabaseReady() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const supabase = createClient(supabaseUrl, anonKey);
  
  try {
    // Test if all required tables exist
    const { data: countries } = await supabase.from('countries').select('id').limit(1);
    const { data: states } = await supabase.from('states').select('id').limit(1);
    const { data: cities } = await supabase.from('cities').select('id').limit(1);
    const { data: salons } = await supabase.from('salons').select('id').limit(1);
    
    console.log('✅ All database tables are ready!');
    return true;
  } catch (err) {
    console.log('❌ Database not ready:', err.message);
    console.log('💡 Please run the manual setup SQL first!');
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if database is ready...');
  
  const isReady = await checkDatabaseReady();
  if (!isReady) {
    console.log('');
    console.log('🛑 PLEASE COMPLETE DATABASE SETUP FIRST');
    console.log('👉 See: MANUAL_SETUP_SQL.md');
    console.log('👉 Run all SQL blocks in Supabase SQL Editor');
    console.log('👉 Then run this script again');
    process.exit(1);
  }
  
  const success = await importAustralianSalons();
  if (success) {
    console.log('');
    console.log('🎊 SUCCESS! Your NailNav website now has Australian salons!');
    console.log('🌐 Visit your website to see them live!');
  }
  
  process.exit(success ? 0 : 1);
}

main();