const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('Australian_Salons.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('=== EXCEL FILE ANALYSIS ===\n');
console.log(`Total rows: ${data.length}`);
console.log(`\nColumn headers:`);

if (data.length > 0) {
  const headers = Object.keys(data[0]);
  headers.forEach((header, index) => {
    console.log(`${index + 1}. ${header}`);
  });
  
  console.log('\n=== SAMPLE DATA (First Row) ===\n');
  console.log(JSON.stringify(data[0], null, 2));
  
  console.log('\n=== SAMPLE DATA (Second Row) ===\n');
  if (data[1]) {
    console.log(JSON.stringify(data[1], null, 2));
  }
  
  // Analyze BE:DE columns (filter items)
  console.log('\n=== FILTER COLUMNS (BE:DE) ===\n');
  const filterColumns = headers.filter(h => {
    const colIndex = XLSX.utils.decode_col(h);
    return colIndex >= 56 && colIndex <= 108; // BE=56, DE=108
  });
  
  if (filterColumns.length === 0) {
    // Try finding them by position or pattern
    const sampleRow = data[0];
    const possibleFilterCols = headers.filter(h => {
      const val = sampleRow[h];
      return typeof val === 'boolean' || val === 'Yes' || val === 'No' || val === 'TRUE' || val === 'FALSE';
    });
    console.log('Possible filter columns (boolean values):');
    possibleFilterCols.forEach(col => {
      console.log(`  - ${col}: ${sampleRow[col]}`);
    });
  } else {
    console.log('Filter columns found:');
    filterColumns.forEach(col => console.log(`  - ${col}`));
  }
  
  // Check for Description column
  console.log('\n=== DESCRIPTION FIELD ===');
  const descCol = headers.find(h => h.toLowerCase().includes('description'));
  if (descCol) {
    console.log(`Found: ${descCol}`);
    console.log(`Sample: ${data[0][descCol]?.substring(0, 200)}...`);
  } else {
    console.log('Description column not found directly');
  }
}

// Save analysis to file
fs.writeFileSync('salon-analysis.json', JSON.stringify({
  totalRows: data.length,
  headers: data.length > 0 ? Object.keys(data[0]) : [],
  sampleRows: data.slice(0, 3)
}, null, 2));

console.log('\n✅ Analysis saved to salon-analysis.json');
