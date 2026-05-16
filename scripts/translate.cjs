/**
 * VX Web V2 - Locale Synchronization & Translation Script
 * 
 * Source of Truth: src/i18n/locales/ko/*.json
 * Targets: en, ja, zh-TW, es, ru (Optional: ar)
 */

const fs = require('fs');
const path = require('path');

// --- Configuration ---
const MASTER_LOCALE = 'ko';
const TARGET_LOCALES = ['en', 'ja', 'zh-TW', 'es', 'ru'];

// --- Path Resolution ---
// Use __dirname to ensure paths are correct regardless of execution context
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOCALES_ROOT = path.resolve(PROJECT_ROOT, 'src/i18n/locales');

// Keys that should NEVER be translated
const EXCLUDE_KEYS = new Set([
  'id', 'key', 'nameKey', 'titleKey', 'descriptionKey', 'labelKey',
  'category', 'type', 'status', 'time', 'displayTime', 'startTime', 'endTime',
  'startAt', 'endAt', 'route', 'path', 'url', 'href', 'icon', 'image', 'imageUrl',
  'color', 'variant', 'role', 'permission', 'locale'
]);

// Value patterns that should NEVER be translated
const EXCLUDE_PATTERNS = [
  /^hall-[a-z0-9-]+$/i,
  /^exit-[a-z0-9-]+$/i,
  /^badge-[a-z0-9-]+$/i,
  /^quest-[a-z0-9-]+$/i,
  /^route-guide/i,
  /^viewer-360/i,
  /^stamp-event/i,
  /^\d{2}:\d{2}$/,
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
  /^[A-Z0-9_-]+$/ // Technical enums/IDs usually all caps
];

// --- Utilities ---

function isTranslatable(key, value) {
  if (typeof value !== 'string') return false;
  if (EXCLUDE_KEYS.has(key)) return false;
  if (EXCLUDE_PATTERNS.some(pattern => pattern.test(value))) return false;
  // If it's a URL or path, don't translate
  if (value.startsWith('/') || value.startsWith('http')) return false;
  // If it's a single word all-caps, likely an ID or Enum
  if (/^[A-Z0-9_]+$/.test(value)) return false;
  return true;
}

function hasKorean(text) {
  return /[\uac00-\ud7af]/.test(text);
}

/**
 * Deep merge and sync structure from source to target
 */
function syncObjects(source, target, lang, path = []) {
  const result = Array.isArray(source) ? [] : {};
  let changed = false;

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target ? target[key] : undefined;
    const currentPath = [...path, key].join('.');

    if (sourceValue && typeof sourceValue === 'object') {
      // Recursive sync
      const { synced, subChanged } = syncObjects(sourceValue, targetValue || (Array.isArray(sourceValue) ? [] : {}), lang, [...path, key]);
      result[key] = synced;
      if (subChanged) changed = true;
    } else {
      // Leaf node
      if (isTranslatable(key, sourceValue)) {
        // If target has a value and it's NOT Korean (leaked), reuse it
        if (targetValue && typeof targetValue === 'string' && !hasKorean(targetValue)) {
          result[key] = targetValue;
        } else {
          // Needs translation
          result[key] = `[TODO][${lang}] ${sourceValue}`;
          changed = true;
          console.warn(`⚠️  Missing translation: [${lang}] ${currentPath} -> "${sourceValue}"`);
        }
      } else {
        // Non-translatable key: always copy from source to maintain metadata integrity
        result[key] = sourceValue;
        if (targetValue !== sourceValue) changed = true;
      }
    }
  }

  return { synced: result, changed };
}

// --- Main Execution ---

async function main() {
  console.log('========================================');
  console.log('🌐 VX Web i18n Sync & Translation');
  console.log(`PROJECT_ROOT: ${PROJECT_ROOT}`);
  console.log(`LOCALES_DIR:  ${LOCALES_ROOT}`);
  console.log(`Source:       ${MASTER_LOCALE}`);
  console.log(`Targets:      ${TARGET_LOCALES.join(', ')}`);
  console.log('========================================\n');

  // 1. Validate Locale Directory
  if (!fs.existsSync(LOCALES_ROOT)) {
    throw new Error(`[translate.cjs] Locale directory not found: ${LOCALES_ROOT}`);
  }

  const masterDir = path.resolve(LOCALES_ROOT, MASTER_LOCALE);
  if (!fs.existsSync(masterDir)) {
    throw new Error(`[translate.cjs] Master locale directory missing: ${masterDir}`);
  }

  // 2. Discover Locale Files
  const files = fs.readdirSync(masterDir).filter(f => f.endsWith('.json'));
  console.log('Detected master locale files:');
  console.table(files);
  console.log('');

  let totalMissing = 0;

  for (const file of files) {
    console.log(`📄 Processing ${file}...`);
    const masterPath = path.resolve(masterDir, file);
    const masterContent = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

    for (const lang of TARGET_LOCALES) {
      const targetDir = path.resolve(LOCALES_ROOT, lang);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const targetPath = path.resolve(targetDir, file);
      let targetContent = {};
      if (fs.existsSync(targetPath)) {
        try {
          targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
        } catch (e) {
          console.error(`❌ Error parsing ${targetPath}: ${e.message}`);
        }
      }

      const { synced, changed } = syncObjects(masterContent, targetContent, lang);

      // Write back if changed or just to ensure structural parity and sorting
      fs.writeFileSync(targetPath, JSON.stringify(synced, null, 2), 'utf8');
      
      if (changed) {
        // Check for leakage in final write
        const leakage = Object.values(synced).some(v => typeof v === 'string' && hasKorean(v));
        if (leakage) {
          console.error(`🚨 Leakage detected in ${lang}/${file}`);
        }
      }
    }
  }

  console.log('\n========================================');
  console.log('🎉 Locale synchronization complete!');
  console.log('Run "npm run i18n:check" to verify consistency.');
  console.log('========================================');
}

main().catch(err => {
  console.error('\n💥 Critical Error during translation:', err);
  process.exit(1);
});
