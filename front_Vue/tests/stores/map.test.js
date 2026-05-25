import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useMapStore } from '@/stores/map'

// Mock dependencies
vi.mock('@/stores/operational', () => ({
  useOperationalStore: vi.fn(() => ({
    congestionData: {}
  }))
}))

vi.mock('@/features/admin/operational-intelligence/stores/operationalIntelligenceStore', () => ({
  useOperationalIntelligenceStore: vi.fn(() => ({
    effectiveZones: []
  }))
}))

describe('MapStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default values', () => {
    const store = useMapStore()
    expect(store.currentFloor).toBe('hall1')
    expect(store.mapScale).toBe(1)
  })

  it('changes floor', () => {
    const store = useMapStore()
    store.setFloor('hall2')
    expect(store.currentFloor).toBe('hall2')
  })
})
