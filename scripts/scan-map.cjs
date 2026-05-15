const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/views/InteractiveMapView.vue',
  'src/views/ArNavigationView.vue',
  'src/views/RouteGuideView.vue',
  'src/components/map/ArPermissionModal.vue',
  'src/components/map/ArFallbackPanel.vue'
];

const koreanRegex = /[가-힣]/;
let hasError = false;

console.log('--- i18n:scan-map (Hardcoded Korean Detection) ---');

targetFiles.forEach(file => {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // JS 주석 제거 (한 줄 전체가 주석인 경우)
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*') || trimmedLine.startsWith('<!--')) return;
    
    // 인라인 주석 제거
    let codeOnly = trimmedLine.split('//')[0].split('/*')[0].split('<!--')[0];
    
    // 로그 메시지 허용 (단순 패턴)
    if (codeOnly.includes('logger.') || codeOnly.includes('console.')) return;

    if (koreanRegex.test(codeOnly)) {
      // 닫는 주석 태그 '-->' 자체는 허용
      if (codeOnly.trim() === '-->' || codeOnly.trim() === '*/' || codeOnly.trim() === '-->') return;
      
      console.error(`[FAIL] ${file}:${index + 1}: ${trimmedLine}`);
      hasError = true;
    }
  });
});

if (hasError) {
  console.log('\nResult: FAIL - Hardcoded Korean strings found.');
  process.exit(1);
} else {
  console.log('\nResult: PASS - No hardcoded Korean found in UI code.');
  process.exit(0);
}
