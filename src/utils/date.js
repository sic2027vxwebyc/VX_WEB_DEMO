/**
 * [ 날짜 및 시간 유틸리티 ]
 * 이벤트 일정 계산, 시간 형식 변환 및 실시간 상태 비교를 위한 순수 함수들을 제공합니다.
 */

/**
 * 요일 순서 정의
 */
export const DAY_ORDER = {
  'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 7
}

/**
 * 이벤트 시간 형식을 표준화합니다.
 * @param {Object} item 이벤트 객체
 * @returns {string} HH:mm 형식의 시작 시간
 */
export function normalizeEventTime(item) {
  if (!item || !item.time) return '00:00'
  
  // "14:00 - 16:00" -> "14:00"
  let timeStr = item.time.split('-')[0].trim()
  
  // PM 처리
  if (timeStr.includes('PM')) {
    let [h, m] = timeStr.replace('PM', '').trim().split(':')
    if (h !== '12') h = parseInt(h) + 12
    timeStr = h + ':' + m
  } else if (timeStr.includes('AM')) {
    let [h, m] = timeStr.replace('AM', '').trim().split(':')
    if (h === '12') h = '00'
    timeStr = h + ':' + m
  }
  
  return timeStr
}

/**
 * HH:mm 형식을 분 단위 숫자로 변환합니다.
 */
export function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

/**
 * 현재 요일을 소문자 영문 전체 명칭으로 반환합니다. (ex: friday, saturday)
 */
export function getNowDay(date) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

/**
 * 현재 시간을 분 단위로 반환합니다.
 */
export function getNowMinutes(date) {
  return date.getHours() * 60 + date.getMinutes()
}
