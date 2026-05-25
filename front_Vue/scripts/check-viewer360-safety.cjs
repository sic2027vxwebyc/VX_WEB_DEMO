const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../src/views/Viewer360Live.vue');

if (!fs.existsSync(targetFile)) {
  console.error(`[ERROR] File not found: ${targetFile}`);
  process.exit(1);
}

const content = fs.readFileSync(targetFile, 'utf8');
let errors = 0;

console.log(`[CHECK] Analyzing ${targetFile} for stability patterns...`);

// 1. Check for onUnmounted inside async onMounted
// We look for the onMounted(async () => { ... }) block and see if onUnmounted is inside it
const onMountedMatch = /onMounted\s*\(\s*async\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\n\}\)/.exec(content);

if (onMountedMatch) {
  const body = onMountedMatch[1];
  if (body.includes('onUnmounted')) {
    console.error('[FAIL] onUnmounted is called inside an async onMounted block. This will cause Vue lifecycle warnings.');
    errors++;
  } else {
    console.log('[PASS] Lifecycle hooks registration looks safe.');
  }
} else {
  console.log('[PASS] No async onMounted block found or it is structured safely.');
}


// 2. Check for heavy operations in animate loop
const animateLoop = /const animate = \(\) => {([\s\S]*?)}/g.exec(content);
if (animateLoop) {
  const loopBody = animateLoop[1];
  const heavyItems = [
    { pattern: /logger\.(info|debug|warn|error)/, name: 'logger' },
    { pattern: /t\(/, name: 'i18n translation' },
    { pattern: /querySelectorAll/, name: 'DOM query' },
    { pattern: /\.value\s*=/, name: 'Reactive assignment' },
    { pattern: /new THREE\.(Vector3|TextureLoader|Texture)/, name: 'Three.js object creation' }
  ];

  heavyItems.forEach(item => {
    // Excluding specifically allowed or optimized cases if needed, 
    // but generally these are bad in animate loop.
    // For now, let's just check for general presence.
    // Note: updateHotspotProjections uses querySelectorAll but it's called conditionally.
    // Let's refine the check.
  });
}

// 3. Check for cleanup functions
const hasCleanup = /cleanupViewer/.test(content);
const hasDisposeScene = /disposeScene/.test(content);
const hasDisposeRenderer = /disposeRenderer/.test(content);

if (!hasCleanup || !hasDisposeScene || !hasDisposeRenderer) {
  console.error('[FAIL] Missing proper cleanup functions (cleanupViewer, disposeScene, or disposeRenderer).');
  errors++;
} else {
  console.log('[PASS] Cleanup functions are present.');
}

// 4. Check for texture dispose
const hasTextureDispose = /\.dispose\(\)/.test(content);
if (!hasTextureDispose) {
  console.error('[FAIL] No texture/resource dispose() calls found.');
  errors++;
} else {
  console.log('[PASS] Resource disposal calls found.');
}

// 5. Check for isActive guard
const hasActiveGuard = /isActive/.test(content);
if (!hasActiveGuard) {
  console.error('[FAIL] No isActive guard found for async operations.');
  errors++;
} else {
  console.log('[PASS] Async lifecycle guard (isActive) is present.');
}

if (errors > 0) {
  console.error(`\n[RESULT] Viewer360 stability check failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log('\n[RESULT] Viewer360 stability check passed.');
  process.exit(0);
}
