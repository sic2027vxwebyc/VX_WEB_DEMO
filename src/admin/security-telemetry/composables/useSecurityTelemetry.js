import { storeToRefs } from 'pinia'
import { useSecurityTelemetryStore } from '../stores/securityTelemetryStore'
import { securityTelemetryMockService } from '../services/securityTelemetryMockService'

export function useSecurityTelemetry() {
  const store = useSecurityTelemetryStore()
  const { 
    securityLogs, 
    devices, 
    operationLogs, 
    selectedSecurityLogId, 
    selectedDeviceId,
    kpiSummary,
    selectedSecurityLog,
    selectedDevice
  } = storeToRefs(store)

  const handleUpdateLogStatus = async (logId, status, memo) => {
    return await securityTelemetryMockService.updateLogStatus(logId, status, memo)
  }

  const handleControlDevice = async (deviceId, payload) => {
    return await securityTelemetryMockService.controlDevice(deviceId, payload)
  }

  return {
    securityLogs,
    devices,
    operationLogs,
    selectedSecurityLogId,
    selectedDeviceId,
    kpiSummary,
    selectedSecurityLog,
    selectedDevice,
    handleUpdateLogStatus,
    handleControlDevice,
    refreshHeartbeat: store.refreshDeviceHeartbeat,
    resetData: store.resetMockSecurityTelemetry
  }
}
