const XLSX = require('xlsx');

console.log('Reading file...');
const workbook = XLSX.readFile('Australian_Salons.xlsx', { sheetRows: 5 });
const sheetName = workbook.SheetNames[0];
console.log(`Sheet name: ${sheetName}`);

const worksheet = workbook.Sheets[sheetName];

// Get headers from first row
const range = XLSX.utils.decode_range(worksheet['!ref']);
console.log(`\nRange: ${range.s.r} to ${range.e.r} rows, ${range.s.c} to ${range.e.c} columns`);

const headers = [];
for (let col = range.s.c; col <= range.e.c; col++) {
  const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
  const cell = worksheet[cellAddress];
  if (cell) {
    headers.push({ col: XLSX.utils.encode_col(col), name: cell.v });
  }
}

console.log(`\n=== HEADERS (Total: ${headers.length}) ===`);
headers.forEach((h, i) => {
  if (i < 20 || i > headers.length - 20) {
    console.log(`${h.col}. ${h.name}`);
  } else if (i === 20) {
    console.log('...');
  }
});

// Get first data row
console.log('\n=== FIRST ROW VALUES (Sample) ===');
for (let col = range.s.c; col <= Math.min(range.s.c + 10, range.e.c); col++) {
  const cellAddress = XLSX.utils.encode_cell({ r: 1, c: col });
  const cell = worksheet[cellAddress];
  const header = headers[col]?.name || `Col${col}`;
  console.log(`${header}: ${cell ? cell.v : 'empty'}`);
}

console.log('\n✅ Done');
