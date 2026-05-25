import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useQuestStore } from '@/stores/quest'

describe('QuestStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('progress calculation check', () => {
    const store = useQuestStore()
    // Mock stampStore behavior
    expect(store.processedQuests.length).toBeGreaterThan(0)
    expect(store.processedQuests[0].progress).toBeDefined()
  })

  it('QR validation success', async () => {
    const store = useQuestStore()
    const token = `valid-token-${Date.now()}`
    const gps = { lat: 37.5, lng: 127.0 }
    const result = await store.scanQr(token, gps)
    expect(result).toBe(true)
  })

  it('QR validation fail', async () => {
    const store = useQuestStore()
    const token = 'expired-token-0' // Old timestamp
    const gps = { lat: 0, lng: 0 }
    const result = await store.scanQr(token, gps)
    expect(result).toBe(false)
  })
})
