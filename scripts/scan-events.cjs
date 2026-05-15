const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/views/EventScheduleView.vue'
];

const koreanRegex = /[가-힣]/;
let hasError = false;

console.log('--- i18n:scan-events (Hardcoded Korean Detection) ---');

targetFiles.forEach(file => {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*') || trimmedLine.startsWith('<!--')) return;
    
    let codeOnly = trimmedLine.split('//')[0].split('/*')[0].split('<!--')[0];
    
    if (codeOnly.includes('logger.') || codeOnly.includes('console.')) return;

    if (koreanRegex.test(codeOnly)) {
      if (codeOnly.trim() === '-->' || codeOnly.trim() === '*/') return;
      
      console.error(`[FAIL] ${file}:${index + 1}: ${trimmedLine}`);
      hasError = true;
    }
  });
});

if (hasError) {
  console.log('\nResult: FAIL - Hardcoded Korean strings found.');
  process.exit(1);
} else {
  console.log('\nResult: PASS - No hardcoded Korean found in UI code.');
  process.exit(0);
}
