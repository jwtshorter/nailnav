const XLSX = require('xlsx');

console.log('📖 Reading Excel file to check column structure...');

const workbook = XLSX.readFile('Australian_Salons.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// Get the first few rows to see structure
const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: 0, header: 1 });
const firstRow = jsonData[0];

console.log('📋 Column names found:');
Object.keys(firstRow).forEach((key, index) => {
  console.log(`   ${index + 1}. "${key}"`);
});

console.log('\\n📊 Sample data from first salon:');
Object.entries(firstRow).slice(0, 10).forEach(([key, value]) => {
  console.log(`   ${key}: "${value}"`);
});

console.log(`\\n📈 Total salons: ${jsonData.length}`);
console.log(`\\n🔍 First 3 salons overview:`);
jsonData.slice(0, 3).forEach((salon, i) => {
  const name = salon['Business Name'] || salon['Name'] || salon['BusinessName'] || 'Unnamed';
  const city = salon['City'] || salon['Suburb'] || 'Unknown City';  
  const state = salon['State'] || salon['Province'] || 'Unknown State';
  console.log(`   ${i + 1}. ${name} - ${city}, ${state}`);
});