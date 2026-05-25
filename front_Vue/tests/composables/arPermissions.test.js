import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useArPermissions } from '@/composables/useArPermissions'

// Mock environment
vi.stubGlobal('navigator', {
  xr: {
    isSessionSupported: vi.fn().mockResolvedValue(true)
  },
  mediaDevices: {
    getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop: vi.fn() }] })
  },
  geolocation: {
    getCurrentPosition: vi.fn().mockImplementation((success) => success({}))
  }
})

describe('ArPermissions', () => {
  it('checks WebXR support', async () => {
    const { checkWebXrSupport, isWebXrSupported } = useArPermissions()
    const supported = await checkWebXrSupport()
    expect(supported).toBe(true)
    expect(isWebXrSupported.value).toBe(true)
  })

  it('requests camera permission', async () => {
    const { requestCameraPermission, cameraPermission } = useArPermissions()
    const granted = await requestCameraPermission()
    expect(granted).toBe(true)
    expect(cameraPermission.value).toBe('granted')
  })
})
