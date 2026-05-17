import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockSpaces, mockRecommendedActions } from '@/admin/operational-intelligence/data/mockOperationalData.js'

export const useOperationalIntelligenceStore = defineStore('operationalIntelligence', () => {
  const STORAGE_KEY = 'vx:v2:admin:operational-intelligence'

  // 상태 로드 (localStorage)
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

  const spaces = ref(savedState.spaces || JSON.parse(JSON.stringify(mockSpaces)))
  const eventLogs = ref(savedState.eventLogs || [])
  const lastUpdatedAt = ref(new Date())
  const mockInterval = ref(null)

  // Getters
  const effectiveZones = computed(() => spaces.value)
  const crowdedZones = computed(() => spaces.value.filter(s => s.congestionLevel === 'high' || s.congestionLevel === 'critical'))
  const restrictedZones = computed(() => spaces.value.filter(s => s.accessStatus === 'restricted' || s.accessStatus === 'closed'))

  const kpiSummary = computed(() => ({
    totalZones: spaces.value.length,
    crowdedCount: crowdedZones.value.length,
    restrictedCount: restrictedZones.value.length
  }))

  const recommendedActions = computed(() => {
    const actions = []
    if (crowdedZones.value.length > 0) {
      actions.push({
        id: 'action-1',
        type: 'diversion',
        message: 'admin.operations.logs.crowdedAction', // 이건 나중에 키 추가 필요
        target: crowdedZones.value[0].id
      })
    }
    return actions
  })

  // Actions
  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      spaces: spaces.value,
      eventLogs: eventLogs.value.slice(0, 50)
    }))
  }

  const addEventLog = (message, type = 'info', params = null) => {
    eventLogs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message,
      type,
      params
    })
    saveToStorage()
  }

  const updateCongestion = (spaceId, level) => {
    const space = spaces.value.find(s => s.id === spaceId)
    if (!space) return
    space.congestionLevel = level
    space.isManual = true
    addEventLog('admin.operations.logs.congestionChanged', 'config', { id: spaceId, level })
    lastUpdatedAt.value = new Date()
    saveToStorage()
  }

  const resetCongestion = (spaceId) => {
    const space = spaces.value.find(s => s.id === spaceId)
    if (!space) return
    space.isManual = false
    addEventLog('admin.operations.logs.congestionReset', 'info', { id: spaceId })
    lastUpdatedAt.value = new Date()
    saveToStorage()
  }

  const updateAccessStatus = (spaceId, status, reason = '') => {
    const space = spaces.value.find(s => s.id === spaceId)
    if (!space) return
    space.accessStatus = status
    space.restrictionReason = reason
    addEventLog('admin.operations.logs.accessChanged', 'warning', { id: spaceId, status })
    lastUpdatedAt.value = new Date()
    saveToStorage()
  }

  const resetAccessStatus = (spaceId) => {
    const space = spaces.value.find(s => s.id === spaceId)
    if (!space) return
    space.accessStatus = 'open'
    space.restrictionReason = ''
    addEventLog('admin.operations.logs.accessReset', 'info', { id: spaceId })
    lastUpdatedAt.value = new Date()
    saveToStorage()
  }

  const resetMockOperations = () => {
    spaces.value = JSON.parse(JSON.stringify(mockSpaces))
    eventLogs.value = []
    addEventLog('admin.operations.logs.reset', 'system')
    lastUpdatedAt.value = new Date()
    saveToStorage()
  }

  // 시뮬레이션용 티커
  const startMockTicker = () => {
    if (mockInterval.value) return
    mockInterval.value = setInterval(() => {
      // 랜덤 변동 시뮬레이션 로직 (생략하거나 간단히 구현)
      lastUpdatedAt.value = new Date()
    }, 30000)
  }

  const stopMockTicker = () => {
    if (mockInterval.value) {
      clearInterval(mockInterval.value)
      mockInterval.value = null
    }
  }

  return {
    spaces,
    effectiveZones,
    eventLogs,
    lastUpdatedAt,
    crowdedZones,
    restrictedZones,
    kpiSummary,
    recommendedActions,
    updateCongestion,
    resetCongestion,
    updateAccessStatus,
    resetAccessStatus,
    resetMockOperations,
    startMockTicker,
    stopMockTicker
  }
})