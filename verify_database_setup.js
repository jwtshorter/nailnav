const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verifySetup() {
  console.log('🔍 Verifying database setup...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const supabase = createClient(supabaseUrl, anonKey);
  
  const checks = [];
  
  try {
    // Check countries table
    console.log('1️⃣ Checking countries table...');
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('id, name, code');
    
    if (countriesError) {
      checks.push({ table: 'countries', status: 'FAILED', error: countriesError.message });
    } else {
      checks.push({ 
        table: 'countries', 
        status: 'SUCCESS', 
        count: countries.length,
        data: countries.map(c => `${c.name} (${c.code})`).join(', ')
      });
    }
    
    // Check states table
    console.log('2️⃣ Checking states table...');
    const { data: states, error: statesError } = await supabase
      .from('states')
      .select('id, name, code');
    
    if (statesError) {
      checks.push({ table: 'states', status: 'FAILED', error: statesError.message });
    } else {
      checks.push({ 
        table: 'states', 
        status: 'SUCCESS', 
        count: states.length,
        data: states.map(s => `${s.name} (${s.code})`).join(', ')
      });
    }
    
    // Check cities table
    console.log('3️⃣ Checking cities table...');
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('id, name')
      .limit(10);
    
    if (citiesError) {
      checks.push({ table: 'cities', status: 'FAILED', error: citiesError.message });
    } else {
      checks.push({ 
        table: 'cities', 
        status: 'SUCCESS', 
        count: cities.length,
        note: cities.length === 0 ? 'Empty (will be populated during import)' : `Sample: ${cities.map(c => c.name).join(', ')}`
      });
    }
    
    // Check salons table structure
    console.log('4️⃣ Checking salons table...');
    const { data: salons, error: salonsError } = await supabase
      .from('salons')
      .select('id, name')
      .limit(5);
    
    if (salonsError) {
      checks.push({ table: 'salons', status: 'FAILED', error: salonsError.message });
    } else {
      checks.push({ 
        table: 'salons', 
        status: 'SUCCESS', 
        count: salons.length,
        note: salons.length === 0 ? 'Empty (ready for import)' : `Has ${salons.length} existing salons`
      });
    }
    
    // Try to test a filter column
    console.log('5️⃣ Checking filter columns...');
    const { data: filterTest, error: filterError } = await supabase
      .from('salons')
      .select('id, kid_friendly, parking, online_booking')
      .limit(1);
    
    if (filterError) {
      if (filterError.message.includes('does not exist')) {
        checks.push({ 
          table: 'salon_filters', 
          status: 'FAILED', 
          error: 'Filter columns not created yet. Please run Block 4, 5, and 6 from the manual setup.'
        });
      } else {
        checks.push({ table: 'salon_filters', status: 'FAILED', error: filterError.message });
      }
    } else {
      checks.push({ table: 'salon_filters', status: 'SUCCESS', note: 'Filter columns are ready' });
    }
    
  } catch (err) {
    console.log('❌ Verification failed:', err.message);
    return false;
  }
  
  // Print results
  console.log('\\n📋 VERIFICATION RESULTS:');
  console.log('========================');
  
  let allGood = true;
  
  checks.forEach(check => {
    if (check.status === 'SUCCESS') {
      console.log(`✅ ${check.table.toUpperCase()}: ${check.count !== undefined ? check.count + ' records' : 'OK'}`);
      if (check.data) console.log(`   Data: ${check.data}`);
      if (check.note) console.log(`   Note: ${check.note}`);
    } else {
      console.log(`❌ ${check.table.toUpperCase()}: FAILED`);
      console.log(`   Error: ${check.error}`);
      allGood = false;
    }
  });
  
  console.log('\\n' + '='.repeat(50));
  
  if (allGood) {
    console.log('🎉 DATABASE SETUP COMPLETE!');
    console.log('✅ All tables are ready');
    console.log('✅ All columns are created');
    console.log('✅ Ready to import salon data');
    console.log('');
    console.log('👉 Next step: Run salon import');
    console.log('   Command: node import_salons_final.js');
  } else {
    console.log('⚠️ DATABASE SETUP INCOMPLETE');
    console.log('👉 Please complete the manual setup:');
    console.log('   1. Open: https://supabase.com/dashboard/project/bmlvjgulciphdqyqucxv');
    console.log('   2. Go to SQL Editor');
    console.log('   3. Run all blocks from MANUAL_SETUP_SQL.md');
    console.log('   4. Run this verification script again');
  }
  
  return allGood;
}

verifySetup().then(success => {
  process.exit(success ? 0 : 1);
});