import { logger } from '@/utils/logger'

const scope = 'BiometricMockService'

export const biometricMockService = {
  /**
   * 생체 인증 시뮬레이션
   * @returns {Promise<boolean>}
   */
  async verify() {
    logger.info(scope, '생체 인증 요청 (Mock)')
    
    return new Promise((resolve) => {
      // 실제 WebAuthn을 사용하는 척 대기
      setTimeout(() => {
        // 90% 확률로 성공
        const success = Math.random() > 0.1
        if (success) {
          logger.info(scope, '생체 인증 성공')
        } else {
          logger.warn(scope, '생체 인증 실패 또는 취소')
        }
        resolve(success)
      }, 1500)
    })
  },

  isSupported() {
    return typeof window !== 'undefined' && (
      window.PublicKeyCredential !== undefined || 
      /FaceID|TouchID|Fingerprint/i.test(navigator.userAgent)
    )
  }
}
