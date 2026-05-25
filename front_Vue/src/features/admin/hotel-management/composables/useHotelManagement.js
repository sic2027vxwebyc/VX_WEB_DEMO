import { storeToRefs } from 'pinia'
import { useHotelManagementStore } from '../stores/hotelManagementStore'

export function useHotelManagement() {
  const store = useHotelManagementStore()
  const { 
    hotels, 
    reservations, 
    checkInLogs, 
    kpiSummary, 
    selectedReservation 
  } = storeToRefs(store)

  return {
    hotels,
    reservations,
    checkInLogs,
    kpiSummary,
    selectedReservation,
    scanQr: store.scanQr,
    completeCheckIn: store.completeCheckIn,
    completeCheckOut: store.completeCheckOut,
    selectReservation: store.selectReservation,
    resetData: store.resetData
  }
}
