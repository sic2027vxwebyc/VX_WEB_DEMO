import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useMealDistributionStore } from '@/features/admin/meal-distribution/stores/mealDistributionStore'

describe('MealDistributionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    const store = useMealDistributionStore()
    store.resetMockMealDistribution()
  })

  it('initializes with default mock data', () => {
    const store = useMealDistributionStore()
    expect(store.reservations.length).toBeGreaterThan(0)
    expect(store.inventory.totalStock).toBeGreaterThan(0)
  })

  it('scans mock QR and selects reservation', () => {
    const store = useMealDistributionStore()
    const resId = store.reservations[0].id
    const result = store.scanMockQr(`meal://reservation?id=${resId}`)
    
    expect(result.success).toBe(true)
    expect(store.selectedReservationId).toBe(resId)
  })

  it('completes pickup and updates inventory', () => {
    const store = useMealDistributionStore()
    const resId = store.reservations[0].id
    const initialRemaining = store.inventory.remainingCount
    
    store.completePickup(resId)
    
    const res = store.reservations.find(r => r.id === resId)
    expect(res.status).toBe('pickedUp')
    expect(store.inventory.remainingCount).toBe(initialRemaining - res.mealCount)
  })
})
