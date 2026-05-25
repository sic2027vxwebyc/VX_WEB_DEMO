import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockHotels, mockHotelReservations } from '../data/mockHotelData'
import { logger } from '@/utils/logger'

export const useHotelManagementStore = defineStore('hotelManagement', () => {
  const STORAGE_KEY = 'vx:v2:admin:hotel-management'

  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

  const hotels = ref(savedState.hotels || JSON.parse(JSON.stringify(mockHotels)))
  const reservations = ref(savedState.reservations || JSON.parse(JSON.stringify(mockHotelReservations)))
  const checkInLogs = ref(savedState.checkInLogs || [])
  
  const selectedReservationId = ref(null)

  const kpiSummary = computed(() => {
    const totalHotels = hotels.value.length
    const totalRooms = hotels.value.reduce((acc, h) => acc + h.totalRooms, 0)
    const reservedRooms = reservations.value.filter(r => r.status === 'reserved').length
    const checkedInCount = reservations.value.filter(r => r.status === 'checkedIn').length
    const checkedOutCount = reservations.value.filter(r => r.status === 'checkedOut').length
    const noShowCount = reservations.value.filter(r => r.status === 'noShow').length
    const availableRooms = totalRooms - checkedInCount

    return {
      totalHotels,
      totalRooms,
      reservedRooms,
      checkedInCount,
      checkedOutCount,
      availableRooms,
      noShowCount
    }
  })

  const selectedReservation = computed(() => reservations.value.find(r => r.id === selectedReservationId.value))

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      hotels: hotels.value,
      reservations: reservations.value,
      checkInLogs: checkInLogs.value.slice(0, 50)
    }))
  }

  const addLog = (message, type = 'checkIn', params = null) => {
    checkInLogs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message,
      type,
      params
    })
    saveToStorage()
  }

  const selectReservation = (id) => {
    selectedReservationId.value = id
  }

  const scanQr = (payload) => {
    let resId = ''
    if (payload.includes('id=')) {
      const match = payload.match(/id=([^&]+)/)
      if (match) resId = match[1]
    } else {
      resId = payload
    }

    const res = reservations.value.find(r => r.id === resId)
    if (res) {
      selectedReservationId.value = res.id
      return { success: true, data: res }
    }
    return { success: false, message: 'admin.hotel.logs.notFound' }
  }

  const completeCheckIn = (resId, operator = 'Mock Admin') => {
    const res = reservations.value.find(r => r.id === resId)
    if (!res || res.status !== 'reserved') return false

    res.status = 'checkedIn'
    res.checkedInAt = new Date().toISOString()
    res.handledBy = operator
    
    const hotel = hotels.value.find(h => h.id === res.hotelId)
    if (hotel) {
      hotel.occupancy.checkedIn++
    }

    logger.info('[HotelAdmin] 체크인 처리 완료', { reservationId: resId })
    addLog('admin.hotel.logs.checkIn', 'checkIn', { name: res.name, hotel: res.hotelName, room: res.roomNumber })
    saveToStorage()
    return true
  }

  const completeCheckOut = (resId, operator = 'Mock Admin') => {
    const res = reservations.value.find(r => r.id === resId)
    if (!res || res.status !== 'checkedIn') return false

    res.status = 'checkedOut'
    res.checkedOutAt = new Date().toISOString()
    res.handledBy = operator
    
    const hotel = hotels.value.find(h => h.id === res.hotelId)
    if (hotel) {
      hotel.occupancy.checkedIn--
      hotel.occupancy.available++
    }

    logger.info('[HotelAdmin] 체크아웃 처리 완료', { reservationId: resId })
    addLog('admin.hotel.logs.checkOut', 'checkOut', { name: res.name, hotel: res.hotelName, room: res.roomNumber })
    saveToStorage()
    return true
  }

  const resetData = () => {
    hotels.value = JSON.parse(JSON.stringify(mockHotels))
    reservations.value = JSON.parse(JSON.stringify(mockHotelReservations))
    checkInLogs.value = []
    selectedReservationId.value = null
    addLog('admin.hotel.logs.reset', 'system')
    saveToStorage()
  }

  return {
    hotels,
    reservations,
    checkInLogs,
    selectedReservationId,
    kpiSummary,
    selectedReservation,
    selectReservation,
    scanQr,
    completeCheckIn,
    completeCheckOut,
    resetData
  }
})
