import { useSecurityTelemetryStore } from '../stores/securityTelemetryStore'

/**
 * 보안 및 텔레메트리 억지 서비스
 * 향후 실제 단말기 에이전트 연동 시 WebSocket으로 교체 가능
 */
export const securityTelemetryMockService = {
  async fetchLogs() {
    const store = useSecurityTelemetryStore()
    return store.securityLogs
  },

  async fetchDevices() {
    const store = useSecurityTelemetryStore()
    return store.devices
  },

  async updateLogStatus(logId, status, memo) {
    const store = useSecurityTelemetryStore()
    store.updateSecurityLogStatus(logId, status, memo)
    return { success: true }
  },

  async controlDevice(deviceId, payload) {
    const store = useSecurityTelemetryStore()
    store.updateDeviceStatus(deviceId, payload)
    return { success: true }
  }
}
