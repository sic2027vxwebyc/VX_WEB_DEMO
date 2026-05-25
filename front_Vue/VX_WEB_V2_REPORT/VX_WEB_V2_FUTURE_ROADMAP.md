# VX Web V2: Future Roadmap

## 1. 개요 (Roadmap Overview)
현재 VX Web V2는 고성능 프론트엔드 프로토타입 및 런타임 시스템이 완성된 상태입니다. 다음 단계는 이를 실제 운영 환경에 배포하고, 실시간 데이터와의 연결성을 강화하며, 사용자 참여를 극대화하는 방향으로 확장됩니다.

## 2. 개발 단계별 로드맵 (Phase-by-Phase)

### Phase 1: Real-time Infrastructure (Backend & Connectivity)
*   **Backend Server**: Node.js/Go 기반의 실시간 API 서버 구축.
*   **Database**: PostgreSQL(영구 데이터), Redis(실시간 상태) 도입.
*   **Live Sync**: WebSocket을 통한 혼잡도 및 긴급 공지 실시간 푸시 시스템.
*   **Auth System**: 참가자 ID 및 QR 기반 세션 관리.

### Phase 2: Advanced Spatial Intelligence
*   **Indoor Positioning**: Beacon/BLE 또는 Wi-Fi 지문인식 기반의 실시간 위치 측위(IPS) 연동.
*   **WebXR Support**: VR 헤드셋 및 AR 글래스 지원을 위한 브라우저 XR API 최적화.
*   **AI Pathfinding**: 과거 혼잡 데이터를 학습하여 미래의 혼잡을 예측하고 경로를 제안하는 AI 엔진.

### Phase 3: Gamification & Engagement Expansion
*   **Social Integration**: 참가자 간 위치 공유(선택적) 및 팀 기반 퀘스트.
*   **Reward Marketplace**: 획득한 배지와 스탬프를 실제 현장 굿즈나 쿠폰으로 교환하는 시스템.
*   **Interactive Passport**: 자신의 이동 경로와 참여 세션을 타임라인 형태로 소장할 수 있는 디지털 아카이브.

## 3. 백엔드 도입 시 핵심 기능 (Required Backend Features)
백엔드 도입을 통해 플랫폼은 더욱 견고한 운영 시스템으로 진화합니다.
*   **User Session Tracking**: 참가자의 실시간 위치 및 활동 로그 수집 (익명화).
*   **QR Validation**: 스탬프 및 리워드 지급을 위한 보안 강화된 QR 검증 로직.
*   **Admin Dashboard**: 실시간 인파 관리, 공지 발송, 현장 요원 배치 최적화 도구.
*   **Analytics Engine**: 구역별 체류 시간, 이동 패턴 분석을 통한 운영 리포트 자동 생성.

## 4. 기술적 도전 과제 (Technical Challenges)
*   **High Availability**: 만 단위의 동시 접속자가 발생하는 환경에서의 안정적인 소켓 연결 유지.
*   **Offline First**: 네트워크가 불안정한 대형 행사장 내부에서도 핵심 기능을 유지하기 위한 PWA/Service Worker 최적화.
*   **Privacy by Design**: 사용자 위치 데이터의 엄격한 보안 처리 및 개인정보 보호 가이드라인 준수.

## 5. 비전: The Convention OS
우리의 최종 목표는 VX Web V2가 단순한 앱이 아닌, **컨벤션을 위한 운영체제(The Convention Operating System)**가 되는 것입니다. 모든 하드웨어(키오스크, 디지털 사이니지)와 소프트웨어(참가자 앱, 관리자 패널)가 이 플랫폼 위에서 하나로 통합되어 운영될 것입니다.
