/**
 * 도시락 예약 및 배부 모의 서비스
 * 향후 실제 API 연동 시 이 부분을 확장합니다.
 */
import { useMealDistributionStore } from '../stores/mealDistributionStore'

export const mealDistributionMockService = {
  async fetchReservations() {
    const store = useMealDistributionStore()
    return store.reservations
  },
  
  async fetchInventory() {
    const store = useMealDistributionStore()
    return store.inventory
  }
}
