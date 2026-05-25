const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../src/views/AdminDashboardView.vue'),
  // Add other admin components if they exist
];

const koreanRegex = /[가-힣]{2,}/g;
let foundHardcoded = false;

console.log('Scanning for hardcoded strings in Admin components...');

targetDirs.forEach(file => {
  if (!fs.existsSync(file)) return;

  const content = fs.readFileSync(file, 'utf-8');
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
  if (templateMatch) {
    let templateContent = templateMatch[1];
    // Remove HTML comments
    templateContent = templateContent.replace(/<!--[\s\S]*?-->/g, '');
    
    let match;
    while ((match = koreanRegex.exec(templateContent)) !== null) {
      console.log(`[Warning] Hardcoded UI string found in ${path.basename(file)}: "${match[0]}" at index ${match.index}`);
      foundHardcoded = true;
    }
  }
});

if (foundHardcoded) {
  console.log('Scan completed with warnings.');
  process.exit(1);
} else {
  console.log('No hardcoded Korean strings found in Admin templates! ✅');
}
