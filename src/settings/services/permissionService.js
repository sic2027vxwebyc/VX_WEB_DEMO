import { logger } from '@/utils/logger'

const scope = 'PermissionService'

export const permissionService = {
  /**
   * 권한 상태 확인
   * @param {string} name 'camera', 'geolocation', 'notifications'
   * @returns {Promise<string>} granted, denied, prompt, unsupported
   */
  async checkStatus(name) {
    // 1. 알림(Push) 권한 특수 처리: Notification API가 더 정확하고 안전함
    if (name === 'push') {
      if (!('Notification' in window)) return 'unsupported'
      // 'default' -> 'prompt', 'granted' -> 'granted', 'denied' -> 'denied'
      const status = Notification.permission
      return status === 'default' ? 'prompt' : status
    }

    if (!navigator.permissions) return 'unsupported'
    
    try {
      const permissionName = name === 'location' ? 'geolocation' : name
      
      // 'push' 대신 'notifications'를 쿼리하거나 위에서 처리한 Notification API 사용 권장
      // 여기서는 location(geolocation) 및 기타 API를 위해 query 실행
      const result = await navigator.permissions.query({ name: permissionName })
      return result.state // granted, denied, prompt
    } catch (e) {
      // 브라우저가 특정 권한 이름의 query를 지원하지 않을 경우 (예: push without userVisibleOnly)
      logger.debug(scope, `${name} 권한 API 쿼리 미지원 또는 오류 (상태 불명 처리)`)
      return 'unknown'
    }
  },

  /**
   * 권한 요청 (Mock 또는 실제 API)
   * @param {string} name 
   */
  async requestPermission(name) {
    logger.info(scope, `${name} 권한 요청 시작`)
    
    if (name === 'location') {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve('granted'),
          () => resolve('denied'),
          { timeout: 5000 }
        )
      })
    }
    
    if (name === 'camera') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(track => track.stop())
        return 'granted'
      } catch (e) {
        return 'denied'
      }
    }
    
    if (name === 'push') {
      if (!('Notification' in window)) return 'unsupported'
      const result = await Notification.requestPermission()
      return result // granted, denied, default
    }
    
    return 'prompt'
  }
}
