/**
 * 날짜 및 시간 관련 순수 함수 유틸리티
 */

/**
 * 시간 정규화
 * @param {Object} event 이벤트 객체
 * @returns {string} 정규화된 시간 (HH:mm)
 */
export function normalizeEventTime(event) {
  if (event.time === '00:10' && event.displayTime === '12:10') {
    return '12:10'
  }
  return event.time
}

/**
 * HH:mm 형식을 분 단위로 변환
 * @param {string} timeStr 시간 문자열
 * @returns {number} 분 단위 시간
 */
export function toMinutes(timeStr) {
  if (!timeStr) return 0
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + (minutes || 0)
}

/**
 * 요일 순서 정의
 */
export const DAY_ORDER = {
  friday: 1,
  saturday: 2,
  sunday: 3
}

/**
 * 요일 목록
 */
export const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

/**
 * 현재 요일 반환 (Mock 지원)
 * @param {Date} date 현재 시간 객체
 * @returns {string} 요일 키값
 */
export function getNowDay(date) {
  const mockDay = localStorage.getItem('EVENTS_MOCK_NOW_DAY')
  if (mockDay) return mockDay
  
  return DAYS[date.getDay()]
}

/**
 * 현재 분 반환 (Mock 지원)
 * @param {Date} date 현재 시간 객체
 * @returns {number} 분 단위 시간
 */
export function getNowMinutes(date) {
  const mockTime = localStorage.getItem('EVENTS_MOCK_NOW_TIME')
  if (mockTime) {
    return toMinutes(mockTime)
  }
  return date.getHours() * 60 + date.getMinutes()
}
