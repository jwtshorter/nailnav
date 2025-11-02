const XLSX = require('xlsx');

const workbook = XLSX.readFile('Australian_Salons.xlsx', { sheetRows: 3 });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const range = XLSX.utils.decode_range(worksheet['!ref']);

// Get all headers
const headers = [];
for (let col = range.s.c; col <= range.e.c; col++) {
  const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
  const cell = worksheet[cellAddress];
  if (cell) {
    headers.push({ 
      colLetter: XLSX.utils.encode_col(col), 
      colIndex: col,
      name: cell.v 
    });
  }
}

// Find BE to DE columns (56 to 108 in 0-indexed)
console.log('=== FILTER COLUMNS (BE to DE) ===\n');
const filterHeaders = headers.filter(h => h.colIndex >= 56 && h.colIndex <= 108);
filterHeaders.forEach(h => {
  // Get sample value from row 1
  const cellAddress = XLSX.utils.encode_cell({ r: 1, c: h.colIndex });
  const cell = worksheet[cellAddress];
  console.log(`${h.colLetter}. ${h.name}: ${cell ? cell.v : 'empty'}`);
});

// Find Description column (should be around DG)
console.log('\n=== DESCRIPTION COLUMN ===\n');
const descHeader = headers.find(h => h.colLetter === 'DG');
if (descHeader) {
  const cellAddress = XLSX.utils.encode_cell({ r: 1, c: descHeader.colIndex });
  const cell = worksheet[cellAddress];
  console.log(`Column: ${descHeader.colLetter}. ${descHeader.name}`);
  console.log(`Sample value:\n${cell ? cell.v : 'empty'}`);
}

// Show important location columns
console.log('\n=== LOCATION COLUMNS ===\n');
const locationCols = ['address', 'city', 'state', 'country', 'zip_code', 'latitude', 'longitude', 'full_address'];
headers.filter(h => locationCols.some(lc => h.name.toLowerCase().includes(lc))).forEach(h => {
  const cellAddress = XLSX.utils.encode_cell({ r: 1, c: h.colIndex });
  const cell = worksheet[cellAddress];
  console.log(`${h.colLetter}. ${h.name}: ${cell ? cell.v : 'empty'}`);
});

console.log('\n✅ Done');
