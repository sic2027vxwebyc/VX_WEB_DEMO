/**
 * VX Web V2 - Locale Synchronization & Translation Script
 * 
 * Source of Truth: src/i18n/locales/ko/*.json
 * Targets: en, ja, zh-TW, es, ru
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
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`${name}=`));
  if (arg) return arg.split('=')[1];
  const idx = args.indexOf(name);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) return args[idx + 1];
  return null;
};

const MODE = getArg('--mode') || process.env.TRANSLATION_MODE || 'api'; // api, dry-run, mock
const IS_FORCE = args.includes('--force');
const IS_FORCE_TODO = args.includes('--force-todo');
const TARGET_FILE = getArg('--file');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
  if (value.startsWith('/') || value.startsWith('http')) return false;
  if (/^[A-Z0-9_]+$/.test(value)) return false;
  return true;
}

function hasKorean(text) {
  return typeof text === 'string' && /[\uac00-\ud7af]/.test(text);
}

function isTodoValue(text) {
  return typeof text === 'string' && /\[TODO/i.test(text);
}

function hashText(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Actual translation via OpenAI API
 */
async function translateText(sourceText, targetLang) {
  if (MODE === 'mock') {
    return `[TODO][${targetLang}] ${sourceText}`;
  }

  if (MODE === 'dry-run') {
    return `[WILL TRANSLATE to ${targetLang}] ${sourceText}`;
  }

  if (!OPENAI_API_KEY) {
    if (MODE === 'api') {
      throw new Error('OPENAI_API_KEY is required for "api" mode. Please set it in your environment.');
    }
    return `[TODO][${targetLang}] ${sourceText}`;
  }

  console.log(`   🌐 Translating to ${targetLang}: "${sourceText.substring(0, 30)}${sourceText.length > 30 ? '...' : ''}"`);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator for a spatial experience web application.
Translate the following Korean text into ${targetLang}.
Guidelines:
- Maintain a professional and intuitive tone suitable for a convention/exhibition app.
- Preserve all placeholders like {count}, {name}, {minutes}, etc.
- Preserve Markdown syntax if present.
- Do not translate technical terms, IDs, or brand names if they look like identifiers.
- For zh-TW, use Traditional Chinese as used in Taiwan.
- Return ONLY the translated text without any explanation or quotes.`
          },
          {
            role: 'user',
            content: sourceText
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    let translated = data.choices[0].message.content.trim();
    
    // Cleanup any accidental quotes the LLM might have added
    if (translated.startsWith('"') && translated.endsWith('"')) {
      translated = translated.substring(1, translated.length - 1);
    }

    return translated;
  } catch (error) {
    console.error(`   ❌ Translation failed for ${targetLang}:`, error.message);
    throw error; // Fail fast in api mode
  }
}

/**
 * Deep merge and sync structure from source to target
 */
async function syncObjects(source, target, lang, fileName, pathArr = [], meta = {}, initialMeta = {}) {
  const result = Array.isArray(source) ? [] : {};
  let changed = false;

  const keys = Object.keys(source);
  for (const key of keys) {
    const sourceValue = source[key];
    const targetValue = target ? target[key] : undefined;
    const currentPath = [...pathArr, key].join('.');
    const currentHash = typeof sourceValue === 'string' ? hashText(sourceValue) : null;

    if (sourceValue && typeof sourceValue === 'object') {
      const { synced, subChanged } = await syncObjects(
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
      if (isTranslatable(key, sourceValue)) {
        const metaKey = `${fileName}:${currentPath}`;
        const metaEntry = initialMeta[metaKey];
        const isStale = metaEntry && metaEntry.sourceHash !== currentHash;
        
        const needsTranslation = IS_FORCE || 
                                 !targetValue || 
                                 (IS_FORCE_TODO && (isTodoValue(targetValue) || hasKorean(targetValue))) ||
                                 isStale;

        if (needsTranslation) {
          if (isStale) {
            console.warn(`   ⚠️  Source changed for ${currentPath}.`);
          } else if (isTodoValue(targetValue)) {
            console.log(`   📝 Found TODO for ${currentPath}.`);
          } else if (hasKorean(targetValue)) {
            console.log(`   🇰🇷 Found Korean leakage in ${currentPath}.`);
          } else if (!targetValue) {
            console.log(`   🆕 Missing translation for ${currentPath}.`);
          }

          const translated = await translateText(sourceValue, lang);
          result[key] = translated;
          changed = true;
          
          meta[metaKey] = {
            sourceHash: currentHash,
            sourceText: sourceValue,
            timestamp: new Date().toISOString()
          };
        } else {
          result[key] = targetValue;
          if (!meta[metaKey]) {
            meta[metaKey] = {
              sourceHash: currentHash,
              sourceText: sourceValue,
              timestamp: new Date().toISOString()
            };
          }
        }
      } else {
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
  console.log('🌐 VX Web i18n Sync & Translation (API Mode)');
  console.log(`MODE:         ${MODE}`);
  console.log(`Source:       ${MASTER_LOCALE}`);
  console.log(`Targets:      ${TARGET_LOCALES.join(', ')}`);
  console.log(`Force All:    ${IS_FORCE}`);
  console.log(`Force TODO:   ${IS_FORCE_TODO}`);
  if (TARGET_FILE) console.log(`Target File:  ${TARGET_FILE}`);
  console.log('========================================\n');

  if (MODE === 'api' && !OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is missing.');
    console.error('Please export it: export OPENAI_API_KEY=your_key_here');
    process.exit(1);
  }

  if (!fs.existsSync(LOCALES_ROOT)) {
    throw new Error(`Locale directory not found: ${LOCALES_ROOT}`);
  }

  const masterDir = path.resolve(LOCALES_ROOT, MASTER_LOCALE);
  if (!fs.existsSync(masterDir)) {
    throw new Error(`Master locale directory missing: ${masterDir}`);
  }

  let meta = {};
  if (fs.existsSync(META_PATH)) {
    try {
      meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
    } catch (e) {
      console.warn(`⚠️  Failed to parse meta file: ${e.message}. Starting fresh.`);
    }
  }

  let files = fs.readdirSync(masterDir).filter(f => f.endsWith('.json'));
  if (TARGET_FILE) {
    files = files.filter(f => f === TARGET_FILE || f === `${TARGET_FILE}.json`);
  }

  for (const file of files) {
    console.log(`📄 Processing ${file}...`);
    const masterPath = path.resolve(masterDir, file);
    const masterContent = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    const initialMeta = JSON.parse(JSON.stringify(meta));

    for (const lang of TARGET_LOCALES) {
      console.log(`   [${lang}] Syncing...`);
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
          console.error(`   ❌ Error parsing ${targetPath}: ${e.message}`);
        }
      }

      const { synced, changed } = await syncObjects(masterContent, targetContent, lang, file, [], meta, initialMeta);

      if (changed && MODE !== 'dry-run') {
        fs.writeFileSync(targetPath, JSON.stringify(synced, null, 2), 'utf8');
      }
    }
  }

  if (MODE !== 'dry-run') {
    fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2), 'utf8');
  }

  console.log('\n========================================');
  console.log(`🎉 Translation complete! Mode: ${MODE}`);
  if (MODE !== 'dry-run') {
    console.log(`Metadata saved to: ${META_PATH}`);
  }
  console.log('========================================');
}

main().catch(err => {
  console.error('\n💥 Critical Error during translation:', err);
  process.exit(1);
});
