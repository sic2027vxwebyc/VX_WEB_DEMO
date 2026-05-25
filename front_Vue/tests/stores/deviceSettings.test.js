import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useDeviceSettingsStore } from '@/settings/stores/deviceSettingsStore'

describe('DeviceSettingsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with default values', () => {
    const store = useDeviceSettingsStore()
    expect(store.offlineMap.isOfflineMapEnabled).toBe(false)
    expect(store.biometric.biometricLockEnabled).toBe(false)
  })

  it('toggles offline map', () => {
    const store = useDeviceSettingsStore()
    store.setOfflineMapEnabled(true)
    expect(store.offlineMap.isOfflineMapEnabled).toBe(true)
    expect(localStorage.getItem('vx:v2:settings:offline-map-enabled')).toBe('true')
  })

  it('completes download and updates state', () => {
    const store = useDeviceSettingsStore()
    store.startDownload()
    store.completeDownload(100, 50)
    
    expect(store.offlineMap.status).toBe('ready')
    expect(store.offlineMap.cachedSizeMb).toBe(100)
    expect(store.offlineMap.progress).toBe(100)
  })

  it('manages admin lock', () => {
    const store = useDeviceSettingsStore()
    store.setBiometricLockEnabled(true)
    
    expect(store.isAdminLocked).toBe(true)
    
    store.unlockAdmin(1)
    expect(store.isAdminLocked).toBe(false)
    
    store.lockAdmin()
    expect(store.isAdminLocked).toBe(true)
  })
})
