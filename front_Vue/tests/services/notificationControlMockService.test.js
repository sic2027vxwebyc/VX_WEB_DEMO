import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { notificationControlMockService } from '@/features/dashboard/notification/services/notificationControlMockService'
import { useNotificationControlStore } from '@/features/dashboard/notification/stores/notificationControlStore'

describe('notificationControlMockService', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    const store = useNotificationControlStore()
    store.resetMockNotificationControl()
  })

  it('broadcasts emergency ticker', async () => {
    const tickerData = { titleKey: 'test-ticker' }
    const result = await notificationControlMockService.broadcastEmergencyTicker(tickerData)
    
    expect(result.success).toBe(true)
    const store = useNotificationControlStore()
    expect(store.tickers[0].titleKey).toBe('test-ticker')
  })

  it('sends session notification', async () => {
    const notiData = { sessionId: 'test-session' }
    const result = await notificationControlMockService.sendSessionNotification(notiData)
    
    expect(result.success).toBe(true)
    const store = useNotificationControlStore()
    expect(store.sessionChangeNotifications[0].status).toBe('sent')
  })
})
