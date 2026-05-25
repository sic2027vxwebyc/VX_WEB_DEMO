/**
 * [ 로그 작성 원칙 ]
 * * 모든 로그 메시지는 한국어로 작성한다.
 * * scope는 컴포넌트명 또는 기능명을 사용한다.
 * * error 로그에는 반드시 원본 error 객체를 포함한다.
 */

const isDev = import.meta.env.MODE === 'development'

export const logger = {
  /**
   * 일반 정보 로그
   * @param {string} scope - 컴포넌트 또는 기능명
   * @param {string} message - 한국어 메시지
   * @param {any} data - 추가 데이터
   */
  info(scope, message, data = null) {
    if (isDev) {
      console.info(`[INFO][${scope}] ${message}`, data ?? '')
    }
  },

  /**
   * 경고 로그
   * @param {string} scope - 컴포넌트 또는 기능명
   * @param {string} message - 한국어 메시지
   * @param {any} data - 추가 데이터
   */
  warn(scope, message, data = null) {
    console.warn(`[WARN][${scope}] ${message}`, data ?? '')
  },

  /**
   * 에러 로그
   * @param {string} scope - 컴포넌트 또는 기능명
   * @param {string} message - 한국어 메시지
   * @param {Error|any} error - 원본 에러 객체
   */
  error(scope, message, error = null) {
    console.error(`[ERROR][${scope}] ${message}`, error ?? '')
  },

  /**
   * 디버그 로그
   * @param {string} scope - 컴포넌트 또는 기능명
   * @param {string} message - 한국어 메시지
   * @param {any} data - 추가 데이터
   */
  debug(scope, message, data = null) {
    if (isDev) {
      console.debug(`[DEBUG][${scope}] ${message}`, data ?? '')
    }
  }
}
