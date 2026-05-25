const fs = require('fs');
const path = require('path');

const results = {
  routes: false,
  files: false,
  navigation: false,
  i18n: false,
  logic: false
};

// 1. 라우트 검증
const routerPath = path.join(__dirname, '../src/router/index.js');
const routerContent = fs.readFileSync(routerPath, 'utf8');
if (
  routerContent.includes('/admin/security') && 
  routerContent.includes('adminSecurity') &&
  routerContent.includes('SecurityTelemetryView.vue')
) {
  results.routes = true;
}

// 2. 파일 존재 검증
const requiredFiles = [
  'src/admin/security-telemetry/views/SecurityTelemetryView.vue',
  'src/admin/security-telemetry/stores/securityTelemetryStore.js',
  'src/admin/security-telemetry/data/mockSecurityTelemetryData.js',
  'src/admin/security-telemetry/components/SecurityTelemetryKpiCards.vue',
  'src/admin/security-telemetry/components/DeviceTelemetryPanel.vue'
];
results.files = requiredFiles.every(f => fs.existsSync(path.join(__dirname, '..', f)));

// 3. 내비게이션 검증
const navPath = path.join(__dirname, '../src/i18n/locales/ko/navigation.json');
const navContent = JSON.parse(fs.readFileSync(navPath, 'utf8'));
if (navContent.adminSecurity === '보안 모니터링') {
  results.navigation = true;
}

// 4. i18n 검증
const adminLocalePath = path.join(__dirname, '../src/i18n/locales/ko/admin.json');
const adminLocale = JSON.parse(fs.readFileSync(adminLocalePath, 'utf8'));
if (adminLocale.security && adminLocale.security.title === '보안 및 인프라 모니터링') {
  results.i18n = true;
}

// 5. 사이드바 로직 검증
const sidebarPath = path.join(__dirname, '../src/components/layout/SideNavBar.vue');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
if (sidebarContent.includes('isAdminRoute') && sidebarContent.includes("name: t('navigation.adminSecurity')")) {
  results.logic = true;
}

console.log('--- Admin Security & Telemetry Implementation Check ---');
Object.entries(results).forEach(([key, val]) => {
  console.log(`${val ? '✅' : '❌'} ${key}`);
});

if (Object.values(results).every(v => v)) {
  console.log('\nSUCCESS: All checks passed!');
  process.exit(0);
} else {
  console.log('\nFAILURE: Some checks failed.');
  process.exit(1);
}
