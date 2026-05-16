/**
 * [ 검증 스크립트 ]
 * Home_v2.vue의 i18n 가드 로직이 올바르게 구현되었는지 정적 분석을 통해 확인합니다.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/Home_v2.vue');
const content = fs.readFileSync(filePath, 'utf8');

console.log('========================================');
console.log('🔍 Home_v2 i18n Guard Verification');
console.log('========================================');

const checks = [
  {
    name: 'SpacesStore loading state usage',
    test: /spacesStore\.isLoading/.test(content) || /spacesStore\.isLoaded/.test(content),
    desc: 'isLoading 또는 isLoaded 상태를 사용하여 로딩을 제어하고 있는가?'
  },
  {
    name: 'hasSpacesReady computed guard',
    test: /const hasSpacesReady = computed/.test(content),
    desc: '공간 데이터 준비 상태를 확인하는 computed 가드가 존재하는가?'
  },
  {
    name: 'currentSpaceName computed guard',
    test: /const currentSpaceName = computed/.test(content) && /if \(!hasSpacesReady\.value/.test(content),
    desc: 'currentSpaceName이 준비 상태 가드를 사용하여 정의되었는가?'
  },
  {
    name: 'localizedNearbySpaces computed guard',
    test: /const localizedNearbySpaces = computed/.test(content) && /nearbySpaces\.value/.test(content),
    desc: 'localizedNearbySpaces가 주변 공간 데이터를 가드하여 처리하는가?'
  },
  {
    name: 'Template resolveI18nText guard',
    test: !/{{ resolveI18nText\({ key: currentSpace\?\.nameKey/.test(content),
    desc: '템플릿에서 직접적으로 가드 없이 resolveI18nText를 호출하지 않는가?'
  },
  {
    name: 'SpacesStore.fetchSpaces call in onMounted',
    test: /await spacesStore\.fetchSpaces\(\)/.test(content),
    desc: 'onMounted에서 공간 데이터를 로드하는 호출이 존재하는가?'
  }
];

let allPassed = true;
checks.forEach((check, index) => {
  const status = check.test ? '✅ PASS' : '❌ FAIL';
  if (!check.test) allPassed = false;
  console.log(`${index + 1}. [${status}] ${check.name}`);
  console.log(`   - ${check.desc}`);
});

console.log('========================================');
if (allPassed) {
  console.log('🎉 All Home_v2 i18n guard checks passed!');
  process.exit(0);
} else {
  console.error('⚠️ Some checks failed. Please review Home_v2.vue.');
  process.exit(1);
}
