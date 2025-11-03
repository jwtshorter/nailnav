const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bmlvjgulciphdqyqucxv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHZqZ3VsY2lwaGRxeXF1Y3h2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg5NDgyOSwiZXhwIjoyMDc1NDcwODI5fQ.UFt0S3Tunw3DRnCG-IGYCA_zJs58w08';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('Testing Supabase connection...');
  
  // Check if salons table exists and has data
  const { data: salons, error } = await supabase
    .from('salons')
    .select('id, name, city')
    .limit(5);
  
  if (error) {
    console.log('Error:', error.message);
    console.log('Code:', error.code);
    return;
  }
  
  console.log('Success! Found', salons.length, 'salons');
  salons.forEach(s => console.log('-', s.name, 'in', s.city));
}

checkDatabase();
