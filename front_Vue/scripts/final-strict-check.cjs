const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');
const masterLocale = 'ko';
const targetLocales = ['en', 'es', 'ja', 'zh-TW', 'ru'];

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

let totalErrors = 0;

targetLocales.forEach(locale => {
  const masterFiles = fs.readdirSync(path.join(localesDir, masterLocale)).filter(f => f.endsWith('.json'));

  masterFiles.forEach(file => {
    const masterPath = path.join(localesDir, masterLocale, file);
    const targetPath = path.join(localesDir, locale, file);
    
    if (!fs.existsSync(targetPath)) {
      console.error(`[CRITICAL] Missing file in ${locale}: ${file}`);
      totalErrors++;
      return;
    }

    const masterObj = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    const targetObj = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

    const masterKeys = getAllKeys(masterObj);
    const targetKeys = getAllKeys(targetObj);

    // Key existence check
    masterKeys.forEach(key => {
      if (!targetKeys.includes(key)) {
        console.error(`[MISSING] ${locale}/${file} -> Key: "${key}"`);
        totalErrors++;
      }
    });

    // Value leakage/TODO check
    targetKeys.forEach(key => {
      const val = key.split('.').reduce((o, i) => o[i], targetObj);
      if (typeof val === 'string') {
        if (/[\uac00-\ud7af]/.test(val)) {
          console.error(`[LEAKAGE] ${locale}/${file} -> Key: "${key}" contains Korean: "${val}"`);
          totalErrors++;
        }
        if (/\[TODO/i.test(val)) {
          console.error(`[TODO] ${locale}/${file} -> Key: "${key}" is pending: "${val}"`);
          totalErrors++;
        }
      }
    });
  });
});

if (totalErrors === 0) {
  console.log("\n✅ ALL CHECKS PASSED: No missing keys, no Korean leakage, no [TODO] tags found in any locale.");
} else {
  console.error(`\n❌ FAILED: Found ${totalErrors} issues.`);
  process.exit(1);
}
