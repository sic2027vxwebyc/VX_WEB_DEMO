import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockTickers, mockSessionChanges } from '../data/mockNotificationControlData'

export const useNotificationControlStore = defineStore('notificationControl', () => {
  const STORAGE_KEY = 'vx:v2:admin:notification-control'

  // 상태 로드 (localStorage)
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

  const tickers = ref(savedState.tickers || JSON.parse(JSON.stringify(mockTickers)))
  const sessionChangeNotifications = ref(savedState.sessionChangeNotifications || JSON.parse(JSON.stringify(mockSessionChanges)))
  const eventLogs = ref(savedState.eventLogs || [])
  const isMockBroadcasting = ref(false)
  const lastBroadcastAt = ref(new Date())

  // Getters
  const activeTickers = computed(() => tickers.value.filter(t => t.isActive))
  const expiredTickers = computed(() => {
    const now = new Date().toISOString()
    return tickers.value.filter(t => !t.isActive || (t.expiresAt && t.expiresAt < now))
  })
  const scheduledTickers = computed(() => {
    const now = new Date().toISOString()
    return tickers.value.filter(t => t.isActive && t.startsAt && t.startsAt > now)
  })
  const sentNotifications = computed(() => sessionChangeNotifications.value.filter(n => n.status === 'sent'))

  const kpiSummary = computed(() => ({
    activeTickersCount: activeTickers.value.length,
    sentNotificationsCount: sentNotifications.value.length,
    totalLogs: eventLogs.value.length
  }))

  // Actions
  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tickers: tickers.value,
      sessionChangeNotifications: sessionChangeNotifications.value,
      eventLogs: eventLogs.value.slice(0, 50)
    }))
  }

  const addEventLog = (message, type = 'info', params = null) => {
    eventLogs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message, // i18n key or raw message
      type,
      params
    })
    saveToStorage()
  }

  const createTicker = (payload) => {
    const newTicker = {
      id: "ticker-" + Date.now(),
      isActive: true,
      createdBy: 'Admin',
      startsAt: new Date().toISOString(),
      ...payload
    }
    tickers.value.unshift(newTicker)
    addEventLog('admin.notifications.logs.tickerCreated', 'emergency', { id: payload.titleKey })
    lastBroadcastAt.value = new Date()
    saveToStorage()
  }

  const activateTicker = (tickerId) => {
    const ticker = tickers.value.find(t => t.id === tickerId)
    if (!ticker) return
    ticker.isActive = true
    addEventLog('admin.notifications.logs.tickerActivated', 'info', { id: tickerId })
    saveToStorage()
  }

  const deactivateTicker = (tickerId) => {
    const ticker = tickers.value.find(t => t.id === tickerId)
    if (!ticker) return
    ticker.isActive = false
    addEventLog('admin.notifications.logs.tickerDeactivated', 'warning', { id: tickerId })
    saveToStorage()
  }

  const expireTicker = (tickerId) => {
    const ticker = tickers.value.find(t => t.id === tickerId)
    if (!ticker) return
    ticker.isActive = false
    ticker.expiresAt = new Date().toISOString()
    addEventLog('admin.notifications.logs.tickerExpired', 'warning', { id: tickerId })
    saveToStorage()
  }

  const createSessionChangeNotification = (payload) => {
    const newNoti = {
      id: "session-change-" + Date.now(),
      type: 'sessionChange',
      status: 'draft',
      ...payload
    }
    sessionChangeNotifications.value.unshift(newNoti)
    addEventLog('admin.notifications.logs.sessionCreated', 'info', { id: payload.sessionId })
    saveToStorage()
  }

  const sendSessionChangeNotification = (notificationId) => {
    const noti = sessionChangeNotifications.value.find(n => n.id === notificationId)
    if (!noti) return
    noti.status = 'sent'
    noti.sentAt = new Date().toISOString()
    isMockBroadcasting.value = true
    addEventLog('admin.notifications.logs.sessionSent', 'system', { id: notificationId })
    lastBroadcastAt.value = new Date()
    saveToStorage()
    setTimeout(() => {
      isMockBroadcasting.value = false
    }, 2000)
  }

  const resetMockNotificationControl = () => {
    tickers.value = JSON.parse(JSON.stringify(mockTickers))
    sessionChangeNotifications.value = JSON.parse(JSON.stringify(mockSessionChanges))
    eventLogs.value = []
    addEventLog('admin.notifications.logs.reset', 'system')
    saveToStorage()
  }

  return {
    tickers,
    sessionChangeNotifications,
    eventLogs,
    isMockBroadcasting,
    lastBroadcastAt,
    activeTickers,
    expiredTickers,
    scheduledTickers,
    sentNotifications,
    kpiSummary,
    createTicker,
    activateTicker,
    deactivateTicker,
    expireTicker,
    createSessionChangeNotification,
    sendSessionChangeNotification,
    resetMockNotificationControl,
    addEventLog
  }
})
