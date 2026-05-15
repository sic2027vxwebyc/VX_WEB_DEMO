const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const errors = [];

languages.forEach(lang => {
  const langPath = path.join(localesDir, lang);
  const files = fs.readdirSync(langPath).filter(f => f.endsWith('.json'));

  files.forEach(file => {
    const filePath = path.join(langPath, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      JSON.parse(content);
    } catch (e) {
      errors.push({ file: `${lang}/${file}`, error: e.message });
    }
  });
});

if (errors.length > 0) {
  console.log('JSON Syntax Errors Found:');
  console.log(JSON.stringify(errors, null, 2));
  process.exit(1);
} else {
  console.log('All i18n JSON files are valid. ✅');
}
