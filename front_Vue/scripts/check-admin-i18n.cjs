const fs = require('fs');
const path = require('path');

const locales = ['en', 'ja', 'zh-TW', 'es', 'ru'];
const files = ['admin.json', 'navigation.json'];
const sourceLocale = 'ko';

function getKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

files.forEach(file => {
  const sourcePath = path.join('src/i18n/locales', sourceLocale, file);
  if (!fs.existsSync(sourcePath)) return;
  const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const sourceKeys = getKeys(sourceData);

  locales.forEach(locale => {
    const targetPath = path.join('src/i18n/locales', locale, file);
    if (!fs.existsSync(targetPath)) {
      console.log(`Missing file: ${targetPath}`);
      return;
    }
    const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    const targetKeys = getKeys(targetData);

    const missing = sourceKeys.filter(k => !targetKeys.includes(k));
    if (missing.length > 0) {
      console.log(`Locale ${locale}, File ${file} is missing ${missing.length} keys:`);
      missing.forEach(k => console.log(`  - ${k}`));
    }
  });
});
