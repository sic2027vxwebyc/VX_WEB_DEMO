import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
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

  it('redirects to admin-unlock when accessing admin route while locked', async () => {
    const mockStore = { isAdminLocked: true }
    useDeviceSettingsStore.mockReturnValue(mockStore)

    await router.push({ name: 'adminOperations' })
    
    expect(router.currentRoute.value.name).toBe('admin-unlock')
    expect(router.currentRoute.value.query.redirect).toBe('/admin/operations')
  })

  it('allows access to admin route when unlocked', async () => {
    const mockStore = { isAdminLocked: false }
    useDeviceSettingsStore.mockReturnValue(mockStore)

    await router.push({ name: 'adminOperations' })
    
    expect(router.currentRoute.value.name).toBe('adminOperations')
  })

  it('allows access to public route', async () => {
    const mockStore = { isAdminLocked: true }
    useDeviceSettingsStore.mockReturnValue(mockStore)

    await router.push({ name: 'home' })
    
    expect(router.currentRoute.value.name).toBe('home')
  })
})
