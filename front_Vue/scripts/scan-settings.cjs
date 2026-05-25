const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '../src/views/SettingsView.vue'),
  path.join(__dirname, '../src/components/settings/LanguageSelector.vue')
];

const koreanRegex = /[가-힣]{2,}/g;
let foundHardcoded = false;

console.log('Scanning for hardcoded strings in Settings components...');

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) return;

  const content = fs.readFileSync(file, 'utf-8');
  // We want to avoid scanning the <script> tags where log messages are, but let's just flag templates for now.
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
  if (templateMatch) {
    const templateContent = templateMatch[1];
    let match;
    while ((match = koreanRegex.exec(templateContent)) !== null) {
      console.log(`[Warning] Hardcoded string found in ${path.basename(file)}: "${match[0]}" at index ${match.index}`);
      foundHardcoded = true;
    }
  }
});

if (foundHardcoded) {
  console.log('Scan completed with warnings.');
  process.exit(1);
} else {
  console.log('No hardcoded Korean strings found in Settings templates! ✅');
}
