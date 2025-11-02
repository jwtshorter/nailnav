const XLSX = require('xlsx');
const fs = require('fs');

console.log('📊 Analyzing Excel file structure...');

try {
  // Read with different options to handle large file
  const workbook = XLSX.readFile('Australian_Salons.xlsx', {
    cellText: false,
    cellDates: true
  });
  
  const sheetName = workbook.SheetNames[0];
  console.log(`📄 Sheet name: "${sheetName}"`);
  
  const worksheet = workbook.Sheets[sheetName];
  
  // Get range info
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  console.log(`📏 Range: ${range.s.r} to ${range.e.r} rows, ${range.s.c} to ${range.e.c} columns`);
  console.log(`📈 Total rows: ${range.e.r + 1} (including header)`);
  
  // Get header row
  const headers = [];
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    const cell = worksheet[cellAddress];
    headers.push(cell ? cell.v : `Column_${col}`);
  }
  
  console.log(`\\n📋 Found ${headers.length} columns:`);
  headers.forEach((header, i) => {
    console.log(`   ${i + 1}. "${header}"`);
  });
  
  // Sample first few data rows
  console.log(`\\n🔍 Sample data from first 5 rows:`);
  for (let row = 1; row <= Math.min(5, range.e.r); row++) {
    console.log(`\\n   Row ${row}:`);
    for (let col = 0; col < Math.min(10, headers.length); col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];
      const value = cell ? cell.v : 'EMPTY';
      console.log(`     ${headers[col]}: "${value}"`);
    }
  }
  
  // Try to convert just first 10 rows to see structure
  const limitedRange = `A1:${XLSX.utils.encode_col(range.e.c)}11`; // Header + 10 rows
  const sampleData = XLSX.utils.sheet_to_json(worksheet, { range: limitedRange });
  
  console.log(`\\n📝 Sample JSON conversion (first 3 records):`);
  sampleData.slice(0, 3).forEach((record, i) => {
    console.log(`\\n   Record ${i + 1}:`);
    Object.entries(record).slice(0, 8).forEach(([key, value]) => {
      console.log(`     ${key}: "${value}"`);
    });
  });
  
} catch (err) {
  console.log('❌ Error analyzing file:', err.message);
}