import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useMealDistribution } from '@/features/admin/meal-distribution/composables/useMealDistribution'
import { useMealDistributionStore } from '@/features/admin/meal-distribution/stores/mealDistributionStore'

describe('useMealDistribution', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useMealDistributionStore()
    store.resetMockMealDistribution()
  })

  it('exposes store state', () => {
    const composable = useMealDistribution()
    expect(composable.inventory.value).toBeDefined()
    expect(composable.reservations.value.length).toBeGreaterThan(0)
  })

  it('completes pickup via action', () => {
    const composable = useMealDistribution()
    const resId = composable.reservations.value[0].id
    const success = composable.completePickup(resId)
    
    expect(success).toBe(true)
    expect(composable.reservations.value[0].status).toBe('pickedUp')
  })
})
