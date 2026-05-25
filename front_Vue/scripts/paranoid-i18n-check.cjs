const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');
const masterLocale = 'ko';
const targetLocales = ['en', 'es', 'ja', 'zh-TW', 'ru'];

function getAllKeysWithValues(obj, prefix = '') {
  let kv = {};
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(kv, getAllKeysWithValues(obj[key], fullKey));
    } else {
      kv[fullKey] = obj[key];
    }
  }
  return kv;
}

targetLocales.forEach(locale => {
  console.log(`\n=== Comparing [${locale}] with [ko] ===`);
  const masterFiles = fs.readdirSync(path.join(localesDir, masterLocale)).filter(f => f.endsWith('.json'));

  masterFiles.forEach(file => {
    const masterPath = path.join(localesDir, masterLocale, file);
    const targetPath = path.join(localesDir, locale, file);
    
    if (!fs.existsSync(targetPath)) return;

    const masterKV = getAllKeysWithValues(JSON.parse(fs.readFileSync(masterPath, 'utf8')));
    const targetKV = getAllKeysWithValues(JSON.parse(fs.readFileSync(targetPath, 'utf8')));

    for (const key in masterKV) {
      const masterVal = masterKV[key];
      const targetVal = targetKV[key];

      // 1. Missing check
      if (targetVal === undefined) {
        console.error(`[MISSING KEY] ${file} -> ${key}`);
        continue;
      }

      // 2. Identity check (Same as Korean)
      // Only check if masterVal contains Korean characters to avoid flagging IDs like "Hall 1"
      if (masterVal === targetVal && /[\uac00-\ud7af]/.test(masterVal)) {
        // Exception list for terms that might be same in some languages (rare, but possible)
        console.warn(`[POTENTIAL UNTRANSLATED] ${file} -> ${key}: "${masterVal}"`);
      }
    }
  });
});
