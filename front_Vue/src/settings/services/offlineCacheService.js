import { logger } from '@/utils/logger'

const scope = 'OfflineCacheService'

export const offlineCacheService = {
  /**
   * 오프라인 지도 데이터 다운로드 시뮬레이션
   * @param {Function} onProgress 진행률 콜백
   * @returns {Promise<{sizeMb: number, count: number}>}
   */
  async simulateDownload(onProgress) {
    logger.info(scope, '오프라인 캐시 시뮬레이션 시작')
    
    const steps = 20
    const totalAssets = 145
    const totalSize = 24.5 // MB
    
    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
      const progress = Math.round((i / steps) * 100)
      onProgress(progress)
      logger.debug(scope, `다운로드 진행 중: ${progress}%`)
    }
    
    // 실제 Cache Storage 사용 가능 시 로직 (Mock 단계에서는 생략하거나 간단히 구현)
    if ('caches' in window) {
      try {
        const cache = await caches.open('vx-v2-offline-map')
        // 실제로는 여기서 fetch 후 put 하지만, 지금은 mock이므로 성공한 척 함
        logger.info(scope, 'Cache Storage 준비 완료 (Mock)')
      } catch (e) {
        logger.warn(scope, 'Cache Storage 접근 실패', e)
      }
    }
    
    return {
      sizeMb: totalSize,
      count: totalAssets
    }
  },

  async clearCache() {
    if ('caches' in window) {
      const keys = await caches.keys()
      await Promise.all(
        keys.filter(key => key.includes('offline-map')).map(key => caches.delete(key))
      )
    }
    logger.info(scope, '오프라인 캐시 데이터가 모두 삭제되었습니다.')
  }
}
