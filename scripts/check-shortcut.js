const fs = require('fs');
const buf = fs.readFileSync('C:\\Users\\itzfa\\Desktop\\Poland Internship Hunter.lnk');
const str = buf.toString('latin1');
const matches = str.match(/[A-Z]:\\[a-zA-Z0-9_\-\.\\]+\.exe/gi);
console.log('Matches:', matches);

// Check if poland-internship-hunter.exe is in dist/win-unpacked or AppData
const possiblePaths = [
  'C:\\Users\\itzfa\\.gemini\\antigravity-ide\\scratch\\poland-internship-hunter\\dist\\win-unpacked\\poland-internship-hunter.exe',
  'C:\\Users\\itzfa\\AppData\\Local\\Programs\\poland-internship-hunter\\poland-internship-hunter.exe'
];
for (const p of possiblePaths) {
  console.log(p, 'exists:', fs.existsSync(p));
}
