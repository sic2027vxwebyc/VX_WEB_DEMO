# VX Web V2: Runtime Multilingual System

## 1. 개요 (System Overview)
VX Web V2는 전 세계 참가자들이 모이는 국제대회의 특성을 고려하여, 단순히 텍스트를 번역하는 수준을 넘어 **런타임 시 상황에 맞는 최적화된 로컬라이제이션(Localization)**을 제공합니다.

## 2. i18n 아키텍처 (i18n Architecture)

### A. Namespace-based Structure
번역 데이터의 관리와 로딩 속도를 최적화하기 위해 기능을 중심으로 25개 이상의 네임스페이스로 분리하였습니다.
*   `common.json`: 공통 UI 요소 (버튼, 라벨 등).
*   `homeV2.json`: 실시간 홈 특화 메시지.
*   `map.json`: 내비게이션 및 지도 관련 전문 용어.
*   `notifications.json`: 긴급 상황 및 공지 텍스트.
*   `spaces.json`: 행사장 각 장소의 정식 명칭 및 설명.

### B. Master-Mirror Policy (엄격한 동기화)
*   **Master Locale**: `ko` (한국어)가 모든 i18n 구조의 절대적 기준입니다.
*   **Mirror Locales**: `en`, `ja`, `zh-TW` 등 모든 지원 언어는 `ko`의 파일 구조, 키 이름, 네임스페이스 깊이를 완벽하게 복제합니다.
*   **Validation**: 빌드 및 런타임 단계에서 `ko` 대비 누락된 키가 있는지 검사하여 일관성을 유지합니다.

## 3. 핵심 기능 (Key Features)

### A. Runtime Persistence
*   사용자가 선택한 언어 설정은 브라우저의 `localStorage`에 즉시 저장됩니다.
*   앱 재접속 시 이전 설정을 유지하여 끊김 없는 사용자 경험을 제공합니다.

### B. Intelligent Text Resolver
*   `i18nResolver.js` 유틸리티를 통해 복합적인 텍스트 처리를 지원합니다.
*   정적 번역 키(`key`)뿐만 아니라, 상황에 따라 서버에서 내려온 텍스트나 기본값(Fallback)을 지능적으로 조합하여 출력합니다.

### C. UI/UX Localization
*   단어의 길이에 따라 레이아웃이 깨지지 않도록 유동적인 텍스트 컨테이너 설계를 적용했습니다.
*   동양권(한국어, 일본어, 중국어)과 서구권(영어, 스페인어 등)의 폰트 가독성을 고려한 타이포그래피 시스템을 갖추고 있습니다.

## 4. 지원 언어 현황 (Supported Languages)
현재 VX Web V2는 다음 언어들에 대해 전체 UI 로컬라이제이션을 지원합니다.
*   🇰🇷 **한국어 (Master)**
*   🇺🇸 **영어 (English)**
*   🇯🇵 **일본어 (日本語)**
*   🇹🇼 **중국어 번체 (繁體中文)**
*   🇪🇸 **스페인어 (Español)**

## 5. 향후 확장 (Future Expansion)
*   **Dynamic Domain Translation**: 행사 운영 중 추가되는 세션 제목이나 공지사항을 관리자 패널에서 즉시 번역하여 배포하는 시스템.
*   **Right-to-Left (RTL) Support**: 아랍어 등 RTL 언어 사용자를 위한 전체 레이아웃 반전 시스템 도입.
*   **Contextual i18n**: 사용자의 위치에 따라 특정 구역에서만 통용되는 현지 용어를 우선 노출하는 위치 기반 로컬라이제이션.
