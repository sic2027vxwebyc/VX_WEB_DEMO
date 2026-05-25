const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../src/views/Viewer360Live.vue');

if (!fs.existsSync(targetFile)) {
  console.error(`[ERROR] File not found: ${targetFile}`);
  process.exit(1);
}

const content = fs.readFileSync(targetFile, 'utf8');
let errors = 0;

console.log(`[CHECK] Analyzing ${targetFile} for lifecycle and i18n safety...`);

// 1. Check for onBeforeUnmount import
const hasLifecycleImport = /import\s*\{[\s\S]*?onBeforeUnmount[\s\S]*?\}\s*from\s*['"]vue['"]/.test(content);
if (!hasLifecycleImport) {
  console.error('[FAIL] onBeforeUnmount is used but not imported from "vue".');
  errors++;
} else {
  console.log('[PASS] onBeforeUnmount import found.');
}

// 2. Check for useI18n
const hasI18n = /const\s*\{\s*t,\s*te\s*\}\s*=\s*useI18n/.test(content);
if (!hasI18n) {
  console.error('[FAIL] useI18n() is not correctly initialized or t/te are missing.');
  errors++;
} else {
  console.log('[PASS] useI18n correctly initialized.');
}

// 3. Check for nextTick before initThree in onMounted
const hasNextTickBeforeInit = /await\s*nextTick\(\)[\s\S]*?await\s*initThree\(\)/.test(content);
if (!hasNextTickBeforeInit) {
  console.warn('[WARN] nextTick() not found before initThree(). This might cause null ref errors during initialization.');
  // errors++; // Marking as warning for now, but good to have
} else {
  console.log('[PASS] nextTick() found before initialization.');
}

// 4. Check for canvasRef guard in initThree
const hasCanvasGuard = /if\s*\(\s*!canvasRef\.value\s*\)/.test(content);
if (!hasCanvasGuard) {
  console.error('[FAIL] No guard for canvasRef.value before creating WebGLRenderer.');
  errors++;
} else {
  console.log('[PASS] canvasRef guard found.');
}

// 5. Check for onBeforeUnmount call
const hasLifecycleCall = /onBeforeUnmount\s*\(\s*\(\s*\)\s*=>\s*\{[\s\S]*?cleanupViewer\(\)/.test(content);
if (!hasLifecycleCall) {
  console.error('[FAIL] onBeforeUnmount(cleanupViewer) call not found.');
  errors++;
} else {
  console.log('[PASS] onBeforeUnmount(cleanupViewer) call found.');
}

if (errors > 0) {
  console.error(`\n[RESULT] Viewer360 lifecycle check failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log('\n[RESULT] Viewer360 lifecycle check passed.');
  process.exit(0);
}
