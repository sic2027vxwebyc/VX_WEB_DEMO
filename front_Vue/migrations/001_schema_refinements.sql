-- Migration: 001_schema_refinements
-- Apply schema improvements to existing database

-- [events 테이블 변경]
ALTER TABLE events MODIFY COLUMN day DATE NOT NULL COMMENT '이벤트 일자';

-- [spaces 테이블 변경]
ALTER TABLE spaces MODIFY COLUMN distance INT UNSIGNED COMMENT '거리';

-- [reservations 테이블 변경]
ALTER TABLE hotel_reservations MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled', 'checked_in') DEFAULT 'pending';
ALTER TABLE meal_reservations MODIFY COLUMN meal_type ENUM('breakfast', 'lunch', 'dinner') DEFAULT 'lunch';
