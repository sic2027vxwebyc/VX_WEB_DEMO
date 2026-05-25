import { defineStore } from 'pinia'
import { logger } from '@/utils/logger'

const scope = 'DeviceSettingsStore'

export const useDeviceSettingsStore = defineStore('deviceSettings', {
  state: () => ({
    // 1. 오프라인 지도 데이터 상태
    offlineMap: {
      isOfflineMapEnabled: localStorage.getItem('vx:v2:settings:offline-map-enabled') === 'true',
      isDownloading: false,
      progress: 0,
      cachedSizeMb: parseFloat(localStorage.getItem('vx:v2:settings:offline-map-size') || '0'),
      lastDownloadedAt: localStorage.getItem('vx:v2:settings:offline-map-last-download'),
      cachedAssetCount: parseInt(localStorage.getItem('vx:v2:settings:offline-map-count') || '0'),
      status: localStorage.getItem('vx:v2:settings:offline-map-status') || 'notDownloaded'
    },
    // 2. 생체 인식 잠금 상태
    biometric: {
      biometricLockEnabled: localStorage.getItem('vx:v2:settings:biometric-lock-enabled') === 'true',
      webAuthnSupported: typeof window !== 'undefined' && window.PublicKeyCredential !== undefined,
      adminUnlockedUntil: null,
      lastVerifiedAt: null,
      lockScope: 'admin'
    },
    // 3. 기기 권한 상태 (Mock)
    permissions: {
      camera: localStorage.getItem('vx:v2:settings:perm-camera') || 'unknown',
      location: localStorage.getItem('vx:v2:settings:perm-location') || 'unknown',
      push: localStorage.getItem('vx:v2:settings:perm-push') || 'unknown'
    }
  }),

  getters: {
    isAdminLocked: (state) => {
      if (!state.biometric.biometricLockEnabled) return false
      if (!state.biometric.adminUnlockedUntil) return true
      return Date.now() > state.biometric.adminUnlockedUntil
    }
  },

  actions: {
    setOfflineMapEnabled(enabled) {
      this.offlineMap.isOfflineMapEnabled = enabled
      localStorage.setItem('vx:v2:settings:offline-map-enabled', enabled)
      logger.info(scope, `오프라인 지도 활성화 상태 변경: ${enabled}`)
    },
    
    startDownload() {
      if (this.offlineMap.isDownloading) return
      this.offlineMap.isDownloading = true
      this.offlineMap.status = 'downloading'
      this.offlineMap.progress = 0
      logger.info(scope, '오프라인 데이터 다운로드 시작')
    },

    updateDownloadProgress(progress) {
      this.offlineMap.progress = progress
    },

    completeDownload(sizeMb, count) {
      const now = new Date().toISOString()
      this.offlineMap.isDownloading = false
      this.offlineMap.status = 'ready'
      this.offlineMap.progress = 100
      this.offlineMap.cachedSizeMb = sizeMb
      this.offlineMap.cachedAssetCount = count
      this.offlineMap.lastDownloadedAt = now
      
      localStorage.setItem('vx:v2:settings:offline-map-size', sizeMb)
      localStorage.setItem('vx:v2:settings:offline-map-count', count)
      localStorage.setItem('vx:v2:settings:offline-map-last-download', now)
      localStorage.setItem('vx:v2:settings:offline-map-status', 'ready')
      logger.info(scope, '오프라인 데이터 다운로드 완료', { sizeMb, count })
    },

    clearOfflineCache() {
      this.offlineMap.status = 'cleared'
      this.offlineMap.cachedSizeMb = 0
      this.offlineMap.cachedAssetCount = 0
      this.offlineMap.progress = 0
      
      localStorage.removeItem('vx:v2:settings:offline-map-size')
      localStorage.removeItem('vx:v2:settings:offline-map-count')
      localStorage.setItem('vx:v2:settings:offline-map-status', 'cleared')
      logger.warn(scope, '오프라인 캐시가 삭제되었습니다.')
    },

    setBiometricLockEnabled(enabled) {
      this.biometric.biometricLockEnabled = enabled
      localStorage.setItem('vx:v2:settings:biometric-lock-enabled', enabled)
      logger.info(scope, `생체 인식 잠금 설정 변경: ${enabled}`)
    },

    unlockAdmin(durationMinutes = 30) {
      const expiry = Date.now() + durationMinutes * 60 * 1000
      this.biometric.adminUnlockedUntil = expiry
      this.biometric.lastVerifiedAt = new Date().toISOString()
      logger.info(scope, `관리자 페이지 잠금 해제 (만료: ${new Date(expiry).toLocaleTimeString()})`)
    },

    lockAdmin() {
      this.biometric.adminUnlockedUntil = null
      logger.info(scope, '관리자 페이지 수동 잠금')
    },

    updatePermission(type, status) {
      if (this.permissions[type] !== undefined) {
        this.permissions[type] = status
        localStorage.setItem(`vx:v2:settings:perm-${type}`, status)
        logger.info(scope, `권한 상태 업데이트: ${type} -> ${status}`)
      }
    }
  }
})
