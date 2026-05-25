import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import router from '@/router'
import { useDeviceSettingsStore } from '@/settings/stores/deviceSettingsStore'

vi.mock('@/settings/stores/deviceSettingsStore', () => ({
  useDeviceSettingsStore: vi.fn()
}))

describe('Router Guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('redirects to unlock if admin route and locked', async () => {
    useDeviceSettingsStore.mockReturnValue({ isAdminLocked: true })
    
    await router.push({ name: 'adminOperations' })
    expect(router.currentRoute.value.name).toBe('admin-unlock')
  })

  it('allows access to admin route if unlocked', async () => {
    useDeviceSettingsStore.mockReturnValue({ isAdminLocked: false })
    
    await router.push({ name: 'adminOperations' })
    expect(router.currentRoute.value.name).toBe('adminOperations')
  })

  it('allows access to non-admin route', async () => {
    useDeviceSettingsStore.mockReturnValue({ isAdminLocked: true })
    
    await router.push({ name: 'home' })
    expect(router.currentRoute.value.name).toBe('home')
  })
})
