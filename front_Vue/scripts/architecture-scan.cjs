/**
 * Architecture Scan Script
 * 
 * 이 스크립트는 프로젝트의 아키텍처 규칙 위반 사항을 자동으로 탐색합니다.
 * 주요 점검 사항:
 * 1. components 내에서 API 호출(axios, fetch) 금지
 * 2. components 내에서 router 직접 조작 경고
 * 3. utils 내에서 side effect(store, router 의존성) 금지
 * 4. services 내에서 Vue 반응형 API(ref, computed) 사용 금지
 * 5. Template 내 하드코딩된 한국어 문자열 탐색 (사용자 노출용)
 */

const fs = require('fs');
const path = require('path');

const rules = [
  {
    name: 'Components should not call APIs',
    pattern: /axios|fetch\(/,
    include: ['src/components'],
    message: 'Components should use stores or services instead of calling APIs directly.'
  },
  {
    name: 'Components should not use router for flow control',
    pattern: /router\.push|router\.replace/,
    include: ['src/components'],
    message: 'Consider moving flow control to pages/views via emits.'
  },
  {
    name: 'Utils should be pure',
    pattern: /useStore|useRouter|useRoute|@\/stores|@\/router/,
    include: ['src/utils'],
    message: 'Utils should be pure functions without dependencies on stores or router.'
  },
  {
    name: 'Services should not depend on Vue reactivity',
    pattern: /from 'vue'|from "vue"/,
    include: ['src/services'],
    message: 'Services should be plain JS classes or objects.'
  },
  {
    name: 'Hardcoded UI strings (Template)',
    // Matches Korean outside of comments/logger
    pattern: /[가-힣]+/,
    include: ['src'],
    exclude: ['src/i18n'],
    customFilter: (line, file) => {
      const trimmed = line.trim();
      // Ignore comments
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*') || trimmed.startsWith('<!--')) return false;
      // Ignore logger calls (mandatory Korean per GEMINI.md)
      if (trimmed.includes('logger.')) return false;
      // Ignore console calls
      if (trimmed.includes('console.')) return false;
      // If it's in a script tag but not a logger call, it might be a hardcoded variable
      // We mainly care about text in <template> or hardcoded constants
      return true;
    },
    message: 'User-facing strings should be in i18n JSON files. (Comments and Logs are allowed Korean)'
  }
];

function getFiles(dir, allFiles = []) {
  if (!fs.existsSync(dir)) return allFiles;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, allFiles);
    } else {
      allFiles.push(name);
    }
  }
  return allFiles;
}

const allFiles = getFiles('src');

console.log('🚀 Starting Architecture Scan...\n');

let violations = 0;

rules.forEach(rule => {
  const targetFiles = allFiles.filter(file => {
    const isIncluded = rule.include.some(inc => file.startsWith(inc));
    const isExcluded = rule.exclude && rule.exclude.some(exc => file.startsWith(exc));
    return isIncluded && !isExcluded;
  });

  targetFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (rule.pattern.test(line)) {
        if (rule.customFilter && !rule.customFilter(line, file)) return;
        if (!rule.customFilter && (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*'))) return;
        
        console.log(`[${rule.name}]`);
        console.log(`  File: ${file}:${index + 1}`);
        console.log(`  Line: ${line.trim()}`);
        console.log(`  Note: ${rule.message}\n`);
        violations++;
      }
    });
  });
});

if (violations > 0) {
  console.log(`❌ Found ${violations} architecture violations.`);
} else {
  console.log('✅ No major architecture violations found!');
}
