const XLSX = require('xlsx');
const fs = require('fs');

console.log('📊 Converting Excel to CSV for easier processing...');

try {
  // Read first 100 rows only to avoid memory issues
  console.log('📖 Reading Australian_Salons.xlsx (first 100 rows only)...');
  
  const workbook = XLSX.readFile('Australian_Salons.xlsx');
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
  // Get only first 100 rows
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const limitedRange = `A1:${XLSX.utils.encode_col(range.e.c)}100`;
  
  console.log(`📏 Using range: ${limitedRange}`);
  
  // Convert to JSON first to see structure
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
    range: limitedRange,
    header: 1 // Use first row as headers
  });
  
  console.log(`📄 Found ${jsonData.length} rows (including header)`);
  
  if (jsonData.length > 1) {
    const headers = jsonData[0];
    console.log(`\\n📋 Column headers (${headers.length} columns):`);
    headers.forEach((header, i) => {
      console.log(`   ${i + 1}. "${header}"`);
    });
    
    // Show sample data
    console.log(`\\n🔍 Sample data from first 3 salons:`);
    for (let i = 1; i <= Math.min(3, jsonData.length - 1); i++) {
      const row = jsonData[i];
      console.log(`\\n   Salon ${i}:`);
      headers.forEach((header, j) => {
        if (j < 10) { // Show only first 10 columns
          console.log(`     ${header}: "${row[j] || 'EMPTY'}"`);
        }
      });
    }
    
    // Convert to CSV
    console.log('\\n💾 Converting to CSV...');
    const csv = XLSX.utils.sheet_to_csv(worksheet, { range: limitedRange });
    fs.writeFileSync('australian_salons_sample.csv', csv);
    console.log('✅ Saved as australian_salons_sample.csv');
    
    // Also save JSON version
    const jsonRows = jsonData.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || '';
      });
      return obj;
    });
    
    fs.writeFileSync('australian_salons_sample.json', JSON.stringify(jsonRows, null, 2));
    console.log('✅ Saved as australian_salons_sample.json');
    
    console.log(`\\n📊 Conversion complete:`);
    console.log(`   - Total salons: ${jsonRows.length}`);
    console.log(`   - Columns: ${headers.length}`);
    
  } else {
    console.log('❌ No data found in Excel file');
  }
  
} catch (err) {
  console.log('❌ Error converting file:', err.message);
}