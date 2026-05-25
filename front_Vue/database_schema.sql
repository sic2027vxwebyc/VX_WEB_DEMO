-- [VX Web Demo] MySQL Schema Definition (Finalized)
-- 최종본: 설정 기능 및 모든 요구사항 반영

SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;

-- 0. 마스터 데이터: 사용자
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY COMMENT '사용자 고유 ID',
    username VARCHAR(100) COMMENT '사용자명',
    email VARCHAR(100) UNIQUE COMMENT '이메일',
    language_code VARCHAR(10) DEFAULT 'ko' COMMENT '선호 언어 코드',
    country_code VARCHAR(10) COMMENT '국가 코드',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '사용자 마스터 정보';

-- 1. 마스터 데이터: 이벤트
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(50) PRIMARY KEY COMMENT '이벤트 고유 ID',
    day DATE NOT NULL COMMENT '이벤트 일자',
    category VARCHAR(50) COMMENT '이벤트 카테고리',
    name_key VARCHAR(100) COMMENT '이벤트명 i18n 키',
    hall_id VARCHAR(50) COMMENT '이벤트 장소 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '전체 이벤트 목록';

-- 2. 마스터 데이터: 공간 및 지도
CREATE TABLE IF NOT EXISTS floors (
    id VARCHAR(50) PRIMARY KEY COMMENT '층 고유 ID',
    label_key VARCHAR(100) COMMENT '층 라벨 i18n 키',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '건물 층 정보';

CREATE TABLE IF NOT EXISTS spaces (
    id VARCHAR(50) PRIMARY KEY COMMENT '공간 고유 ID',
    floor_id VARCHAR(50) NOT NULL COMMENT '층 ID',
    name_key VARCHAR(100) COMMENT '공간명 i18n 키',
    type VARCHAR(50) COMMENT '공간 타입',
    recommended TINYINT(1) DEFAULT 0 COMMENT '추천 공간 여부',
    alternative_id VARCHAR(50) COMMENT '우회 경로 공간 ID',
    qr_code VARCHAR(100) COMMENT 'QR 코드 식별자',
    description_key VARCHAR(100) COMMENT '설명 i18n 키',
    short_name_key VARCHAR(100) COMMENT '공간 요약명 i18n 키',
    location_key VARCHAR(100) COMMENT '위치 정보 i18n 키',
    zone_key VARCHAR(100) COMMENT '구역 정보 i18n 키',
    area VARCHAR(50) COMMENT '면적',
    image_url VARCHAR(512) COMMENT '이미지 URL',
    pano_url VARCHAR(512) COMMENT '파노라마 URL',
    distance INT UNSIGNED COMMENT '거리',
    congestion_type VARCHAR(20) COMMENT '혼잡도 타입',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    CONSTRAINT fk_spaces_floor FOREIGN KEY (floor_id) REFERENCES floors (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '지도 내 공간 정보';

-- 3. 마스터 데이터: 게임화(퀘스트, 배지)
CREATE TABLE IF NOT EXISTS quests (
    id VARCHAR(50) PRIMARY KEY COMMENT '퀘스트 고유 ID',
    name_key VARCHAR(100) COMMENT '퀘스트명 i18n 키',
    type VARCHAR(20) COMMENT '퀘스트 타입',
    reward_badge_id VARCHAR(50) COMMENT '보상 배지 ID',
    description_key VARCHAR(100) COMMENT '설명 i18n 키',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '전체 퀘스트 목록';

CREATE TABLE IF NOT EXISTS quest_requirements (
    quest_id VARCHAR(50) NOT NULL COMMENT '퀘스트 ID',
    spot_id VARCHAR(50) NOT NULL COMMENT '요구되는 공간 ID',
    PRIMARY KEY (quest_id, spot_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    CONSTRAINT fk_qr_quest FOREIGN KEY (quest_id) REFERENCES quests (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '퀘스트별 요구 스탬프';

CREATE TABLE IF NOT EXISTS badges (
    id VARCHAR(50) PRIMARY KEY COMMENT '배지 고유 ID',
    name_key VARCHAR(100) COMMENT '배지명 i18n 키',
    description_key VARCHAR(100) COMMENT '설명 i18n 키',
    icon VARCHAR(10) COMMENT '아이콘',
    unlock_condition_key VARCHAR(100) COMMENT '해금 조건 i18n 키',
    rarity VARCHAR(20) COMMENT '희귀도',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '전체 배지 목록';

-- 4. 사용자 상태 데이터
CREATE TABLE IF NOT EXISTS user_event_actions (
    user_id VARCHAR(50) NOT NULL COMMENT '사용자 ID',
    event_id VARCHAR(50) NOT NULL COMMENT '이벤트 ID',
    is_favorite TINYINT(1) DEFAULT 0 COMMENT '즐겨찾기 여부',
    is_reminder TINYINT(1) DEFAULT 0 COMMENT '알림 설정 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    PRIMARY KEY (user_id, event_id),
    CONSTRAINT fk_uea_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_uea_event FOREIGN KEY (event_id) REFERENCES events (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '사용자 이벤트 활동 데이터';

CREATE TABLE IF NOT EXISTS user_quest_progress (
    user_id VARCHAR(50) NOT NULL COMMENT '사용자 ID',
    quest_id VARCHAR(50) NOT NULL COMMENT '퀘스트 ID',
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '완료 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    PRIMARY KEY (user_id, quest_id),
    CONSTRAINT fk_uqp_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_uqp_quest FOREIGN KEY (quest_id) REFERENCES quests (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '사용자 퀘스트 완료 상태';

CREATE TABLE IF NOT EXISTS user_stamps (
    user_id VARCHAR(50) NOT NULL COMMENT '사용자 ID',
    spot_id VARCHAR(50) NOT NULL COMMENT '스탬프 획득한 공간 ID',
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '획득 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    PRIMARY KEY (user_id, spot_id),
    CONSTRAINT fk_us_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '사용자 스탬프 획득 이력';

CREATE TABLE IF NOT EXISTS user_badges (
    user_id VARCHAR(50) NOT NULL COMMENT '사용자 ID',
    badge_id VARCHAR(50) NOT NULL COMMENT '배지 ID',
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '획득 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    PRIMARY KEY (user_id, badge_id),
    CONSTRAINT fk_ub_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_ub_badge FOREIGN KEY (badge_id) REFERENCES badges (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '사용자 배지 획득 이력';

CREATE TABLE IF NOT EXISTS user_passport (
    user_id VARCHAR(50) PRIMARY KEY COMMENT '사용자 ID',
    is_reward_claimed TINYINT(1) DEFAULT 0 COMMENT '보상 수령 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    CONSTRAINT fk_up_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '사용자 패스포트 데이터';

-- 5. 운영 데이터 (실시간/로그/푸시/공지/미디어/설정)
CREATE TABLE IF NOT EXISTS operational_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '로그 고유 ID',
    scope VARCHAR(50) COMMENT '로그 범위',
    message TEXT COMMENT '로그 메시지',
    level VARCHAR(10) COMMENT '로그 레벨',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '운영 감사 로그';

CREATE TABLE IF NOT EXISTS notification_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '알림 이력 ID',
    user_id VARCHAR(50) NOT NULL COMMENT '사용자 ID',
    title_key VARCHAR(100) COMMENT '알림 제목 i18n 키',
    body_key VARCHAR(100) COMMENT '알림 내용 i18n 키',
    is_read TINYINT(1) DEFAULT 0 COMMENT '읽음 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '발송 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    CONSTRAINT fk_nh_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '사용자 알림 발송 및 읽음 이력';

-- 5-1. PWA 푸시 및 디바이스
CREATE TABLE IF NOT EXISTS user_devices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '디바이스 ID',
    user_id VARCHAR(50) NOT NULL COMMENT '사용자 ID',
    push_token VARCHAR(255) COMMENT 'Web Push Token',
    device_info JSON COMMENT '디바이스 정보 (JSON)',
    is_push_enabled TINYINT(1) DEFAULT 1 COMMENT '푸시 수신 동의',
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '마지막 사용 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    CONSTRAINT fk_ud_user FOREIGN KEY (user_id) REFERENCES users (id),
    INDEX idx_user_id (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '사용자 디바이스 및 푸시 설정';

-- 5-2. 공지사항
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '공지사항 ID',
    title_key VARCHAR(100) COMMENT '제목 i18n 키',
    content_key VARCHAR(100) COMMENT '내용 i18n 키',
    is_active TINYINT(1) DEFAULT 1 COMMENT '활성 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '등록 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '공지사항 마스터';

-- 5-3. 미디어 링크 관리
CREATE TABLE IF NOT EXISTS media_assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '미디어 ID',
    url VARCHAR(512) NOT NULL COMMENT '이미지 경로/URL',
    alt_text VARCHAR(200) COMMENT '이미지 설명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '등록 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '미디어 이미지 저장소';

-- 5-4. 사용자 환경 설정
CREATE TABLE IF NOT EXISTS user_settings (
    user_id VARCHAR(50) NOT NULL COMMENT '사용자 ID',
    is_offline_map_enabled TINYINT(1) DEFAULT 0 COMMENT '오프라인 지도 활성화',
    biometric_lock_enabled TINYINT(1) DEFAULT 0 COMMENT '생체 인식 잠금 활성화',
    perm_camera VARCHAR(20) DEFAULT 'unknown' COMMENT '카메라 권한',
    perm_location VARCHAR(20) DEFAULT 'unknown' COMMENT '위치 권한',
    perm_push VARCHAR(20) DEFAULT 'unknown' COMMENT '푸시 권한',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    PRIMARY KEY (user_id),
    CONSTRAINT fk_usettings_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '사용자 환경 설정';

-- 6. 관리자 운영 기능 (호텔, 식사)
CREATE TABLE IF NOT EXISTS hotel_reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '예약 ID',
    user_id VARCHAR(50) NOT NULL COMMENT '사용자 ID',
    room_number VARCHAR(20) COMMENT '객실 번호',
    status VARCHAR(20) COMMENT '예약 상태',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    CONSTRAINT fk_hr_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '호텔 예약 현황';

CREATE TABLE IF NOT EXISTS meal_reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '예약 ID',
    user_id VARCHAR(50) NOT NULL COMMENT '사용자 ID',
    meal_type VARCHAR(20) COMMENT '식사 종류',
    is_picked_up TINYINT(1) DEFAULT 0 COMMENT '수령 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    CONSTRAINT fk_mr_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT '식사 배분/예약 현황';

SET FOREIGN_KEY_CHECKS = 1;

-- Migration: 001_schema_refinements
-- Apply schema improvements to existing database

-- [events 테이블 변경]
ALTER TABLE events MODIFY COLUMN day DATE NOT NULL COMMENT '이벤트 일자';

-- [spaces 테이블 변경]
ALTER TABLE spaces MODIFY COLUMN distance INT UNSIGNED COMMENT '거리';

-- [reservations 테이블 변경]
ALTER TABLE hotel_reservations
MODIFY COLUMN status ENUM(
    'pending',
    'confirmed',
    'cancelled',
    'checked_in'
) DEFAULT 'pending';

ALTER TABLE meal_reservations
MODIFY COLUMN meal_type ENUM(
    'breakfast',
    'lunch',
    'dinner'
) DEFAULT 'lunch';