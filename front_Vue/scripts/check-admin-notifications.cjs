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
  routerContent.includes('/admin/notifications') && 
  routerContent.includes('adminNotifications') &&
  routerContent.includes('AdminRootView.vue')
) {
  results.routes = true;
}

// 2. 파일 존재 검증
const requiredFiles = [
  'src/admin/notification-control/views/NotificationControlView.vue',
  'src/admin/notification-control/stores/notificationControlStore.js',
  'src/admin/notification-control/data/mockNotificationControlData.js',
  'src/admin/notification-control/components/EmergencyTickerControlPanel.vue',
  'src/admin/shared/views/AdminRootView.vue'
];
results.files = requiredFiles.every(f => fs.existsSync(path.join(__dirname, '..', f)));

// 3. 내비게이션 검증
const navPath = path.join(__dirname, '../src/i18n/locales/ko/navigation.json');
const navContent = JSON.parse(fs.readFileSync(navPath, 'utf8'));
if (navContent.adminNotifications === '공지 관리') {
  results.navigation = true;
}

// 4. i18n 검증
const adminLocalePath = path.join(__dirname, '../src/i18n/locales/ko/admin.json');
const adminLocale = JSON.parse(fs.readFileSync(adminLocalePath, 'utf8'));
if (adminLocale.notifications && adminLocale.notifications.title === '실시간 공지 관리') {
  results.i18n = true;
}

// 5. 사이드바 로직 검증
const sidebarPath = path.join(__dirname, '../src/components/layout/SideNavBar.vue');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
if (sidebarContent.includes('isAdminRoute') && sidebarContent.includes("path === '/admin' || path.startsWith('/admin/')")) {
  results.logic = true;
}

console.log('--- Admin Notifications Implementation Check ---');
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
