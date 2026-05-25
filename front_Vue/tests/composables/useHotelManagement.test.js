import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useHotelManagement } from '@/features/admin/hotel-management/composables/useHotelManagement'
import { useHotelManagementStore } from '@/features/admin/hotel-management/stores/hotelManagementStore'

describe('useHotelManagement', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    const store = useHotelManagementStore()
    store.resetData()
  })

  it('exposes store state', () => {
    const composable = useHotelManagement()
    expect(composable.hotels.value).toBeDefined()
    expect(composable.reservations.value.length).toBeGreaterThan(0)
  })

  it('handles check-in process', () => {
    const composable = useHotelManagement()
    const resId = composable.reservations.value[0].id
    const success = composable.completeCheckIn(resId)
    
    expect(success).toBe(true)
    expect(composable.reservations.value[0].status).toBe('checkedIn')
  })

  it('handles check-out process', () => {
    const composable = useHotelManagement()
    const resId = composable.reservations.value[0].id
    
    composable.completeCheckIn(resId)
    const success = composable.completeCheckOut(resId)
    
    expect(success).toBe(true)
    expect(composable.reservations.value[0].status).toBe('checkedOut')
  })
})
