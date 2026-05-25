# VX Web V2 아키텍처 (Architecture)

## 1. 개요 (Overview)
VX Web V2는 **공간 컨벤션 경험 플랫폼(Spatial Convention Experience Platform)**으로 설계되었습니다. 이 아키텍처는 사용자 중심의 공간 경험과 운영진 중심의 운영 관제 지능을 분리하는 동시에, 대규모 컨벤션 특유의 고밀도·저대역폭 환경에서도 안정성을 유지하기 위해 브라우저의 PWA 기능을 적극 활용합니다.

## 2. 핵심 아키텍처 지표 (Core Architectural Pillars)

### A. 프로그레시브 웹 앱 (PWA) 및 오프라인 우선 (Offline-First)
*   **Service Worker**: 네트워크 연결이 불안정할 때 지도 SVG, 360 파노라마 이미지, UI 컴포넌트 등 캐시된 자산을 즉시 제공하여 중단 없는 경험을 보장합니다.
*   **사전 다운로드 (Pre-fetching)**: '기기 설정' 패널을 통해 사용자가 용량이 큰 지도 데이터를 미리 다운로드할 수 있도록 지원합니다.
*   **매니페스트 (Manifest)**: 홈 화면 추가를 통해 네이티브 앱과 유사한 설치 경험을 제공합니다.

### B. 반응형 상태 및 Mock 데이터 계층 (Pinia)
현재 백엔드 없이 동작하는 이 애플리케이션은 **Pinia**를 인메모리 데이터베이스로 사용하여 실시간 운영 환경을 시뮬레이션합니다.
*   **스토어 (Stores)**: `spaces.js` (공간 데이터), `events.js` (일정), `notification.js` (알림), `gamificationControlStore.js` (관리자 상태).
*   **시뮬레이션**: 하네스 엔지니어링(Harness Engineering) 원칙이 적용되었습니다. 프론트엔드는 실시간 데이터 흐름을 시뮬레이션합니다. (예: QR 코드 스캔 시 `gamificationStore`의 재고 차감 및 `security-telemetry` 이벤트 등록)

### C. Master-Mirror i18n 전략
*   **단일 진실 공급원 (Source of Truth)**: 한국어(`ko`) 로케일 디렉토리가 전체 데이터 구조를 엄격하게 정의합니다.
*   **검증 (Verification)**: 자동화 스크립트(`scripts/check-i18n-keys.cjs`)를 통해 모든 로케일(`en`, `es`, `ja` 등)이 `ko`의 JSON 구조와 일치하는지 확인하며, 불일치나 한국어 유입 발견 시 빌드를 중단합니다.
### E. KINTEX Convention Experience Hub 아키텍처 (Convention-Specific Architecture)
국제대회 규모의 고밀도 경험을 위해 다음과 같은 아키텍처 원칙이 추가되었습니다.

*   **공간 분할 렌더링 (Spatial Partitioning)**: Three.js 기반의 대규모 킨텍스 모델을 구역(Chunk)별로 분할하여, 사용자의 현재 뷰포트에 필요한 데이터만 비동기로 로드(Lazy Loading)하여 모바일 성능 저하를 방지합니다.
*   **증분 업데이트 (Incremental Updates)**: Manifest 기반 파일 해싱 시스템을 도입하여, 전체 에셋 재다운로드 없이 변경된 모델 데이터(GLB)만 서비스 워커를 통해 선택적으로 갱신합니다.
*   **실시간 동기화 (Server-Sent Events)**: 서버 부하를 최소화하면서 중요한 공지사항과 세션 변경 사항을 실시간으로 푸시하기 위해 단방향 HTTP 기반 스트리밍인 SSE를 채택합니다.
*   **강력한 QR 퀘스트 보안**: 고정 URL 대신 동적 시간 제한 토큰(TTL) 기반의 QR을 사용하며, 스캔 시 기기 GPS 좌표를 서버에서 검증하여 부정 인증을 차단합니다.
*   **중앙화된 다국어 워크플로우**: LLM을 통한 자동 번역을 기반으로 하되, 인간 검수자를 거쳐 배포하는 중앙 관리 프로세스를 도입하여 다국어 대응 속도와 품질을 동시에 확보합니다.

### D. 뷰 분리: 사용자 vs. 관리자
*   **사용자 뷰 (`src/views/v2`)**: 몰입감에 집중합니다. Tailwind 글래스모피즘, Three.js 기반 360 뷰, 부드러운 라우팅 전환을 적극 활용합니다.
*   **관리자 뷰 (`src/admin`)**: 데이터 밀도와 신속한 액션에 집중합니다. 리워드 관리, 도시락 배부, 호텔 체크인, 보안 패널을 모듈화하여 제공하며, 시뮬레이션된 생체 인증 가드에 의해 보호됩니다.

## 3. 기술 스택 매핑 (Technology Stack Mapping)

*   **View Layer**: Vue 3 (SFC, Composition API)
*   **Build & Dev**: Vite
*   **Styling**: Tailwind CSS (복잡한 빛 효과 및 블러를 위한 임의 값 주입 활용)
*   **Routing**: Vue Router 4 (관리자 경로를 위한 메타 가드 포함)
*   **3D / Spatial**: Three.js (Viewer360의 구형 투영에 활용)
*   **Hardware Access**: HTML5 `MediaDevices.getUserMedia` (QR 스캐너 카메라 피드 시뮬레이션에 활용)

## 4. 향후 백엔드 통합 경로 (Future Backend Integration Path)
현재의 Mock 백엔드에서 실시간 백엔드로 전환하기 위한 단계:
1.  **Pinia Action 수정**: 정적 배열을 수정하는 대신 `fetch()` 또는 `axios` 호출을 수행하도록 Pinia 스토어 액션을 변경합니다.
2.  **WebSocket**: `App.vue`에 전역 WebSocket 리스너를 구현하여 긴급 알림 및 혼잡도 업데이트를 Pinia 상태로 직접 스트리밍하고 반응성을 유지합니다.
3.  **인증 (Authentication)**: 목업 `biometricAuth`를 실제 JWT/OAuth 2.0 기반의 강력한 인증 모델로 교체합니다.