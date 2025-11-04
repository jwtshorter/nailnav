const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkColumns() {
  // Get Darwin city_id
  const { data: cities } = await supabase
    .from('cities')
    .select('id, name')
    .eq('name', 'Darwin')
    .limit(1)
  
  console.log('Darwin city:', cities)
  
  if (!cities || cities.length === 0) return
  
  // Get Darwin salons with their service columns
  const { data: salons, error } = await supabase
    .from('salons')
    .select('id, name, city_id, nail_extensions, gel_nails, acrylic_nails, nail_art, dip_powder, shellac')
    .eq('city_id', cities[0].id)
    .eq('is_published', true)
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log(`\nFound ${salons.length} Darwin salons`)
  console.log('\nService columns availability:')
  salons.forEach(s => {
    console.log(`\n${s.name}:`)
    console.log(`  - nail_extensions: ${s.nail_extensions}`)
    console.log(`  - gel_nails: ${s.gel_nails}`)
    console.log(`  - acrylic_nails: ${s.acrylic_nails}`)
    console.log(`  - nail_art: ${s.nail_art}`)
    console.log(`  - dip_powder: ${s.dip_powder}`)
    console.log(`  - shellac: ${s.shellac}`)
  })
  
  // Count how many have each service
  const counts = {
    nail_extensions: salons.filter(s => s.nail_extensions).length,
    gel_nails: salons.filter(s => s.gel_nails).length,
    acrylic_nails: salons.filter(s => s.acrylic_nails).length,
    nail_art: salons.filter(s => s.nail_art).length,
    dip_powder: salons.filter(s => s.dip_powder).length,
    shellac: salons.filter(s => s.shellac).length
  }
  
  console.log('\n\n=== SUMMARY ===')
  console.log(`Total Darwin salons: ${salons.length}`)
  console.log(`With Nail Extensions: ${counts.nail_extensions}`)
  console.log(`With Gel Nails: ${counts.gel_nails}`)
  console.log(`With Acrylic Nails: ${counts.acrylic_nails}`)
  console.log(`With Nail Art: ${counts.nail_art}`)
  console.log(`With Dip Powder: ${counts.dip_powder}`)
  console.log(`With Shellac: ${counts.shellac}`)
}

checkColumns().catch(console.error)
