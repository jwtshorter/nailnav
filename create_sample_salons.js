const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function createSampleSalons() {
  console.log('💅 Creating sample Australian nail salons...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const supabase = createClient(supabaseUrl, anonKey);
  
  try {
    // Get state IDs
    const { data: states } = await supabase
      .from('states')
      .select('id, name, code');
    
    const stateMap = {};
    states.forEach(state => {
      stateMap[state.code] = state.id;
    });
    
    // Sample salon data from major Australian cities
    const sampleSalons = [
      // Sydney, NSW
      { name: "Sydney Nail Studio", city: "Sydney", state: "NSW", address: "123 George St, Sydney NSW 2000", phone: "(02) 9876 5432" },
      { name: "Bondi Beach Nails", city: "Bondi", state: "NSW", address: "456 Campbell Parade, Bondi Beach NSW 2026", phone: "(02) 9234 5678" },
      { name: "Parramatta Nail Bar", city: "Parramatta", state: "NSW", address: "789 Church St, Parramatta NSW 2150", phone: "(02) 9876 1234" },
      { name: "Manly Manicure", city: "Manly", state: "NSW", address: "321 The Corso, Manly NSW 2095", phone: "(02) 9567 8901" },
      { name: "Chatswood Nail Lounge", city: "Chatswood", state: "NSW", address: "654 Pacific Hwy, Chatswood NSW 2067", phone: "(02) 9432 1098" },
      
      // Melbourne, VIC
      { name: "Melbourne Nail Emporium", city: "Melbourne", state: "VIC", address: "111 Collins St, Melbourne VIC 3000", phone: "(03) 9876 5432" },
      { name: "St Kilda Nail Spa", city: "St Kilda", state: "VIC", address: "222 Fitzroy St, St Kilda VIC 3182", phone: "(03) 9234 5678" },
      { name: "Richmond Nail Design", city: "Richmond", state: "VIC", address: "333 Swan St, Richmond VIC 3121", phone: "(03) 9876 1234" },
      { name: "Prahran Nail Studio", city: "Prahran", state: "VIC", address: "444 Chapel St, Prahran VIC 3181", phone: "(03) 9567 8901" },
      { name: "Fitzroy Nail Bar", city: "Fitzroy", state: "VIC", address: "555 Brunswick St, Fitzroy VIC 3065", phone: "(03) 9432 1098" },
      
      // Brisbane, QLD
      { name: "Brisbane Nail Centre", city: "Brisbane", state: "QLD", address: "666 Queen St, Brisbane QLD 4000", phone: "(07) 3876 5432" },
      { name: "Surfers Paradise Nails", city: "Surfers Paradise", state: "QLD", address: "777 Gold Coast Hwy, Surfers Paradise QLD 4217", phone: "(07) 5234 5678" },
      { name: "Fortitude Valley Nail Lounge", city: "Fortitude Valley", state: "QLD", address: "888 Brunswick St, Fortitude Valley QLD 4006", phone: "(07) 3876 1234" },
      { name: "Cairns Nail Studio", city: "Cairns", state: "QLD", address: "999 Esplanade, Cairns QLD 4870", phone: "(07) 4067 8901" },
      { name: "Toowoomba Nail Bar", city: "Toowoomba", state: "QLD", address: "1010 Ruthven St, Toowoomba QLD 4350", phone: "(07) 4632 1098" },
      
      // Perth, WA
      { name: "Perth Nail Gallery", city: "Perth", state: "WA", address: "1111 Hay St, Perth WA 6000", phone: "(08) 9876 5432" },
      { name: "Fremantle Nail Spa", city: "Fremantle", state: "WA", address: "1212 South Terrace, Fremantle WA 6160", phone: "(08) 9234 5678" },
      { name: "Scarborough Beach Nails", city: "Scarborough", state: "WA", address: "1313 West Coast Hwy, Scarborough WA 6019", phone: "(08) 9876 1234" },
      { name: "Joondalup Nail Design", city: "Joondalup", state: "WA", address: "1414 Joondalup Dr, Joondalup WA 6027", phone: "(08) 9567 8901" },
      { name: "Subiaco Nail Studio", city: "Subiaco", state: "WA", address: "1515 Rokeby Rd, Subiaco WA 6008", phone: "(08) 9432 1098" },
      
      // Adelaide, SA
      { name: "Adelaide Nail Boutique", city: "Adelaide", state: "SA", address: "1616 Rundle Mall, Adelaide SA 5000", phone: "(08) 8876 5432" },
      { name: "Glenelg Nail Bar", city: "Glenelg", state: "SA", address: "1717 Jetty Rd, Glenelg SA 5045", phone: "(08) 8234 5678" },
      { name: "Norwood Nail Lounge", city: "Norwood", state: "SA", address: "1818 The Parade, Norwood SA 5067", phone: "(08) 8876 1234" },
      { name: "Hindmarsh Nail Studio", city: "Hindmarsh", state: "SA", address: "1919 Port Rd, Hindmarsh SA 5007", phone: "(08) 8567 8901" },
      
      // Hobart, TAS
      { name: "Hobart Nail Haven", city: "Hobart", state: "TAS", address: "2020 Elizabeth St, Hobart TAS 7000", phone: "(03) 6234 5678" },
      { name: "Sandy Bay Nail Spa", city: "Sandy Bay", state: "TAS", address: "2121 Sandy Bay Rd, Sandy Bay TAS 7005", phone: "(03) 6876 1234" },
      
      // Darwin, NT  
      { name: "Darwin Nail Studio", city: "Darwin", state: "NT", address: "2222 Smith St, Darwin NT 0800", phone: "(08) 8981 5432" },
      { name: "Casuarina Nail Bar", city: "Casuarina", state: "NT", address: "2323 Trower Rd, Casuarina NT 0810", phone: "(08) 8927 1234" },
      
      // Canberra, ACT
      { name: "Canberra Nail Gallery", city: "Canberra", state: "ACT", address: "2424 Northbourne Ave, Canberra ACT 2601", phone: "(02) 6234 5678" },
      { name: "Civic Nail Lounge", city: "Civic", state: "ACT", address: "2525 City Walk, Civic ACT 2601", phone: "(02) 6876 1234" }
    ];
    
    console.log(`📊 Preparing to import ${sampleSalons.length} sample salons...`);
    
    let importedCount = 0;
    let cityCache = {};
    
    for (let i = 0; i < sampleSalons.length; i++) {
      const salon = sampleSalons[i];
      const progress = `[${i + 1}/${sampleSalons.length}]`;
      
      console.log(`${progress} Processing: ${salon.name} in ${salon.city}, ${salon.state}`);
      
      try {
        const stateId = stateMap[salon.state];
        if (!stateId) {
          console.log(`   ❌ Unknown state: ${salon.state}`);
          continue;
        }
        
        // Get or create city
        const cityKey = `${salon.city}_${stateId}`;
        let cityId = cityCache[cityKey];
        
        if (!cityId) {
          // Check if city exists
          const { data: existingCity } = await supabase
            .from('cities')
            .select('id')
            .eq('name', salon.city)
            .eq('state_id', stateId)
            .maybeSingle();
          
          if (existingCity) {
            cityId = existingCity.id;
            console.log(`   🏙️ Found existing city: ${salon.city}`);
          } else {
            // Create new city
            const { data: newCity, error: cityError } = await supabase
              .from('cities')
              .insert({
                name: salon.city,
                state_id: stateId,
                latitude: null, // We don't have coordinates for these samples
                longitude: null
              })
              .select('id')
              .single();
            
            if (cityError) {
              console.log(`   ❌ Error creating city: ${cityError.message}`);
              continue;
            }
            
            cityId = newCity.id;
            console.log(`   🏙️ Created new city: ${salon.city}`);
          }
          
          cityCache[cityKey] = cityId;
        }
        
        // Create salon with realistic filter values
        const salonData = {
          name: salon.name,
          address: salon.address,
          city_id: cityId,
          phone: salon.phone,
          website: `https://www.${salon.name.toLowerCase().replace(/\\s+/g, '')}.com.au`,
          latitude: null,
          longitude: null,
          
          // Basic amenities
          kid_friendly: Math.random() > 0.3,
          parking: Math.random() > 0.2,
          wheelchair_accessible: Math.random() > 0.4,
          accepts_walk_ins: Math.random() > 0.3,
          appointment_only: Math.random() > 0.7,
          credit_cards_accepted: Math.random() > 0.1,
          cash_only: Math.random() > 0.9,
          gift_cards_available: Math.random() > 0.4,
          loyalty_program: Math.random() > 0.6,
          online_booking: Math.random() > 0.5,
          
          // Nail services
          manicure: true,
          pedicure: Math.random() > 0.2,
          gel_nails: Math.random() > 0.3,
          acrylic_nails: Math.random() > 0.4,
          nail_art: Math.random() > 0.5,
          dip_powder: Math.random() > 0.6,
          shellac: Math.random() > 0.4,
          nail_extensions: Math.random() > 0.5,
          nail_repair: Math.random() > 0.3,
          cuticle_care: Math.random() > 0.2,
          
          // Staff and atmosphere
          master_artist: Math.random() > 0.8,
          certified_technicians: Math.random() > 0.3,
          experienced_staff: Math.random() > 0.2,
          luxury_experience: Math.random() > 0.7,
          relaxing_atmosphere: Math.random() > 0.4,
          modern_facilities: Math.random() > 0.5,
          clean_hygienic: Math.random() > 0.1,
          friendly_service: Math.random() > 0.2,
          quick_service: Math.random() > 0.4,
          premium_products: Math.random() > 0.6
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
        
      } catch (err) {
        console.log(`   ❌ Error processing salon: ${err.message}`);
      }
    }
    
    console.log(`\\n🎉 Sample import completed!`);
    console.log(`📊 Final stats:`);
    console.log(`   - Salons imported: ${importedCount}/${sampleSalons.length}`);
    console.log(`   - Cities created: ${Object.keys(cityCache).length}`);
    console.log(`   - Success rate: ${((importedCount / sampleSalons.length) * 100).toFixed(1)}%`);
    
    return importedCount > 0;
    
  } catch (err) {
    console.log('❌ Import failed:', err.message);
    return false;
  }
}

createSampleSalons().then(success => {
  if (success) {
    console.log('\\n🎊 SUCCESS! Your NailNav website now has sample Australian salons!');
    console.log('🌐 Visit your website to see them live!');
  }
  process.exit(success ? 0 : 1);
});