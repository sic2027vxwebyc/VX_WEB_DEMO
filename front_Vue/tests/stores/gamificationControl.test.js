import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useGamificationControlStore } from '@/features/admin/gamification-control/stores/gamificationControlStore'

describe('GamificationControlStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with default mock data', () => {
    const store = useGamificationControlStore()
    expect(store.rewardStocks.length).toBeGreaterThan(0)
    expect(store.eventLogs.length).toBe(0)
  })

  it('adjusts reward stock', () => {
    const store = useGamificationControlStore()
    const initialStock = store.rewardStocks[0].remainingStock
    store.adjustRewardStock(store.rewardStocks[0].id, -1)
    expect(store.rewardStocks[0].remainingStock).toBe(initialStock - 1)
    expect(store.eventLogs.length).toBe(1)
  })
})
