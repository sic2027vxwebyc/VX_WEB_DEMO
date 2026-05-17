const fs = require('fs');
const path = require('path');

const files = [
  'src/admin/gamification-control/views/GamificationControlView.vue',
  'src/admin/gamification-control/stores/gamificationControlStore.js',
  'src/admin/gamification-control/data/mockGamificationControlData.js',
  'src/admin/gamification-control/components/GamificationKpiCards.vue',
  'src/admin/gamification-control/components/RewardStockPanel.vue',
  'src/admin/gamification-control/components/QuestControlPanel.vue',
  'src/admin/gamification-control/components/PopularStampSpotsPanel.vue',
  'src/admin/gamification-control/components/GamificationEventLog.vue'
];

console.log('--- Admin Gamification Domain Verification ---');
let allExist = true;
files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log('✅ ' + file);
  } else {
    console.log('❌ ' + file);
    allExist = false;
  }
});

const routerFile = 'src/router/index.js';
const routerContent = fs.readFileSync(routerFile, 'utf8');
if (routerContent.includes('/admin/gamification')) {
  console.log('✅ Router: /admin/gamification added');
} else {
  console.log('❌ Router: /admin/gamification missing');
  allExist = false;
}

const navFile = 'src/components/layout/SideNavBar.vue';
const navContent = fs.readFileSync(navFile, 'utf8');
if (navContent.includes('adminGamification')) {
  console.log('✅ SideNavBar: adminGamification added');
} else {
  console.log('❌ SideNavBar: adminGamification missing');
  allExist = false;
}

if (allExist) {
  console.log('\nResult: PASS');
  process.exit(0);
} else {
  console.log('\nResult: FAIL');
  process.exit(1);
}
