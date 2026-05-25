import { storeToRefs } from 'pinia'
import { useMealDistributionStore } from '../stores/mealDistributionStore'

export function useMealDistribution() {
  const store = useMealDistributionStore()
  const { 
    reservations, 
    inventory, 
    pickupLogs, 
    duplicateLogs, 
    selectedReservationId,
    scanPayload,
    kpiSummary,
    selectedReservation,
    filteredReservations
  } = storeToRefs(store)

  return {
    reservations,
    inventory,
    pickupLogs,
    duplicateLogs,
    selectedReservationId,
    scanPayload,
    kpiSummary,
    selectedReservation,
    filteredReservations,
    selectReservation: store.selectReservation,
    scanMockQr: store.scanMockQr,
    completePickup: store.completePickup,
    resetData: store.resetMockMealDistribution
  }
}
