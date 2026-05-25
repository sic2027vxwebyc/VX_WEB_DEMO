/**
 * [ i18n Resolver Utility ]
 * 전역적으로 일관된 번역 해소 로직을 제공합니다.
 * Missing key 탐지 및 localized object 처리를 담당합니다.
 */
import { logger } from './logger'

const scope = 'I18nResolver'

/**
 * i18n 키를 안전하게 해소합니다.
 * @param {Object} params
 * @param {string} params.key - i18n 키 (예: 'common.confirm')
 * @param {Function} params.t - i18n 번역 함수
 * @param {Function} params.te - i18n 키 존재 확인 함수
 * @param {string} [params.context='unknown'] - 로깅을 위한 컨텍스트
 * @returns {string} 해소된 번역 문자열 또는 빈 문자열
 */
export function resolveI18nText({ key, t, te, context = 'unknown' }) {
  if (!key) {
    logger.warn(scope, `Missing i18n key {context: '${context}'}`)
    return ''
  }
  
  if (!te(key)) {
    // 개발 환경 및 프로덕션 모두에서 누락된 메시지는 중요하므로 경고를 남깁니다.
    logger.warn(scope, `Missing locale message {key: '${key}', context: '${context}'}`)
    return ''
  }
  
  return t(key)
}

/**
 * 다국어 대응 객체에서 현재 로케일에 맞는 값을 추출합니다.
 * @param {Object|string} value - 다국어 객체 { ko: '...', en: '...' } 또는 단순 문자열
 * @param {string} locale - 현재 로케일
 * @param {string} [fallbackLocale='ko'] - 폴백 로케일
 * @returns {string}
 */
export function resolveLocalizedObject(value, locale, fallbackLocale = 'ko') {
  if (!value) return ''
  
  // 단순 문자열인 경우 그대로 반환 (하드코딩 방지를 위해 사용 지양)
  if (typeof value === 'string') return value
  
  // 현재 로케일 값 반환
  if (value[locale]) return value[locale]
  
  // 폴백 로케일 값 반환
  if (value[fallbackLocale]) {
    logger.debug(scope, 'Using fallback locale for object', { locale, fallbackLocale, value })
    return value[fallbackLocale]
  }
  
  logger.warn(scope, 'Missing localized object value', { locale, fallbackLocale, value })
  return ''
}
