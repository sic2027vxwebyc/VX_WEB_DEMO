# VX Web V2: Gamification System

## 1. 개요 (System Overview)
VX Web V2의 게이미피케이션 시스템은 단순히 재미를 위한 요소가 아니라, **행사장 내 인원 분산**과 **참가자 체류 시간 증대**를 목표로 하는 전략적 도구입니다.

## 2. 핵심 구성 요소 (Core Components)

### A. QR Stamp Tour (공간 탐험)
*   **목적**: 행사장 구석구석을 방문하도록 유도하여 공간 활용도를 높임.
*   **작동 방식**: 특정 위치에 비치된 QR 코드를 스캔하면 디지털 스탬프를 획득.
*   **데이터 연동**: `stampStore`를 통해 수집된 스탬프 목록 및 진행률 관리.

### B. Convention Passport (활동 기록)
*   **목적**: 참가자의 여정을 하나의 '이야기'로 아카이빙.
*   **내용**: 방문한 장소, 참여한 세션, 획득한 스탬프가 시간순으로 기록됨.
*   **심리적 가치**: 디지털 굿즈로서의 소장 가치를 부여하여 재방문 및 지속적 참여 유도.

### C. Quest & Badges (성취 동기)
*   **Quest**: "식당가 방문하기", "오전 세션 3개 듣기" 등 구체적인 미션 부여.
*   **Badges**: 특정 조건을 만족했을 때 수여되는 시각적 보상 (예: 얼리버드, 공간 정복자 등).
*   **동적 업데이트**: 사용자의 행동(Navigation 완료, 360 뷰어 확인 등)에 따라 실시간으로 배지 잠금 해제 가능 여부 판단.

### D. Reward Claim (보상 체계)
*   **목적**: 디지털 성취를 실제 혜택으로 전환.
*   **기능**: 일정 수 이상의 스탬프나 특정 배지를 획득했을 때 리워드 쿠폰 또는 교환권 발행.

## 3. 운영 관점의 전략적 활용 (Strategic Usage)

### 인원 분산 (Crowd Management)
*   **Dynamic Recommendation**: 현재 혼잡도가 낮은 구역을 '추천 장소'로 선정하고 스탬프 획득 시 가중 점수 부여.
*   **Detour Quests**: 우회 경로에 있는 전시 부스를 방문하는 퀘스트를 통해 자연스러운 인원 흐름 분산 유도.

### 부스 참여도 향상 (Exhibition Engagement)
*   **Vendor Quests**: 특정 스폰서 부스 방문 시 특별 배지 제공.
*   **Telemetry-based Tasks**: 360 뷰어를 통해 특정 공간을 미리 확인해야 활성화되는 퀘스트 설계.

## 4. 현재 구현 상태 (Current Implementation)
*   **QR Scanner Mock**: 실제 카메라 연동 대신 스캔 과정을 시뮬레이션할 수 있는 모킹 UI 구현.
*   **Progress Visualization**: 원형 진행률 표시기(Progress Ring) 및 스탬프 카드 컴포넌트 완성.
*   **Local State Management**: Pinia를 이용한 클라이언트 사이드 데이터 저장 및 로직 구현 완료.

## 5. 향후 확장 (Future Expansion)
*   **Leaderboard**: 참가자들 간의 스탬프 수집 순위 공개 (소셜 경쟁 요소).
*   **Social Badge Sharing**: 획득한 배지를 SNS로 즉시 공유할 수 있는 기능.
*   **NFC/Beacon Tagging**: QR 스캔 없이 특정 위치에 접근하는 것만으로 스탬프가 찍히는 자동 체크인 시스템.
