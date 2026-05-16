/**
 * VX Web V2 - Locale Synchronization & Translation Script
 * 
 * Source of Truth: src/i18n/locales/ko/*.json
 * Targets: en, ja, zh-TW, es, ru (Optional: ar)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- Configuration ---
const MASTER_LOCALE = 'ko';
const TARGET_LOCALES = ['en', 'ja', 'zh-TW', 'es', 'ru'];

// --- Path Resolution ---
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOCALES_ROOT = path.resolve(PROJECT_ROOT, 'src/i18n/locales');
const META_PATH = path.resolve(PROJECT_ROOT, 'src/i18n/.translation-meta.json');

// --- CLI Arguments ---
const args = process.argv.slice(2);
const IS_FORCE = args.includes('--force');
const TARGET_FILE = args.find(arg => arg.startsWith('--file='))?.split('=')[1] || 
                    (args.includes('--file') ? args[args.indexOf('--file') + 1] : null);

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

function hashText(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Deep merge and sync structure from source to target
 */
function syncObjects(source, target, lang, fileName, pathArr = [], meta = {}, initialMeta = {}) {
  const result = Array.isArray(source) ? [] : {};
  let changed = false;

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target ? target[key] : undefined;
    const currentPath = [...pathArr, key].join('.');
    const currentHash = typeof sourceValue === 'string' ? hashText(sourceValue) : null;

    if (sourceValue && typeof sourceValue === 'object') {
      // Recursive sync
      const { synced, subChanged } = syncObjects(
        sourceValue, 
        targetValue || (Array.isArray(sourceValue) ? [] : {}), 
        lang, 
        fileName,
        [...pathArr, key],
        meta,
        initialMeta
      );
      result[key] = synced;
      if (subChanged) changed = true;
    } else {
      // Leaf node
      if (isTranslatable(key, sourceValue)) {
        const metaKey = `${fileName}:${currentPath}`;
        const metaEntry = initialMeta[metaKey];
        const isStale = metaEntry && metaEntry.sourceHash !== currentHash;

        // Force re-translate OR no target value OR stale translation
        if (IS_FORCE || !targetValue || hasKorean(targetValue) || isStale) {
          if (isStale && lang === MASTER_LOCALE) { // Log once per file if source changed (actually we process targets)
             // We don't process MASTER_LOCALE in the loop, so we log for the first target
          }
          
          if (isStale) {
            console.warn(`[${lang}] Source changed for ${currentPath}. Marking for re-translation.`);
          }
          
          // Re-translate (Mark as TODO)
          result[key] = `[TODO][${lang}] ${sourceValue}`;
          changed = true;
          
          // Update meta for this file/key (shared across languages)
          meta[metaKey] = {
            sourceHash: currentHash,
            sourceText: sourceValue,
            timestamp: new Date().toISOString()
          };
        } else {
          // Reuse existing target translation
          result[key] = targetValue;
          
          // Ensure meta exists even if reused
          if (!meta[metaKey]) {
            meta[metaKey] = {
              sourceHash: currentHash,
              sourceText: sourceValue,
              timestamp: new Date().toISOString()
            };
          }
        }
      } else {
        // Non-translatable key: always copy from source
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
  console.log(`Force Sync:   ${IS_FORCE}`);
  if (TARGET_FILE) console.log(`Target File:  ${TARGET_FILE}`);
  console.log('========================================\n');

  // 1. Validate Locale Directory
  if (!fs.existsSync(LOCALES_ROOT)) {
    throw new Error(`[translate.cjs] Locale directory not found: ${LOCALES_ROOT}`);
  }

  const masterDir = path.resolve(LOCALES_ROOT, MASTER_LOCALE);
  if (!fs.existsSync(masterDir)) {
    throw new Error(`[translate.cjs] Master locale directory missing: ${masterDir}`);
  }

  // 2. Load Translation Metadata
  let meta = {};
  if (fs.existsSync(META_PATH)) {
    try {
      meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
    } catch (e) {
      console.warn(`⚠️  Failed to parse meta file: ${e.message}. Starting fresh.`);
    }
  }

  // 3. Discover Locale Files
  let files = fs.readdirSync(masterDir).filter(f => f.endsWith('.json'));
  if (TARGET_FILE) {
    files = files.filter(f => f === TARGET_FILE || f === `${TARGET_FILE}.json`);
    if (files.length === 0) {
      console.error(`❌ Target file "${TARGET_FILE}" not found in ${masterDir}`);
      return;
    }
  }

  console.log('Detected master locale files:');
  console.table(files);
  console.log('');

  for (const file of files) {
    console.log(`📄 Processing ${file}...`);
    const masterPath = path.resolve(masterDir, file);
    const masterContent = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    const initialMeta = JSON.parse(JSON.stringify(meta));

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

      const { synced, changed } = syncObjects(masterContent, targetContent, lang, file, [], meta, initialMeta);

      // Write back if changed or just to ensure structural parity and sorting
      fs.writeFileSync(targetPath, JSON.stringify(synced, null, 2), 'utf8');
      
      if (changed) {
        // Check for leakage in final write
        // Note: Object.values only checks top level, so we rely on console logs from syncObjects for deep checks
      }
    }
  }

  // 4. Save Translation Metadata
  fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2), 'utf8');

  console.log('\n========================================');
  console.log('🎉 Locale synchronization complete!');
  console.log(`Metadata saved to: ${META_PATH}`);
  console.log('Run "npm run i18n:check" to verify consistency.');
  console.log('========================================');
}

main().catch(err => {
  console.error('\n💥 Critical Error during translation:', err);
  process.exit(1);
});
