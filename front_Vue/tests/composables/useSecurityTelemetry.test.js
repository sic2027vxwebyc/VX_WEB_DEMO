import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSecurityTelemetry } from '@/features/admin/security-telemetry/composables/useSecurityTelemetry'
import { useSecurityTelemetryStore } from '@/features/admin/security-telemetry/stores/securityTelemetryStore'

describe('useSecurityTelemetry', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    const store = useSecurityTelemetryStore()
    store.resetMockSecurityTelemetry()
  })

  it('exposes store state', () => {
    const composable = useSecurityTelemetry()
    expect(composable.devices.value).toBeDefined()
    expect(composable.securityLogs.value.length).toBeGreaterThan(0)
  })

  it('updates security log status via action', () => {
    const composable = useSecurityTelemetry()
    const logId = composable.securityLogs.value[0].id
    composable.handleUpdateLogStatus(logId, 'resolved', 'Fixed')
    
    expect(composable.securityLogs.value[0].status).toBe('resolved')
    expect(composable.securityLogs.value[0].memo).toBe('Fixed')
  })
})
