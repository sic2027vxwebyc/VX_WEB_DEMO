import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { hotelMockService } from '@/features/admin/hotel-management/services/hotelMockService'
import { useHotelManagementStore } from '@/features/admin/hotel-management/stores/hotelManagementStore'

describe('hotelMockService', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useHotelManagementStore()
    store.resetData()
  })

  it('fetches hotels', async () => {
    const hotels = await hotelMockService.fetchHotels()
    expect(hotels.length).toBeGreaterThan(0)
  })

  it('performs check-in', async () => {
    const store = useHotelManagementStore()
    const resId = store.reservations[0].id
    const success = await hotelMockService.checkIn(resId)
    
    expect(success).toBe(true)
    expect(store.reservations[0].status).toBe('checkedIn')
  })
})
