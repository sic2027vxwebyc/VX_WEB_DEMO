import { useDeviceSettingsStore } from '../stores/deviceSettingsStore'
import { biometricMockService } from '../services/biometricMockService'
import { logger } from '@/utils/logger'

export function useBiometricLock() {
  const store = useDeviceSettingsStore()

  const toggleLock = (enabled) => {
    store.setBiometricLockEnabled(enabled)
  }

  const verifyAndUnlock = async () => {
    const success = await biometricMockService.verify()
    if (success) {
      store.unlockAdmin(30) // 30분간 해제
      return true
    }
    return false
  }

  const lockManually = () => {
    store.lockAdmin()
  }

  return {
    biometric: store.biometric,
    isAdminLocked: store.isAdminLocked,
    toggleLock,
    verifyAndUnlock,
    lockManually
  }
}
