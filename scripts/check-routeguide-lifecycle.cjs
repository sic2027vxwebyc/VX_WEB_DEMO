const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../src/views/RouteGuideLive.vue');

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

// 3. Check for destination guard
const hasDestinationGuard = /const\s*hasDestination\s*=\s*computed/.test(content) && /if\s*\(\s*!hasDestination\.value\s*\)/.test(content);
if (!hasDestinationGuard) {
  console.error('[FAIL] destination guard (hasDestination) not found in setup logic.');
  errors++;
} else {
  console.log('[PASS] destination guard found.');
}

// 4. Check for template-level guards (v-if="hasDestination")
const hasTemplateGuards = /<aside\s*v-if="hasDestination"/.test(content) && /<main\s*v-if="hasDestination"/.test(content);
if (!hasTemplateGuards) {
  console.error('[FAIL] Template-level guards (v-if="hasDestination") not found for critical sections.');
  errors++;
} else {
  console.log('[PASS] Template-level guards found.');
}

// 5. Check for onBeforeUnmount call
const hasLifecycleCall = /onBeforeUnmount\s*\(\s*\(\s*\)\s*=>\s*\{[\s\S]*?isActive\s*=\s*false/.test(content);
if (!hasLifecycleCall) {
  console.error('[FAIL] onBeforeUnmount does not seem to deactivate the component (isActive = false).');
  errors++;
} else {
  console.log('[PASS] onBeforeUnmount cleanup logic found.');
}


if (errors > 0) {
  console.error(`\n[RESULT] RouteGuide lifecycle check failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log('\n[RESULT] RouteGuide lifecycle check passed.');
  process.exit(0);
}
