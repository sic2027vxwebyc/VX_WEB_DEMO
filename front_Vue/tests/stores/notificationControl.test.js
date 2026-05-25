import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNotificationControlStore } from '@/features/dashboard/notification/stores/notificationControlStore'

describe('NotificationControlStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    const store = useNotificationControlStore()
    store.resetMockNotificationControl()
  })

  it('initializes with mock data', () => {
    const store = useNotificationControlStore()
    expect(store.tickers.length).toBeGreaterThan(0)
  })

  it('creates and activates ticker', () => {
    const store = useNotificationControlStore()
    store.createTicker({ titleKey: 'test-ticker' })
    const ticker = store.tickers[0]
    expect(ticker.titleKey).toBe('test-ticker')
    expect(ticker.isActive).toBe(true)
  })

  it('deactivates ticker', () => {
    const store = useNotificationControlStore()
    const tickerId = store.tickers[0].id
    store.deactivateTicker(tickerId)
    const ticker = store.tickers.find(t => t.id === tickerId)
    expect(ticker.isActive).toBe(false)
  })

  it('expires ticker', () => {
    const store = useNotificationControlStore()
    const tickerId = store.tickers[0].id
    store.expireTicker(tickerId)
    const ticker = store.tickers.find(t => t.id === tickerId)
    expect(ticker.isActive).toBe(false)
    expect(ticker.expiresAt).toBeDefined()
  })

  it('sends session change notification', () => {
    const store = useNotificationControlStore()
    store.createSessionChangeNotification({ sessionId: 'session-1' })
    const notiId = store.sessionChangeNotifications[0].id
    
    store.sendSessionChangeNotification(notiId)
    const noti = store.sessionChangeNotifications.find(n => n.id === notiId)
    expect(noti.status).toBe('sent')
  })

  it('handles invalid actions', () => {
    const store = useNotificationControlStore()
    store.activateTicker('invalid-id')
    expect(store.eventLogs.some(log => log.type === 'error')).toBe(false)
  })

  it('persists data to localStorage', () => {
    const store = useNotificationControlStore()
    store.createTicker({ titleKey: 'persist-test' })
    const saved = JSON.parse(localStorage.getItem('vx:v2:admin:notification-control'))
    expect(saved.tickers.some(t => t.titleKey === 'persist-test')).toBe(true)
  })
})
