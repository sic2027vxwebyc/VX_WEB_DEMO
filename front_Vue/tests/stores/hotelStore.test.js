import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useHotelManagementStore } from '@/features/admin/hotel-management/stores/hotelManagementStore'

describe('hotelManagementStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    const store = useHotelManagementStore()
    store.resetData()
  })

  it('initializes with mock data', () => {
    const store = useHotelManagementStore()
    expect(store.hotels.length).toBeGreaterThan(0)
    expect(store.reservations.length).toBeGreaterThan(0)
  })

  it('scans QR code', () => {
    const store = useHotelManagementStore()
    const resId = store.reservations[0].id
    const result = store.scanQr(`hotel://reservation?id=${resId}`)
    
    expect(result.success).toBe(true)
    expect(store.selectedReservationId).toBe(resId)
  })

  it('completes check-in', () => {
    const store = useHotelManagementStore()
    const resId = store.reservations[0].id
    
    const success = store.completeCheckIn(resId)
    
    expect(success).toBe(true)
    expect(store.reservations[0].status).toBe('checkedIn')
  })

  it('completes check-out', () => {
    const store = useHotelManagementStore()
    const resId = store.reservations[0].id
    
    store.completeCheckIn(resId)
    const success = store.completeCheckOut(resId)
    
    expect(success).toBe(true)
    expect(store.reservations[0].status).toBe('checkedOut')
  })
})
