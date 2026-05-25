const fs = require('fs');
const path = require('path');

const locales = ['en', 'ja', 'zh-TW', 'es', 'ru'];
const files = ['admin.json', 'navigation.json', 'common.json', 'gamification.json', 'spaces.json', 'settings.json'];
const sourceLocale = 'ko';

files.forEach(file => {
  const sourcePath = path.join(__dirname, '../src/i18n/locales', sourceLocale, file);
  if (!fs.existsSync(sourcePath)) return;
  const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  locales.forEach(targetLocale => {
    const targetPath = path.join(__dirname, '../src/i18n/locales', targetLocale, file);
    let targetData = {};
    if (fs.existsSync(targetPath)) {
      try {
        targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      } catch (e) {
        targetData = {};
      }
    }

    // Deep merge / sync structure
    const sync = (src, tgt) => {
      Object.keys(src).forEach(key => {
        if (typeof src[key] === 'object' && src[key] !== null) {
          if (!tgt[key] || typeof tgt[key] !== 'object') tgt[key] = {};
          sync(src[key], tgt[key]);
        } else {
          if (!tgt[key]) tgt[key] = src[key]; // Fallback to source string
        }
      });
    };

    sync(sourceData, targetData);
    fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2), 'utf8');
    console.log(`Synced ${targetLocale}/${file}`);
  });
});
