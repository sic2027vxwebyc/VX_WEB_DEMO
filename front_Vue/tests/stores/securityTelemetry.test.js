import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useSecurityTelemetryStore } from '@/features/admin/security-telemetry/stores/securityTelemetryStore'

describe('SecurityTelemetryStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    const store = useSecurityTelemetryStore()
    store.resetMockSecurityTelemetry()
  })

  it('initializes with mock data', () => {
    const store = useSecurityTelemetryStore()
    expect(store.securityLogs.length).toBeGreaterThan(0)
    expect(store.devices.length).toBeGreaterThan(0)
  })

  it('updates log status and adds operation log', () => {
    const store = useSecurityTelemetryStore()
    const logId = store.securityLogs[0].id
    store.updateSecurityLogStatus(logId, 'resolved', 'Test memo')
    
    expect(store.securityLogs[0].status).toBe('resolved')
    expect(store.operationLogs.length).toBeGreaterThan(0)
  })

  it('updates device status', () => {
    const store = useSecurityTelemetryStore()
    const deviceId = store.devices[0].id
    store.updateDeviceStatus(deviceId, { status: 'offline' })
    
    expect(store.devices[0].status).toBe('offline')
  })

  it('calculates KPI summary', () => {
    const store = useSecurityTelemetryStore()
    const summary = store.kpiSummary
    expect(summary.totalDevices).toBeGreaterThan(0)
  })

  it('handles non-existent log status update gracefully', () => {
    const store = useSecurityTelemetryStore()
    const initialLogs = [...store.securityLogs]
    store.updateSecurityLogStatus('non-existent-id', 'resolved', 'Test')
    expect(store.securityLogs).toEqual(initialLogs)
  })

  it('handles non-existent device status update gracefully', () => {
    const store = useSecurityTelemetryStore()
    const initialDevices = [...store.devices]
    store.updateDeviceStatus('non-existent-id', { status: 'offline' })
    expect(store.devices).toEqual(initialDevices)
  })
})
