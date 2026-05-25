import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { securityTelemetryMockService } from '@/features/admin/security-telemetry/services/securityTelemetryMockService'
import { useSecurityTelemetryStore } from '@/features/admin/security-telemetry/stores/securityTelemetryStore'

describe('securityTelemetryMockService', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useSecurityTelemetryStore()
    store.resetMockSecurityTelemetry()
  })

  it('fetches logs', async () => {
    const logs = await securityTelemetryMockService.fetchLogs()
    expect(logs.length).toBeGreaterThan(0)
  })

  it('updates log status', async () => {
    const store = useSecurityTelemetryStore()
    const logId = store.securityLogs[0].id
    const result = await securityTelemetryMockService.updateLogStatus(logId, 'resolved', 'Fix')
    
    expect(result.success).toBe(true)
    expect(store.securityLogs[0].status).toBe('resolved')
  })
})
