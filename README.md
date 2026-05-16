# VX Web V2: Spatial Experience Platform

<!-- ![VX Web Demo](/src/assets/IMG_2798.jpg) -->

## 1. 프로젝트 개요 (Project Overview)
**VX Web V2**는 대규모 국제대회 및 컨벤션의 물리적 공간과 디지털 정보를 실시간으로 결합하는 **공간 경험 플랫폼(Spatial Experience Platform)**입니다. 

기존의 단순 정보 전달형 웹사이트를 넘어, "사용자가 정보를 찾아다니는 것이 아니라, 공간이 상황에 맞춰 정보를 제안한다"는 **Runtime UX** 철학을 바탕으로 설계되었습니다. 하네스 엔지니어링(Harness Engineering) 기법을 도입하여 실제 운영 환경의 혼잡도, 긴급 상황, 다국어 요구사항을 가상으로 시뮬레이션하고 검증할 수 있는 견고한 런타임을 제공합니다.

## 2. 핵심 기술 아키텍처 (Technical Architecture)

### 기술 스택 (Tech Stack)
*   **Framework**: Vue 3 (Composition API)
*   **Build Tool**: Vite
*   **State Management**: Pinia (Centralized Operational Data)
*   **3D Engine**: Three.js (Spatial Viewer)
*   **Internationalization**: Vue-i18n (Runtime Multilingual System)
*   **Styling**: Tailwind CSS (Glassmorphism & Adaptive Design)

### 주요 모듈 구조
*   **Operational Data Store**: 실시간 혼잡도, 세션 일정, 알림 큐를 관리하는 시스템의 심장부.
*   **Spatial Navigation Engine**: SVG 경로 매핑 및 혼잡도 기반 동적 우회(Dynamic Rerouting) 지원.
*   **Immersive Viewer**: 360도 파노라마 뷰어 상의 3D Hotspot 투영 및 텔레메트리 오버레이.
*   **Harness Engineering**: `MockNow` 쿼리 및 `Update Simulation`을 통한 운영 시나리오 검증 도구.

## 3. 주요 기능 (Key Features)

| 기능                 | 설명                                                               |
| :------------------- | :----------------------------------------------------------------- |
| **Home V2 (Live)**   | 실시간 히어로 모드, 카운트다운, 혼잡도 요약 및 긴급 공지 티커 제공 |
| **Route Guide**      | 실내 내비게이션, 접근성 경로(엘리베이터/경사로), 실시간 우회 안내  |
| **Viewer360**        | Three.js 기반 360 공간 탐색, 3D 투영 핫스팟, 실시간 상태 정보 결합 |
| **Interactive Map**  | 3D 히트맵 시각화, 공간별 혼잡도 분석, 최적 출입구 추천 시스템      |
| **Events Hub**       | 프리미엄 타임라인, 실시간 진행 상태(LIVE) 표시 및 일정 관리        |
| **Notification Hub** | Red Alert(긴급 공지), 대피 안내, 카테고리별 알림 센터              |
| **Gamification**     | QR 스탬프 투어, 여권(Passport) 시스템, 배지 및 리워드 체계         |

## 4. 특화 시스템 (Specialized Systems)

### 게이미피케이션 (Gamification)
단순한 재미를 넘어 **행사장 내 인원 분산**과 **참가자 참여 시간 증대**를 목표로 합니다. QR 스탬프 투어, 활동 기록을 담는 컨벤션 패스포트, 성취 동기를 자극하는 퀘스트와 배지 시스템이 유기적으로 작동합니다.

### 런타임 다국어 시스템 (Multilingual System)
글로벌 대회의 특성을 고려하여 25개 이상의 네임스페이스로 분리된 정밀한 번역 구조를 갖추고 있습니다. 한국어(`ko`)를 마스터로 하여 모든 지원 언어(`en`, `ja`, `zh-TW`, `es` 등)가 1:1로 매핑되는 **Master-Mirror Policy**를 통해 운영 일관성을 유지합니다.

## 5. 미래 로드맵 (Future Roadmap)

*   **Phase 1 (Infrastructure)**: Backend(Node.js/Go) 연동, PostgreSQL/Redis 도입, WebSocket 실시간 동기화.
*   **Phase 2 (Intelligence)**: Beacon/BLE 기반 실시간 실내 측위(IPS), WebXR(AR/VR) 공식 지원, AI 경로 최적화.
*   **Phase 3 (Ecosystem)**: 소셜 통합 퀘스트, 리워드 마켓플레이스, 디지털 아카이브 확장.

---
**VX Web V2**는 미래형 컨벤션 운영의 표준을 제시하며, 전 세계 참가자들에게 가장 진보된 공간 경험을 선사합니다.
