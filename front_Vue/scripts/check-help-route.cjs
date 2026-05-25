const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');

console.log('--- Help / Q&A Route Verification ---');

const checks = [
  { name: 'QA.md exists', path: path.join(root, 'QA.md') },
  { name: 'HelpQaView.vue exists', path: path.join(src, 'views/HelpQaView.vue') },
  { name: 'ko/help.json exists', path: path.join(src, 'i18n/locales/ko/help.json') },
  { name: 'en/help.json exists', path: path.join(src, 'i18n/locales/en/help.json') },
];

let allPassed = true;

checks.forEach(check => {
  if (fs.existsSync(check.path)) {
    console.log(`[PASS] ${check.name}`);
  } else {
    console.log(`[FAIL] ${check.name} (${check.path})`);
    allPassed = false;
  }
});

// Check Router
const routerPath = path.join(src, 'router/index.js');
const routerContent = fs.readFileSync(routerPath, 'utf8');
if (routerContent.includes("path: '/help'")) {
  console.log('[PASS] Router /help entry exists');
} else {
  console.log('[FAIL] Router /help entry missing');
  allPassed = false;
}

// Check SideNavBar
const sideNavPath = path.join(src, 'components/layout/SideNavBar.vue');
const sideNavContent = fs.readFileSync(sideNavPath, 'utf8');
if (sideNavContent.includes("handleNavClick('/help'")) {
  console.log('[PASS] SideNavBar help link exists');
} else {
  console.log('[FAIL] SideNavBar help link missing');
  allPassed = false;
}

if (allPassed) {
  console.log('--- ALL CHECKS PASSED ---');
  process.exit(0);
} else {
  console.log('--- SOME CHECKS FAILED ---');
  process.exit(1);
}
