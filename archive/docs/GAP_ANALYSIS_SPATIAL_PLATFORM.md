# Spatial Platform Gap Analysis & Roadmap

본 문서는 **"실시간 국제대회 공간 경험 플랫폼(Real-Time International Convention Spatial Experience Platform)"** 디자인 프롬프트의 요구사항과 현재 **VX Web Demo** 프로젝트의 구현 상태를 비교 분석한 결과입니다.

---

## 📊 플랫폼 기능 및 화면 비교 분석표

| 카테고리 / 화면 | 프롬프트 요구사항 (목표) | 현재 프로젝트 구현 상태 (AS-IS) | 🚨 부족하거나 없는 기능 (TO-BE) |
| :--- | :--- | :--- | :--- |
| **1. 홈 화면 (Home)** | **행동 중심, 실시간 상황 인지**<br>- 현재 Hall, 혼잡도, 다음 일정<br>- 대형 행동 버튼 (길찾기, 좌석 등)<br>- 실시간 공지 카드<br>- 빠른 QR 접근 버튼 | **기본 구현됨 (V2 중심)**<br>- \`Home_v2.vue\`에 실시간 상태 Hero 카드 구현<br>- 길찾기, 오늘 일정 대형 버튼 존재<br>- 긴급 공지 티커(Ticker) 존재 | - 좌석 찾기 행동 버튼<br>- 가까운 편의시설 퀵 버튼<br>- 빠른 QR 접근 플로우 연결<br>- 사용자 위치/시간 기반 상태 자동 변경 고도화 |
| **2. 실내 길찾기 (Route Guide)** | **실시간 이동 안내**<br>- 도보 시간, 혼잡 기반 경로 추천<br>- 장애인 접근 경로/가까운 화장실<br>- 빛나는 이동 경로 (Spatial Depth)<br>- PC: Split Map View / 다중 패널 | **기초 기능 구현됨**<br>- \`RouteGuideView.vue\` / \`v2\`<br>- 목적지 안내 및 AR Fallback 기능<br>- \`ArNavigationView.vue\` 연결 | - **혼잡 기반 경로 재계산 (동적 라우팅)**<br>- 장애인/교통약자 전용 경로 선택<br>- 화장실/출구 최단거리 퀵 안내<br>- PC 환경에 특화된 다중 패널 뷰 부족 |
| **3. 공간 경험 (Viewer 360)** | **몰입감 있는 공간 탐색**<br>- 360 Viewer + Hotspot 인터랙션<br>- 실시간 혼잡 Overlay<br>- 빠른 공간 이동, Route 바로가기 | **기본 프레임워크 구현됨**<br>- \`Viewer360View.vue\` / \`v2\`<br>- Three.js 또는 파노라마 기반 뷰어 틀 존재 | - **실시간 혼잡도 Overlay (360 뷰어 내)**<br>- 시네마틱 효과 및 부드러운 Spatial 전환<br>- 뷰어 내에서 즉시 길찾기(Route)로 연결되는 플로우 |
| **4. 오늘 일정 (Events)** | **타임라인 중심 진행 상태**<br>- 현재/다음 세션 카운트다운<br>- 진행 상태 바, 언어별 필터<br>- PC: 사이드 타임라인, 공지 패널 | **잘 구현됨 (V2 기준)**<br>- \`EventSchedule_v2.vue\` 존재<br>- 카운트다운 로직 (\`utils/date.js\`) 완비<br>- 상태별 컬러 매핑 완료 | - 사용자 개인 즐겨찾기(My Schedule) 기능<br>- 일정 시작 임박 알림 (Push/UI Notification)<br>- 일정 카드에서 해당 Hall 길찾기로 바로 연결 |
| **5. 다국어 (Multi-Language)** | **매우 쉬운 언어 전환**<br>- 한국어, 영어, 중국어, 일본어 등<br>- 통역 장비 안내, 언어별 공지<br>- 접근성 모드 | **강력하게 구현됨**<br>- \`vue-i18n\` 기반 5+ 다국어 세팅 완료<br>- \`SettingsView.vue\` 언어/글자 크기 변경 | - 특정 언어 사용자(해외 대표자)를 위한 맞춤형 통역 장비/위치 안내 로직 |
| **6. 실시간 혼잡도 (Map)** | **공간 혼잡 상황 시각화**<br>- Heatmap 스타일, Spatial Overlay<br>- 추천 이동 경로, 식당/화장실 혼잡 | **부분 구현됨**<br>- \`InteractiveMapView.vue\`<br>- \`mapStore\`에 status(low, moderate, high) 데이터 존재 | - **Heatmap 스타일의 고도화된 비주얼**<br>- 식사 공간/화장실 전용 혼잡도 퀵뷰<br>- 혼잡을 피하는 '추천 출입구/경로' 안내 |
| **7. 긴급 공지 (Notifications)** | **명확하고 즉각적인 정보 전달**<br>- 긴급 알림, 대피 경로<br>- 큰 텍스트, 고대비 모드 | **UI 뼈대 존재**<br>- \`NotificationHubView.vue\`<br>- 홈 화면 상단 Ticker 존재 | - **대피 경로 및 재난 상황 전용 화면 (Red Alert 모드)**<br>- 분실물, 날씨, 교통 안내 탭 세분화 |
| **8. 역할 기반 경험 (Role-Based)** | **사용자 유형별 맞춤 UX**<br>- 일반, 봉사자, 고령층, 대표자<br>- 역할에 따른 다른 홈 화면/우선 행동 | **구현 안 됨 (Missing)**<br>- 현재 모든 사용자에게 동일한 화면 제공 | - **사용자 역할(Role) 선택 또는 QR 스캔에 따른 데이터 분기**<br>- 자원봉사자 전용 스케줄/교대 시간 안내<br>- 고령층 전용 Simple UI (초대형 버튼 모드) |

---

## 🎯 디자인 시스템 및 UX 원칙 준수 현황

### ✅ 준수 중인 항목 (Strengths)
- **Glassmorphism & Spatial Layering**: \`DESIGN.md\`를 기반으로 한 세련된 UI 레이어링 적용.
- **반응형 구조**: 모바일과 데스크탑 간의 기본 레이아웃 대응 완료.
- **다국어 아키텍처**: 모든 텍스트의 외부화(JSON) 및 런타임 언어 변경 지원.
- **V2 점진적 확장**: 기존 기능을 파괴하지 않고 \`_v2.vue\` 파일을 통해 안전하게 Spatial UX 실험 중.

### ⚠️ 보완이 필요한 항목 (Gaps)
- **Action-First 인터랙션**: 단순 정보 나열보다 "어디로 가야 하는가"에 대한 직관적인 행동 유도 강화 필요.
- **고령층 접근성**: 핵심 행동 버튼의 크기 및 텍스트 시인성 추가 상향.
- **실시간 생동감**: 정적인 데이터 표시보다 애니메이션, 카운트다운, 라이브 인디케이터 등을 통한 "살아있는 플랫폼" 느낌 강화.
- **PC 전용 운영 콘솔 레이아웃**: 모바일 뷰의 확장이 아닌, 대화면을 활용한 다중 패널(Split View) 구성.

---

## 🚀 향후 로드맵 제언

1.  **사용자 역할(Role) 시스템 도입**:
    *   \`operationalStore\` 확장 및 \`userStore\` 추가를 통해 권한별 맞춤형 홈 화면 제공.
2.  **지능형 공간 운영 로직**:
    *   혼잡도 데이터를 분석하여 최적의 이동 경로 및 출입구를 추천하는 AI 어시스턴트 기능 강화.
3.  **Spatial Navigation 고도화**:
    *   \`InteractiveMap\`과 \`RouteGuide\` 간의 전환을 더 부드럽고 공간감 있게(Spatial Transition) 개선.
4.  **PC 운영 대시보드 모드**:
    *   PC 해상도에서 지도와 타임라인이 동시에 표시되는 '관제 센터' 스타일의 레이아웃 개발.

---
*Created on: 2026-05-16*
*Source: Spatial Event Platform Design Mandates*
