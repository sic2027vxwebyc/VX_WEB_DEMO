const fs = require('fs');
const path = require('path');

const locales = ['ko', 'en', 'ja', 'zh-TW', 'es', 'ru'];
const validDays = ['friday', 'saturday', 'sunday'];
const validStatuses = ['completed', 'ongoing', 'upcoming'];

console.log('--- events:validate (Data Content Validation) ---');

let hasError = false;

locales.forEach(locale => {
  const filePath = path.resolve(process.cwd(), `src/i18n/locales/${locale}/events.json`);
  if (!fs.existsSync(filePath)) return;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const items = data.items || {};

  Object.entries(items).forEach(([id, item]) => {
    const context = `[${locale}][item ${id}]`;

    // 1. Day validation
    if (!validDays.includes(item.day)) {
      console.error(`${context} Invalid day: "${item.day}". Expected: ${validDays.join(', ')}`);
      hasError = true;
    }

    // 2. Time format validation (HH:mm)
    if (!/^\d{2}:\d{2}$/.test(item.time)) {
      console.error(`${context} Invalid time format: "${item.time}". Expected HH:mm`);
      hasError = true;
    }

    // 3. Category validation (check if filter exists)
    if (!data.filters[item.category]) {
      console.error(`${context} Category "${item.category}" not defined in filters.`);
      hasError = true;
    }

    // 4. Status validation
    if (item.status && !validStatuses.includes(item.status)) {
      console.error(`${context} Invalid status: "${item.status}". Expected: ${validStatuses.join(', ')}`);
      hasError = true;
    }

    // 5. subItems type validation
    if (item.subItems && !Array.isArray(item.subItems)) {
      console.error(`${context} subItems must be an array.`);
      hasError = true;
    }
  });

  console.log(`[PASS] [${locale}] Event items content validated.`);
});

if (hasError) {
  console.log('\nResult: FAIL - Event data content issues found.');
  process.exit(1);
} else {
  console.log('\nResult: PASS - All event data contents are valid.');
  process.exit(0);
}
