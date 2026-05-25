# VX Web V2: Runtime Architecture

## 1. 아키텍처 개요 (Architecture Overview)
VX Web V2는 **Real-time State Sync**와 **Component Isolation**을 핵심으로 하는 현대적인 프론트엔드 아키텍처를 따릅니다. 서버가 없는 환경에서도 실시간 운영 데이터를 시뮬레이션할 수 있는 'Operational Intelligence' 레이어를 포함하고 있습니다.

## 2. 기술 스택 (Tech Stack)
*   **Framework**: Vue 3 (Composition API)
*   **Build Tool**: Vite
*   **State Management**: Pinia (Centralized Operational Data)
*   **Styling**: Tailwind CSS (Glassmorphism & Adaptive Design)
*   **3D Engine**: Three.js (Spatial Viewer)
*   **Internationalization**: Vue-i18n (Runtime Multilingual System)
*   **Logging**: Custom Logger Utility (Operational Tracing)

## 3. 핵심 모듈 구조 (Core Modules)

### A. Operational Data Store (Pinia)
실시간 상태를 관리하는 심장부입니다.
*   `spaces.js`: 행사장 공간 데이터 및 메타데이터 관리.
*   `operational.js`: 실시간 혼잡도, 현재 층, 내비게이션 상태 관리.
*   `events.js`: 세션 일정 및 진행률, 카운트다운 로직 관리.
*   `notification.js`: 알림 큐 및 Red Alert 상태 관리.

### B. Spatial Navigation Engine
*   **SVG Path Mapping**: 실제 도면을 추상화한 SVG 경로를 통해 내비게이션 시각화.
*   **Dynamic Rerouting**: `operational` 스토어의 혼잡도 점수에 따라 경로를 즉석에서 재계산(Simulation).
*   **Accessibility Layer**: 휠체어 전용 경로 및 엘리베이터 위치를 포함한 레이어 전환 시스템.

### C. Immersive Viewer (Three.js)
*   **Panorama Projection**: 360도 파노라마 이미지를 구체(Sphere)에 매핑.
*   **Hotspot Projection**: 3D 공간 좌표를 2D 화면 좌표로 투영하여 인터랙티브 요소 노출.
*   **Telemetry Overlay**: 공간 데이터와 연동하여 점유율, 공기질 등의 데이터를 뷰어 상에 증강 노출.

## 4. 하네스 엔지니어링 (Harness Engineering)
개발 및 테스트 단계에서 실제 운영 상황을 검증하기 위한 도구입니다.
*   **Mock Ticker**: `eventsStore.startTicker()`를 통해 시간의 흐름을 가상으로 시뮬레이션.
*   **MockNow Query**: URL 파라미터(`?mockNow=...`)를 통해 특정 시점의 앱 상태를 즉시 재현.
*   **Update Simulation**: `opStore.simulateUpdates()`를 사용하여 실시간으로 데이터가 변하는 상황(혼잡도 변화 등)을 재현.

## 5. 런타임 다국어 시스템 (Runtime i18n)
*   **Dynamic Loading**: 도메인별(common, map, events 등)로 네임스페이스를 분리하여 로딩 최적화.
*   **Locale Persistence**: 사용자가 설정한 언어를 `localStorage`에 저장하여 세션 간 유지.
*   **Master-Mirror Policy**: `ko`를 마스터로 하여 모든 언어 파일의 키 구조를 1:1로 매핑하는 엄격한 동기화 정책 적용.

## 6. 미래 확장 아키텍처 (Future Scaling)
현재의 프론트엔드 중심 구조는 다음과 같이 확장 가능하도록 설계되었습니다.
1.  **WebSocket Integration**: Pinia 스토어의 `simulateUpdates`를 실제 서버 푸시 데이터로 교체.
2.  **WebXR Engine**: 현재의 Three.js 뷰어를 AR/VR 장치에서 바로 사용 가능한 몰입형 모드로 전환.
3.  **Edge Analytics**: 클라이언트 사이드에서 수집된 사용자 이동 경로를 익명화하여 분석 서버로 전송.
