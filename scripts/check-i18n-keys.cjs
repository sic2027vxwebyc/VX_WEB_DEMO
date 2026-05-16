/**
 * [ i18n Key Consistency & Spatial Data Contract Checker ]
 * ko 로케일을 기준으로 다른 언어팩의 키 일관성을 검사하고,
 * 전역적인 Spatial Data i18n Contract 준수 여부를 확인합니다.
 */
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');
const masterLocale = 'ko';
const targetLocales = ['en', 'es', 'ja', 'zh-TW', 'ru'];

let overallSuccess = true;

// 재귀적으로 객체의 모든 키를 추출하는 함수
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

console.log('========================================');
console.log('🌐 i18n Consistency Check (Master: ko)');
console.log('========================================\n');

// 1. ko 로케일의 모든 파일 목록 가져오기
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
      const extraKeys = targetKeys.filter(k => !masterKeys.includes(k));
      
      if (missingKeys.length > 0) {
        console.error(`  ❌ ${file}: Missing keys (${missingKeys.length})`);
        missingKeys.forEach(k => console.error(`     - ${k}`));
        localeSuccess = false;
        overallSuccess = false;
      }
      
      if (extraKeys.length > 0) {
        console.warn(`  ⚠️ ${file}: Extra keys found (${extraKeys.length})`);
        extraKeys.forEach(k => console.warn(`     + ${k}`));
      }

      // Check for empty values
      targetKeys.forEach(k => {
        const val = k.split('.').reduce((o, i) => o[i], targetContent);
        if (val === "" || val === null || val === undefined) {
           console.error(`  ❌ ${file}: Empty value for key: ${k}`);
           localeSuccess = false;
           overallSuccess = false;
        }

        // 2. HTML detection in JSON
        if (typeof val === 'string' && (val.includes('<br') || val.includes('<span') || val.includes('class='))) {
           console.error(`  ❌ ${file}: Forbidden HTML in message for key: ${k}`);
           console.error(`     Value: "${val}"`);
           localeSuccess = false;
           overallSuccess = false;
        }
      });

      // 3. Hyphenated keys check (Spatial Contract)
      if (file === 'spaces.json' || file === 'gamification.json') {
         const hyphenKeys = masterKeys.filter(k => {
           const segments = k.split('.');
           return segments[segments.length - 2] && segments[segments.length - 2].includes('-');
         });
         if (hyphenKeys.length > 0) {
            console.error(`  ❌ ${file}: Hyphenated keys are forbidden for item IDs (${hyphenKeys.length})`);
            hyphenKeys.forEach(k => console.error(`     - ${k} (Use camelCase for i18n keys)`));
            overallSuccess = false;
         }
      }

    } catch (e) {
      console.error(`  ❌ ${file}: Failed to parse JSON`);
      localeSuccess = false;
      overallSuccess = false;
    }
  });
  
  if (localeSuccess) {
    console.log(`  ✅ [${locale}] is consistent with [ko]\n`);
  } else {
    console.log(`  ❌ [${locale}] has mismatches\n`);
  }
});

// 4. Dynamic i18n Key Generation detection in code
console.log('Checking for forbidden i18n patterns in code...');
const srcDir = path.join(__dirname, '../src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const forbiddenPatterns = [
  { regex: /t\(`spaces\.\$\{.*?\}\..*?`\)/, message: 'Forbidden dynamic spaces key template literal' },
  { regex: /t\(['"]spaces\.['"]\s*\+\s*.*?\s*\+\s*['"]\..*?['"]\)/, message: 'Forbidden dynamic spaces key concatenation' },
  { regex: /t\((space|marker|item|noti|scanResult|badge)\.id\)/, message: 'Forbidden raw ID translation call t(obj.id)' },
  { regex: /t\(`gamification\.items\.\$\{.*?\}\.name`\)/, message: 'Forbidden dynamic gamification key template literal' },
  { regex: /t\(`badges\.items\.\$\{.*?\}\..*?`\)/, message: 'Forbidden dynamic badges key template literal' },
  { regex: /t\(`spaces\.\$\{.*?\}\`\)/, message: 'Forbidden dynamic spaces key' }
];

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.vue') || filePath.endsWith('.js')) {
    // Exclude this script and the resolver utility itself
    if (filePath.includes('check-i18n-keys.cjs') || filePath.includes('i18nResolver.js') || filePath.includes('spaceI18n.js') || filePath.includes('spaces.js')) return;
    if (filePath.includes('UnUsed')) return;

    const content = fs.readFileSync(filePath, 'utf8');
    forbiddenPatterns.forEach(pattern => {
      if (pattern.regex.test(content)) {
        console.error(`  ❌ ${pattern.message} in ${path.relative(process.cwd(), filePath)}`);
        overallSuccess = false;
      }
    });
  }
});

console.log('\n========================================');
if (overallSuccess) {
  console.log('🎉 All i18n and Spatial Contract checks passed!');
  process.exit(0);
} else {
  console.error('💥 i18n consistency or contract check failed.');
  process.exit(1);
}
