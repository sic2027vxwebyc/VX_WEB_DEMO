import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { mealDistributionMockService } from '@/features/admin/meal-distribution/services/mealDistributionMockService'
import { useMealDistributionStore } from '@/features/admin/meal-distribution/stores/mealDistributionStore'

describe('mealDistributionMockService', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useMealDistributionStore()
    store.resetMockMealDistribution()
  })

  it('fetches reservations', async () => {
    const reservations = await mealDistributionMockService.fetchReservations()
    expect(reservations.length).toBeGreaterThan(0)
  })

  it('fetches inventory', async () => {
    const inventory = await mealDistributionMockService.fetchInventory()
    expect(inventory.totalStock).toBeDefined()
  })
})
