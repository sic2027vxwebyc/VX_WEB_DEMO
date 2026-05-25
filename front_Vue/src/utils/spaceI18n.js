/**
 * [ 공간 i18n 리졸버 ]
 * 공간 데이터의 i18n 키를 안전하게 해결하고 개발 중 누락을 감지합니다.
 */
import { logger } from './logger'

/**
 * 공간 객체의 특정 필드에 대한 번역 문구를 반환합니다.
 * @param {Object} space 공간 데이터 객체
 * @param {Function} t vue-i18n의 t 함수
 * @param {Function} te vue-i18n의 te 함수 (선택 사항)
 * @param {string} field 필드 종류 ('name', 'description', 'shortName', 'location')
 * @returns {string} 번역된 문자열
 */
export function resolveSpaceLabel(space, t, te, field = 'name') {
  if (!space) return ''

  const keyMap = {
    name: space.nameKey,
    description: space.descriptionKey,
    shortName: space.shortNameKey,
    location: space.locationKey
  }

  const key = keyMap[field]

  if (!key) {
    // nameKey가 없는 경우 폴백 처리 (운영 안정성)
    if (field === 'name' && space.name) return space.name
    
    logger.warn('spaceI18n', `i18n 키 필드 누락: ${field}`, { space })
    return ''
  }

  // 키 존재 여부 확인 (te 함수가 제공된 경우)
  if (te && !te(key)) {
    logger.error('spaceI18n', `번역 키를 찾을 수 없음: ${key}`, { space, field })
    // 개발 환경에서는 경고를 위해 키 자체를 반환하거나 빈 문자열 반환
    return `[MISSING: ${key}]`
  }

  return t(key)
}

/**
 * ID를 i18n 키 세그먼트(camelCase)로 변환합니다. (마이그레이션용)
 * @param {string} id 공간 ID (예: 'hall-1')
 * @returns {string} i18n 키 세그먼트 (예: 'hall1')
 */
export function toI18nKeySegment(id) {
  if (!id) return ''
  return id.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase()).replace(/-/g, '')
}
