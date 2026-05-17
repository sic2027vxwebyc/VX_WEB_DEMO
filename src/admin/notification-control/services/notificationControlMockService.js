import { useNotificationControlStore } from '../stores/notificationControlStore'

/**
 * 관리자용 실시간 공지 및 티커 제어 목 서비스
 * 실제 환경에서는 WebSocket 또는 Push API를 사용하지만 여기서는 Store 상태를 제어합니다.
 */
export const notificationControlMockService = {
  async broadcastEmergencyTicker(tickerData) {
    const store = useNotificationControlStore()
    store.createTicker(tickerData)
    return { success: true, timestamp: new Date().toISOString() }
  },

  async sendSessionNotification(notificationData) {
    const store = useNotificationControlStore()
    store.createSessionChangeNotification(notificationData)
    // 발송 시뮬레이션
    const newId = store.sessionChangeNotifications[0].id
    store.sendSessionChangeNotification(newId)
    return { success: true, timestamp: new Date().toISOString() }
  },

  async fetchActiveTickers() {
    const store = useNotificationControlStore()
    return store.activeTickers
  }
}
