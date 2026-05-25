import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useOperationalIntelligenceStore } from '@/features/admin/operational-intelligence/stores/operationalIntelligenceStore'

describe('OperationalIntelligenceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    const store = useOperationalIntelligenceStore()
    store.resetMockOperations()
  })

  it('initializes with mock spaces', () => {
    const store = useOperationalIntelligenceStore()
    expect(store.effectiveZones.length).toBeGreaterThan(0)
  })

  it('updates congestion level', () => {
    const store = useOperationalIntelligenceStore()
    const spaceId = store.effectiveZones[0].id
    store.updateCongestion(spaceId, 'critical')
    
    const space = store.effectiveZones.find(s => s.id === spaceId)
    expect(space.congestionLevel).toBe('critical')
    expect(store.crowdedZones.length).toBeGreaterThan(0)
  })

  it('updates access status', () => {
    const store = useOperationalIntelligenceStore()
    const spaceId = store.effectiveZones[0].id
    store.updateAccessStatus(spaceId, 'restricted', 'Emergency')
    
    const space = store.effectiveZones.find(s => s.id === spaceId)
    expect(space.accessStatus).toBe('restricted')
    expect(store.restrictedZones.length).toBeGreaterThan(0)
  })

  it('resets mock operations', () => {
    const store = useOperationalIntelligenceStore()
    const spaceId = store.effectiveZones[0].id
    store.updateCongestion(spaceId, 'critical')
    store.resetMockOperations()
    
    const space = store.effectiveZones.find(s => s.id === spaceId)
    expect(space.congestionLevel).not.toBe('critical')
    expect(store.crowdedZones.length).toBe(3)
  })
})
