# Re-Audited Backend API PRD

## Re-Audit Verdict
- **기존 API 후보 7개가 충분한가?**: No. 현재는 기능별 엔드포인트가 전혀 정의되지 않은 상태임.
- **이유**: 기존 PRD는 프론트엔드 컴포넌트의 일부만 시뮬레이션한 수준이며, 실무적인 사용자 상태 변경(즐겨찾기, 체크인, 퀘스트 완료 등)과 관리자 기능, 실시간 SSE 처리를 위한 API 정의가 누락됨.

## Missing API Matrix (Partial Example)
| 영역     | 화면/View             | 기능             | 사용자 액션   | 필요 API                 | Method | 사용 TB            | 추가 필요 TB        | 권한   | 실시간 |
| -------- | --------------------- | ---------------- | ------------- | ------------------------ | ------ | ------------------ | ------------------- | ------ | ------ |
| Auth     | 전역                  | 사용자 인증      | 로그인        | /api/auth/login          | POST   | users              | -                   | PUBLIC | N      |
| Auth     | 전역                  | 사용자 정보 조회 | 페이지 로드   | /api/auth/me             | GET    | users              | -                   | USER   | N      |
| Event    | EventScheduleLive     | 즐겨찾기         | 하트 클릭     | /api/events/:id/favorite | POST   | user_event_actions | -                   | USER   | N      |
| Event    | EventScheduleLive     | 즐겨찾기 해제    | 하트 클릭     | /api/events/:id/favorite | DELETE | user_event_actions | -                   | USER   | N      |
| Map      | InteractiveMapLive    | 공간 조회        | 층 선택       | /api/map/spaces          | GET    | spaces, floors     | -                   | PUBLIC | N      |
| Map      | InteractiveMapLive    | 혼잡도 조회      | 지도 열기     | /api/map/congestion      | GET    | -                  | realtime_congestion | PUBLIC | Y      |
| Stamp    | QuestHub_v2           | 스탬프 획득      | QR 스캔       | /api/user/stamps         | POST   | user_stamps        | -                   | USER   | N      |
| Passport | ConventionPassport_v2 | 패스포트 확인    | 페이지 진입   | /api/user/passport       | GET    | user_passport      | -                   | USER   | N      |
| Admin    | AdminDashboardView    | 로그 조회        | 대시보드 진입 | /api/admin/logs          | GET    | operational_logs   | -                   | ADMIN  | N      |

## Expected API Count
| 영역         | 최소 API 수 | 비고                             |
| ------------ | ----------: | -------------------------------- |
| Auth/Perm    |           4 | 로그인/정보/권한/로그아웃        |
| Event        |           5 | 목록/상세/즐겨찾기(P/D)/알림설정 |
| Notification |           4 | 목록/상세/읽음(1/전체)           |
| Map          |           3 | 공간목록/상세/실시간혼잡도       |
| Route/AR     |           3 | 경로요청/마커조회/환경체크       |
| Booking      |           4 | 예약조회/체크인/방문상태/도착    |
| Gamification |           6 | 퀘스트/스탬프/배지/보상          |
| Admin        |           5 | 통계/로그/알림관리/이벤트관리    |
| **Total**    |      **34** | **최소 30개 이상의 API 예상**    |

## Missing Tables
| 추가 필요 TB        | 이유                                     | 관련 화면          | 우선순위 |
| ------------------- | ---------------------------------------- | ------------------ | -------- |
| realtime_congestion | 공간별 실시간 혼잡도 정보 저장 및 동기화 | InteractiveMapLive | HIGH     |
| sse_connections     | 실시간 SSE 연결 관리                     | 전역               | MEDIUM   |

## Updated PRD
- **파일**: `/Users/youngchanlee/workFace/VX_Web_Demo/back_Go/docs/back_Go_API_PRD.MD`
- **업데이트 여부**: Yes

## 11. 실시간 데이터 처리 전략 (Realtime Data Strategy)
* **혼잡도 데이터**: 
    * **실시간 조회**: Redis 캐시를 사용하여 즉각적인 조회 성능 확보.
    * **데이터 보존**: 비동기 처리를 통해 시계열 로그 테이블(또는 별도 DB)에 저장하여 통계 및 분석 지원.
    * **갱신 주기**: 30초 단위 풀링 또는 이벤트 기반 실시간 푸시.

## Final Verdict
* Previous PRD Was Incomplete