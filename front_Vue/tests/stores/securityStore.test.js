import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useSecurityTelemetryStore } from '@/features/admin/security-telemetry/stores/securityTelemetryStore'

describe('SecurityTelemetryStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('updates security log status', () => {
    const store = useSecurityTelemetryStore()
    const log = store.securityLogs[0]
    store.updateSecurityLogStatus(log.id, 'resolved', 'test memo')
    
    const updatedLog = store.securityLogs.find(l => l.id === log.id)
    expect(updatedLog.status).toBe('resolved')
    expect(updatedLog.memo).toBe('test memo')
  })
})
