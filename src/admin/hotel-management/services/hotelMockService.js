/**
 * 호텔 예약 및 체크인 모의 서비스
 */
import { useHotelManagementStore } from '../stores/hotelManagementStore'

export const hotelMockService = {
  async fetchHotels() {
    const store = useHotelManagementStore()
    return store.hotels
  },
  async checkIn(reservationId) {
    const store = useHotelManagementStore()
    return store.completeCheckIn(reservationId)
  }
}
