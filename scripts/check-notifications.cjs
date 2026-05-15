const fs = require('fs');
const path = require('path');

const locales = ['ko', 'en', 'ja', 'zh-TW', 'es', 'ru'];
const domains = ['notifications'];

console.log('--- i18n:check-notifications (Domain Structure Validation) ---');

function getKeys(obj, prefix = '') {
  let keys = new Set();
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      const subKeys = getKeys(obj[key], `${prefix}${key}.`);
      subKeys.forEach(k => keys.add(k));
    } else {
      keys.add(`${prefix}${key}`);
    }
  }
  return keys;
}

let hasError = false;

domains.forEach(domain => {
  const koPath = path.resolve(process.cwd(), `src/i18n/locales/ko/${domain}.json`);
  const koData = JSON.parse(fs.readFileSync(koPath, 'utf8'));
  const koKeys = getKeys(koData);

  locales.forEach(locale => {
    if (locale === 'ko') return;
    const targetPath = path.resolve(process.cwd(), `src/i18n/locales/${locale}/${domain}.json`);
    if (!fs.existsSync(targetPath)) {
      console.error(`[FAIL] [${locale}] ${domain}.json is missing.`);
      hasError = true;
      return;
    }

    const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    const targetKeys = getKeys(targetData);

    const missing = [...koKeys].filter(k => !targetKeys.has(k));
    
    if (missing.length > 0) {
      console.error(`[FAIL] [${locale}] ${domain}.json missing keys:`, missing);
      hasError = true;
    } else {
      console.log(`[PASS] [${locale}] ${domain}.json structure is consistent.`);
    }
  });
});

if (hasError) {
  console.log('\nResult: FAIL - Domain structural issues found.');
  process.exit(1);
} else {
  console.log('\nResult: PASS - All notification-related locale domains are consistent.');
  process.exit(0);
}
