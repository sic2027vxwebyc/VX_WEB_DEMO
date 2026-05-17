import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockMealReservations, mockMealInventory } from '../data/mockMealDistributionData'

export const useMealDistributionStore = defineStore('mealDistribution', () => {
  const STORAGE_KEY = 'vx:v2:admin:meal-distribution'

  // 상태 로드 (localStorage)
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

  const reservations = ref(savedState.reservations || JSON.parse(JSON.stringify(mockMealReservations)))
  const inventory = ref(savedState.inventory || JSON.parse(JSON.stringify(mockMealInventory)))
  const pickupLogs = ref(savedState.pickupLogs || [])
  const duplicateLogs = ref(savedState.duplicateLogs || [])
  
  const selectedReservationId = ref(null)
  const scanPayload = ref('')

  // Getters
  const kpiSummary = computed(() => inventory.value)
  const reservedReservations = computed(() => reservations.value.filter(r => r.status === 'reserved'))
  const pickedUpReservations = computed(() => reservations.value.filter(r => r.status === 'pickedUp'))
  const selectedReservation = computed(() => reservations.value.find(r => r.id === selectedReservationId.value))
  
  // 전체 예약자 필터링 등은 필요에 따라 구현 가능
  const filteredReservations = computed(() => reservations.value)

  // Actions
  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      reservations: reservations.value,
      inventory: inventory.value,
      pickupLogs: pickupLogs.value.slice(0, 50),
      duplicateLogs: duplicateLogs.value.slice(0, 50)
    }))
  }

  const addPickupLog = (message, type = 'pickup', params = null) => {
    pickupLogs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message,
      type,
      params
    })
    saveToStorage()
  }

  const addDuplicateLog = (message, params = null) => {
    duplicateLogs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message,
      type: 'duplicate',
      params
    })
    inventory.value.duplicateScanCount++
    saveToStorage()
  }

  const selectReservation = (reservationId) => {
    selectedReservationId.value = reservationId
  }

  const scanMockQr = (payload) => {
    // payload ex: meal://reservation?id=meal-0001&token=abc123
    let resId = ''
    
    // 단순 payload 매칭 (URL 형태 또는 JSON 등)
    if (payload.includes('id=')) {
      const match = payload.match(/id=([^&]+)/)
      if (match) resId = match[1]
    } else {
      resId = payload // ID 직접 입력도 지원
    }

    const reservation = reservations.value.find(r => r.id === resId)
    
    if (reservation) {
      selectedReservationId.value = reservation.id
      if (reservation.status === 'pickedUp') {
        addDuplicateLog('admin.meals.logs.duplicateDetected', { name: reservation.name, id: reservation.id })
      }
      return { success: true, isDuplicate: reservation.status === 'pickedUp', data: reservation }
    } else {
      return { success: false, message: 'admin.meals.logs.notFound' }
    }
  }

  const completePickup = (reservationId, operatorName = 'Mock Admin') => {
    const reservation = reservations.value.find(r => r.id === reservationId)
    if (!reservation) return false
    
    if (reservation.status === 'pickedUp') {
      return false // 이미 처리됨
    }

    // 상태 변경
    reservation.status = 'pickedUp'
    reservation.pickedUpAt = new Date().toISOString()
    reservation.pickedUpBy = operatorName
    
    // 재고 업데이트
    inventory.value.pickedUpCount += reservation.mealCount
    inventory.value.remainingCount -= reservation.mealCount
    
    addPickupLog('admin.meals.logs.pickupCompleted', 'pickup', { name: reservation.name, count: reservation.mealCount })
    saveToStorage()
    
    return true
  }

  const resetMockMealDistribution = () => {
    reservations.value = JSON.parse(JSON.stringify(mockMealReservations))
    inventory.value = JSON.parse(JSON.stringify(mockMealInventory))
    pickupLogs.value = []
    duplicateLogs.value = []
    selectedReservationId.value = null
    scanPayload.value = ''
    addPickupLog('admin.meals.logs.reset', 'system')
    saveToStorage()
  }

  return {
    reservations,
    inventory,
    pickupLogs,
    duplicateLogs,
    selectedReservationId,
    scanPayload,
    kpiSummary,
    reservedReservations,
    pickedUpReservations,
    selectedReservation,
    filteredReservations,
    selectReservation,
    scanMockQr,
    completePickup,
    addPickupLog,
    addDuplicateLog,
    resetMockMealDistribution
  }
})
