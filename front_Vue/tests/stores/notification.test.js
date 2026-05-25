import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNotificationStore } from '@/features/dashboard/notification/stores/notification'

describe('NotificationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    
    // Fix: Spy on a wrapper function
    const mockFn = vi.fn()
    class MockEventSource {
      constructor(...args) {
        mockFn(...args)
        this.close = vi.fn()
      }
    }
    global.EventSource = MockEventSource
    global.MockEventSource = mockFn // Store for assertion
  })

  it('connects to SSE', () => {
    const store = useNotificationStore()
    
    store.connect()
    expect(store.isConnected).toBe(true)
    expect(global.MockEventSource).toHaveBeenCalled()
  })

  it('disconnects SSE', () => {
    const store = useNotificationStore()
    store.connect()
    store.disconnect()
    expect(store.isConnected).toBe(false)
    expect(store.eventSource).toBeNull()
  })
})
