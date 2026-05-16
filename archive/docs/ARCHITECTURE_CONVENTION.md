# VX Web Demo Architecture Convention

이 문서는 VX Web Demo 프로젝트의 일관된 코드 구조와 팀 협업을 위한 아키텍처 가이드를 정의합니다.

## 1. 계층별 역할 정의

### 1.1 Pages (`src/views/**`)
- **역할**: Route 단위의 화면 진입점, 화면 흐름 제어(Orchestration).
- **허용 사항**:
  - `useRoute`, `useRouter`를 통한 파라미터 해석 및 페이지 이동.
  - Store 연결 및 Action 호출 트리거.
  - 자식 컴포넌트에 Props 전달 및 Event 수신.
  - 페이지 수준의 로딩/에러 상태 관리.
- **금지 사항**:
  - 복잡한 API 직접 호출 (Axios 등).
  - 복잡한 비즈니스 계산 로직 (Utils로 이동).
  - 300줄 이상의 방대한 UI 렌더링 (Components로 분리).

### 1.2 Components (`src/components/**`)
- **역할**: 재사용 가능한 UI 표현 및 사용자 상호작용 처리.
- **허용 사항**:
  - Props 기반 데이터 렌더링.
  - Emit 기반 이벤트 전달.
  - 컴포넌트 내부의 로컬 UI 상태 (예: `isOpen`, `activeTab`).
- **금지 사항**:
  - API 직접 호출.
  - 전역 Store 상태를 직접 변경 (Action을 통해서만 변경).
  - 복잡한 비즈니스 정책 결정.

### 1.3 Stores (`src/stores/**`)
- **역할**: 애플리케이션의 전역 상태 및 도메인 데이터 관리.
- **허용 사항**:
  - 전역 상태 정의 및 Action을 통한 상태 변경.
  - API 호출을 통한 데이터 패칭 및 에러 핸들링.
  - Computed Getter를 활용한 파생 데이터 제공.
- **금지 사항**:
  - DOM 직접 접근 (`window`, `document`).
  - UI 모달/토스트 직접 제어.

### 1.4 Services (`src/services/**`)
- **역할**: 외부 API 통신 및 데이터 정규화.
- **허용 사항**:
  - API 엔드포인트 관리.
  - 서버 데이터 포맷 변환 (Normalize).
- **금지 사항**:
  - Vue 반응형 API (`ref`, `computed`) 사용.
  - UI 상태 관리.

### 1.5 Utils (`src/utils/**`)
- **역할**: 순수 함수 기반의 공통 계산 로직.
- **허용 사항**:
  - 시간/날짜 정규화.
  - 수학적 계산, 문자열 포맷팅.
- **금지 사항**:
  - Side Effect (Store, Router 의존성).

### 1.6 i18n (`src/i18n/**`)
- **역할**: 사용자에게 노출되는 모든 텍스트 관리.
- **허용 사항**:
  - 언어별 JSON 데이터.
  - 다국어 지원 관련 유틸리티.
- **금지 사항**:
  - 비즈니스 로직용 식별자(ID) 혼용.

## 2. Import 방향 규칙

- **Pages** → Stores, Services, Composables, Components, Utils, i18n
- **Components** → Utils, i18n, Composables (API 호출 금지)
- **Stores** → Services, Utils
- **Services** → Utils (Vue 의존성 금지)
- **Utils** → 독립적 (의존성 없음)

## 3. 코드 리뷰 체크리스트
1. [ ] 한 파일이 너무 비대하지 않은가? (추천 300줄 이내)
2. [ ] 비즈니스 로직이 View에 직접 노출되어 있지 않은가?
3. [ ] 사용자 노출 문구가 하드코딩되어 있지 않은가? (한국어 포함)
4. [ ] 로깅 표준(`logger`)이 적절히 적용되었는가?
5. [ ] API 호출이 Service/Store 레이어로 캡슐화되었는가?
