import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNotificationStore } from '@/stores/notification'

// Mock i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

describe('NotificationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default notifications', () => {
    const store = useNotificationStore()
    expect(store.notificationsData.length).toBeGreaterThan(0)
  })

  it('filters notifications by activeTab', () => {
    const store = useNotificationStore()
    store.activeTab = 'traffic'
    expect(store.filteredNotifications.every(n => n.type === 'traffic')).toBe(true)
  })

  it('filters critical alerts', () => {
    const store = useNotificationStore()
    expect(store.criticalAlerts.length).toBeGreaterThan(0)
    expect(store.criticalAlerts.every(n => n.priority === 'critical')).toBe(true)
  })

  it('marks notification as read', () => {
    const store = useNotificationStore()
    const id = store.notificationsData[0].id
    store.markAsRead(id)
    const noti = store.notificationsData.find(n => n.id === id)
    expect(noti.isRead).toBe(true)
  })
})
