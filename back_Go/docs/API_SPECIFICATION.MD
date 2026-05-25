# API Specification - VX Web Demo

## 1. Auth 도메인
| Method | Path | 목적 | 권한 | Request | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | /api/v1/auth/login | 사용자 로그인 | PUBLIC | `{email, password}` | `{token, user: {id, username, email, language_code, country_code}}` |
| GET | /api/v1/auth/me | 현재 사용자 정보 | USER | - | `{user: {id, username, email, language_code, country_code, created_at, updated_at}}` |
| POST | /api/v1/auth/logout | 로그아웃 | USER | - | `{success}` |

## 2. Event 도메인
| Method | Path | 목적 | 권한 | Request | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | /api/v1/events | 일정 목록 조회 | PUBLIC | `?day, ?category` | `{data: [{id, day, category, name_key, hall_id}]}` |
| GET | /api/v1/events/:id | 일정 상세 조회 | PUBLIC | - | `{data: {id, day, category, name_key, hall_id}}` |
| POST | /api/v1/events/:id/favorite | 즐겨찾기 추가 | USER | - | `{success}` |
| DELETE | /api/v1/events/:id/favorite | 즐겨찾기 해제 | USER | - | `{success}` |

## 3. Map 도메인
| Method | Path | 목적 | 권한 | Request | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | /api/v1/map/floors | 층 정보 목록 | PUBLIC | - | `{data: [{id, label_key}]}` |
| GET | /api/v1/map/spaces | 공간 목록 | PUBLIC | `?floor_id` | `{data: [{id, floor_id, name_key, type, qr_code, description_key, location_key, image_url, pano_url, congestion_type}]}` |
| GET | /api/v1/map/congestion | 실시간 혼잡도 | PUBLIC | - | `{data: {space_id, congestion_type}}` |

## 4. Notification 도메인
| Method | Path | 목적 | 권한 | Request | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | /api/v1/notifications | 알림 목록 조회 | USER | - | `{data: [{id, user_id, title_key, body_key, is_read, created_at}]}` |
| GET | /api/v1/notifications/:id | 알림 상세 조회 | USER | - | `{data: {id, user_id, title_key, body_key, is_read, created_at}}` |
| PATCH | /api/v1/notifications/:id/read | 알림 읽음 처리 | USER | - | `{success}` |
| PATCH | /api/v1/notifications/read-all | 전체 알림 읽음 처리 | USER | - | `{success}` |
| GET | /api/v1/notifications/stream | 알림 실시간 스트림 | USER | - | (SSE) |

## 5. Gamification 도메인
| Method | Path | 목적 | 권한 | Request | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | /api/v1/quests | 퀘스트 목록 | USER | - | `{data: [{id, name_key, type, reward_badge_id, description_key, required_spots: []}]}` |
| POST | /api/v1/user/stamps | 스탬프 획득 | USER | `{spot_id}` | `{success}` |
| GET | /api/v1/user/passport | 패스포트 현황 | USER | - | `{data: {is_reward_claimed, stats: {total_stamps, completed_quests, unlocked_badges}}}` |
| GET | /api/v1/user/badges | 배지 목록 | USER | - | `{data: [{badge_id, unlocked_at, name_key, description_key, icon, rarity}]}` |

## 6. Route/AR 도메인
| Method | Path | 목적 | 권한 | Request | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | /api/v1/route/path | 경로 요청 | USER | `?from, ?to` | `{data: {path: [], instructions: []}}` |
| GET | /api/v1/ar/markers | AR 마커 조회 | USER | `?lat, ?lng` | `{data: [{id, type, position}]}` |
| GET | /api/v1/ar/environment | 환경 체크 | USER | - | `{data: {status, permissions}}` |

## 7. Booking 도메인
| Method | Path | 목적 | 권한 | Request | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | /api/v1/booking/hotel | 호텔 예약 조회 | USER | - | `{data: {id, room_number, status}}` |
| POST | /api/v1/booking/hotel/checkin | 호텔 체크인 | USER | - | `{success}` |
| GET | /api/v1/booking/meal | 식사 예약 조회 | USER | - | `{data: {id, meal_type, is_picked_up}}` |
| POST | /api/v1/booking/meal/pickup | 식사 수령 | USER | - | `{success}` |

## 8. Admin 도메인
| Method | Path | 목적 | 권한 | Request | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | /api/v1/admin/logs | 운영 로그 조회 | ADMIN | `?scope, ?level` | `{data: [{id, scope, message, level, created_at}]}` |
| POST | /api/v1/admin/announcements | 공지사항 발송 | ADMIN | `{title_key, content_key}` | `{success}` |
| GET | /api/v1/admin/metrics | 운영 지표 조회 | ADMIN | - | `{data: {active_users, recent_events}}` |
