const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

function verifyKeys() {
  console.log('🔍 Verifying Supabase keys...');
  
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  try {
    // Decode anon key
    const anonDecoded = jwt.decode(anonKey);
    console.log('✅ Anon key decoded:');
    console.log(`   - Project ref: ${anonDecoded.ref}`);
    console.log(`   - Role: ${anonDecoded.role}`);
    console.log(`   - Issued at: ${new Date(anonDecoded.iat * 1000).toISOString()}`);
    console.log(`   - Expires: ${new Date(anonDecoded.exp * 1000).toISOString()}`);
    
    // Decode service key
    const serviceDecoded = jwt.decode(serviceKey);
    console.log('✅ Service key decoded:');
    console.log(`   - Project ref: ${serviceDecoded.ref}`);
    console.log(`   - Role: ${serviceDecoded.role}`);
    console.log(`   - Issued at: ${new Date(serviceDecoded.iat * 1000).toISOString()}`);
    console.log(`   - Expires: ${new Date(serviceDecoded.exp * 1000).toISOString()}`);
    
    // Check if they're from the same project
    if (anonDecoded.ref !== serviceDecoded.ref) {
      console.log('❌ Keys are from different projects!');
      console.log(`   Anon: ${anonDecoded.ref}`);
      console.log(`   Service: ${serviceDecoded.ref}`);
      return false;
    }
    
    // Check if service key has the right role
    if (serviceDecoded.role !== 'service_role') {
      console.log('❌ Service key does not have service_role!');
      console.log(`   Found role: ${serviceDecoded.role}`);
      return false;
    }
    
    console.log('🎉 Both keys are valid and from the same project!');
    return true;
    
  } catch (err) {
    console.log('❌ Error decoding keys:', err.message);
    return false;
  }
}

const isValid = verifyKeys();
console.log(isValid ? '✅ Keys are good to use!' : '❌ Please check your keys');
process.exit(isValid ? 0 : 1);