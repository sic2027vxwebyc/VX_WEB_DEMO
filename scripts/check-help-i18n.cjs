const fs = require('fs');
const path = require('path');

const localesDir = path.resolve(__dirname, '../src/i18n/locales');
const locales = ['ko', 'en', 'ja', 'zh-TW', 'es', 'ru'];
const helpQaViewPath = path.resolve(__dirname, '../src/views/HelpQaView.vue');

console.log('--- Help Q&A i18n Migration Check ---');

let allPassed = true;

// 1. Check HelpQaView.vue
const viewContent = fs.readFileSync(helpQaViewPath, 'utf8');
if (viewContent.includes('qaMarkdown') || viewContent.includes('?raw')) {
  console.log('[FAIL] HelpQaView.vue still contains raw markdown imports.');
  allPassed = false;
} else {
  console.log('[PASS] HelpQaView.vue raw import removed.');
}

if (viewContent.includes('tm(\'help.items\')') || viewContent.includes('tm("help.items")')) {
  console.log('[PASS] HelpQaView.vue uses tm(\'help.items\').');
} else {
  console.log('[FAIL] HelpQaView.vue does not use tm(\'help.items\').');
  allPassed = false;
}

if (viewContent.includes('item.answerRaw')) {
  console.log('[FAIL] HelpQaView.vue still uses item.answerRaw.');
  allPassed = false;
} else {
  console.log('[PASS] HelpQaView.vue uses item.answer.');
}

// 2. Check Locale Files
locales.forEach(locale => {
  const filePath = path.join(localesDir, locale, 'help.json');
  if (!fs.existsSync(filePath)) {
    console.log(`[FAIL] ${locale}/help.json missing.`);
    allPassed = false;
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.items || !Array.isArray(data.items)) {
      console.log(`[FAIL] ${locale}/help.json missing items array.`);
      allPassed = false;
    } else {
      console.log(`[PASS] ${locale}/help.json structure OK.`);
      
      // Check for empty content in Master (ko)
      if (locale === 'ko') {
        if (data.items.length === 0) {
          console.log('[FAIL] ko/help.json items are empty.');
          allPassed = false;
        } else {
          console.log(`[PASS] ko/help.json has ${data.items.length} items.`);
        }
      }
    }
  } catch (e) {
    console.log(`[FAIL] ${locale}/help.json invalid JSON.`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('--- ALL CHECKS PASSED ---');
  process.exit(0);
} else {
  console.log('--- SOME CHECKS FAILED ---');
  process.exit(1);
}
