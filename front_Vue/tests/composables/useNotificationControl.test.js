import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNotificationControl } from '@/features/dashboard/notification/composables/useNotificationControl'
import { useNotificationControlStore } from '@/features/dashboard/notification/stores/notificationControlStore'

describe('useNotificationControl', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    const store = useNotificationControlStore()
    store.resetMockNotificationControl()
  })

  it('exposes store state and actions', () => {
    const composable = useNotificationControl()
    expect(composable.tickers.value).toBeDefined()
    expect(typeof composable.activateTicker).toBe('function')
  })

  it('handles ticker broadcast', async () => {
    const composable = useNotificationControl()
    const result = await composable.handleBroadcastTicker({ titleKey: 'emergency-test' })
    expect(result.success).toBe(true)
    expect(composable.tickers.value[0].titleKey).toBe('emergency-test')
  })

  it('handles notification send', async () => {
    const composable = useNotificationControl()
    const result = await composable.handleSendNotification({ sessionId: 'session-1' })
    expect(result.success).toBe(true)
    expect(composable.sessionChangeNotifications.value[0].status).toBe('sent')
  })
})
