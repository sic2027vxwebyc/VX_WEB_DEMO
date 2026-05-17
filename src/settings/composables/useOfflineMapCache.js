import { useDeviceSettingsStore } from '../stores/deviceSettingsStore'
import { offlineCacheService } from '../services/offlineCacheService'
import { logger } from '@/utils/logger'

export function useOfflineMapCache() {
  const store = useDeviceSettingsStore()

  const startDownload = async () => {
    if (store.offlineMap.isDownloading) return
    
    store.startDownload()
    
    try {
      const result = await offlineCacheService.simulateDownload((progress) => {
        store.updateDownloadProgress(progress)
      })
      
      store.completeDownload(result.sizeMb, result.count)
    } catch (e) {
      logger.error('useOfflineMapCache', '다운로드 중 오류 발생', e)
      store.offlineMap.status = 'failed'
      store.offlineMap.isDownloading = false
    }
  }

  const clearCache = async () => {
    await offlineCacheService.clearCache()
    store.clearOfflineCache()
  }

  return {
    offlineMap: store.offlineMap,
    startDownload,
    clearCache
  }
}
