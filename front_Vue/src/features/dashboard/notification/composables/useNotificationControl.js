import { storeToRefs } from 'pinia'
import { useNotificationControlStore } from '../stores/notificationControlStore'
import { notificationControlMockService } from '../services/notificationControlMockService'

export function useNotificationControl() {
  const store = useNotificationControlStore()
  const { 
    tickers, 
    sessionChangeNotifications, 
    eventLogs, 
    isMockBroadcasting, 
    activeTickers,
    kpiSummary
  } = storeToRefs(store)

  const handleBroadcastTicker = async (payload) => {
    return await notificationControlMockService.broadcastEmergencyTicker(payload)
  }

  const handleSendNotification = async (payload) => {
    return await notificationControlMockService.sendSessionNotification(payload)
  }

  return {
    tickers,
    sessionChangeNotifications,
    eventLogs,
    isMockBroadcasting,
    activeTickers,
    kpiSummary,
    handleBroadcastTicker,
    handleSendNotification,
    activateTicker: store.activateTicker,
    deactivateTicker: store.deactivateTicker,
    expireTicker: store.expireTicker,
    resetData: store.resetMockNotificationControl
  }
}
