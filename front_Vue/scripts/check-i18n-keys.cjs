/**
 * [ i18n Key Consistency & Leakage Checker ]
 * ko 로케일을 기준으로 다른 언어팩의 키 일관성을 검사하고,
 * 비-ko 파일에서 한국어 누수 및 [TODO] 항목을 탐지합니다.
 */
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');
const masterLocale = 'ko';
const targetLocales = ['en', 'es', 'ja', 'zh-TW', 'ru'];

let overallSuccess = true;

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

function hasKorean(text) {
  return typeof text === 'string' && /[\uac00-\ud7af]/.test(text);
}

function isTodoValue(text) {
  return typeof text === 'string' && /\[TODO/i.test(text);
}

console.log('========================================');
console.log('🌐 i18n Consistency & Leakage Check');
console.log('========================================\n');

const masterFiles = fs.readdirSync(path.join(localesDir, masterLocale))
  .filter(file => file.endsWith('.json'));

targetLocales.forEach(locale => {
  console.log(`Checking [${locale}]...`);
  let localeSuccess = true;
  
  masterFiles.forEach(file => {
    const masterFilePath = path.join(localesDir, masterLocale, file);
    const targetFilePath = path.join(localesDir, locale, file);
    
    if (!fs.existsSync(targetFilePath)) {
      console.error(`  ❌ Missing file: ${file}`);
      localeSuccess = false;
      overallSuccess = false;
      return;
    }
    
    try {
      const masterContent = JSON.parse(fs.readFileSync(masterFilePath, 'utf8'));
      const targetContent = JSON.parse(fs.readFileSync(targetFilePath, 'utf8'));
      
      const masterKeys = getAllKeys(masterContent);
      const targetKeys = getAllKeys(targetContent);
      
      const missingKeys = masterKeys.filter(k => !targetKeys.includes(k));
      if (missingKeys.length > 0) {
        console.error(`  ❌ ${file}: Missing keys (${missingKeys.length})`);
        missingKeys.forEach(k => console.error(`     - ${k}`));
        localeSuccess = false;
        overallSuccess = false;
      }

      // Value checks
      targetKeys.forEach(k => {
        const val = k.split('.').reduce((o, i) => (o ? o[i] : undefined), targetContent);
        
        if (val === "" || val === null || val === undefined) {
           console.error(`  ❌ ${file}: Empty value for key: ${k}`);
           localeSuccess = false;
           overallSuccess = false;
        }

        if (hasKorean(val)) {
           console.error(`  ❌ ${file}: Korean leakage in key: ${k}`);
           console.error(`     Value: "${val}"`);
           localeSuccess = false;
           overallSuccess = false;
        }

        if (isTodoValue(val)) {
           console.error(`  ❌ ${file}: TODO found in key: ${k}`);
           localeSuccess = false;
           overallSuccess = false;
        }
      });
    } catch (e) {
      console.error(`  ❌ ${file}: Failed to parse or check JSON - ${e.message}`);
      localeSuccess = false;
      overallSuccess = false;
    }
  });
  
  if (localeSuccess) {
    console.log(`  ✅ [${locale}] is clean and consistent\n`);
  } else {
    console.log(`  ❌ [${locale}] has issues\n`);
  }
});

console.log('\n========================================');
if (overallSuccess) {
  console.log('🎉 i18n consistency and leakage check passed!');
  process.exit(0);
} else {
  console.error('💥 i18n check failed.');
  process.exit(1);
}