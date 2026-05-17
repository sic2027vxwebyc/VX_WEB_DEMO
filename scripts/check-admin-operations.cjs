const fs = require('fs');
const path = require('path');

const files = [
  'src/admin/operational-intelligence/views/OperationalDashboardView.vue',
  'src/admin/operational-intelligence/stores/operationalIntelligenceStore.js',
  'src/admin/operational-intelligence/data/mockOperationalData.js',
  'src/admin/operational-intelligence/components/AdminHeatmapPanel.vue',
  'src/admin/operational-intelligence/components/CongestionOverridePanel.vue',
  'src/admin/operational-intelligence/components/RestrictedAreaPanel.vue',
  'src/admin/operational-intelligence/components/OperationalKpiCards.vue',
  'src/admin/operational-intelligence/components/OperationEventLog.vue'
];

console.log('--- Admin Operations Domain Verification ---');
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
if (routerContent.includes('/admin/operations')) {
  console.log('✅ Router: /admin/operations added');
} else {
  console.log('❌ Router: /admin/operations missing');
  allExist = false;
}

if (allExist) {
  console.log('\nResult: PASS');
  process.exit(0);
} else {
  console.log('\nResult: FAIL');
  process.exit(1);
}
