import { defineStore } from 'pinia'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { normalizeEventTime, toMinutes, DAY_ORDER, getNowDay, getNowMinutes } from '@/utils/date'
import { calculateScheduleState, getCountdownText, getProgress } from '@/utils/scheduleTime'
import { logger } from '@/utils/logger'

export const useEventsStore = defineStore('events', () => {
  const { t, tm } = useI18n({ useScope: 'global' })
  const scope = 'EventsStore'
  
  // 현재 시간 및 Ticker 상태
  const currentTime = ref(new Date())
  const isMocked = ref(false)
  let tickerId = null

  // 사용자 저장 데이터 (로컬 스토리지 연동)
  const favorites = ref(JSON.parse(localStorage.getItem('event_favorites') || '[]'))
  const reminders = ref(JSON.parse(localStorage.getItem('event_reminders') || '[]'))

  watch(favorites, (val) => localStorage.setItem('event_favorites', JSON.stringify(val)), { deep: true })
  watch(reminders, (val) => localStorage.setItem('event_reminders', JSON.stringify(val)), { deep: true })

  /**
   * 전체 이벤트 목록 (i18n 데이터 기반)
   */
  const allEvents = computed(() => {
    const items = tm('events.items')
    if (!items || typeof items !== 'object') return []

    const events = Object.entries(items).map(([id, item]) => {
      let hallId = 'hall-1'
      if (item.category === 'baptism') hallId = 'hall-3'
      if (item.category === 'exhibition') hallId = 'hall-2'
      if (parseInt(id) > 30) hallId = 'hall-6'

      return {
        id,
        ...item,
        hallId,
        normalizedTime: normalizeEventTime(item),
        dayLabel: t(`events.days.${item.day}.label`),
        isFavorite: favorites.value.includes(id),
        reminderEnabled: reminders.value.includes(id)
      }
    })

    return events.sort((a, b) => {
      if (a.day !== b.day) {
        return (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99)
      }
      return toMinutes(a.normalizedTime) - toMinutes(b.normalizedTime)
    })
  })

  /**
   * 실시간 상태 계산 결과 (중앙화)
   */
  const scheduleState = computed(() => {
    return calculateScheduleState(allEvents.value, currentTime.value)
  })

  const processedEvents = computed(() => scheduleState.value.processedEvents)
  const currentSession = computed(() => scheduleState.value.currentEvent)
  const nextSession = computed(() => scheduleState.value.nextEvent)
  const allCompleted = computed(() => scheduleState.value.allCompleted)

  const countdownText = computed(() => {
    return getCountdownText(nextSession.value, currentTime.value, t)
  })

  const currentProgress = computed(() => {
    return getProgress(currentSession.value, currentTime.value)
  })

  const toggleFavorite = (id) => {
    const idx = favorites.value.indexOf(id)
    if (idx > -1) favorites.value.splice(idx, 1)
    else favorites.value.push(id)
  }

  const toggleReminder = (id) => {
    const idx = reminders.value.indexOf(id)
    if (idx > -1) reminders.value.splice(idx, 1)
    else reminders.value.push(id)
  }

  /**
   * Ticker 관리
   */
  const startTicker = () => {
    if (tickerId) return
    logger.info(scope, '일정 동기화 Ticker 시작')
    tickerId = setInterval(() => {
      if (!isMocked.value) {
        currentTime.value = new Date()
      }
    }, 30000) // 30초마다 갱신
  }

  const stopTicker = () => {
    if (tickerId) {
      clearInterval(tickerId)
      tickerId = null
      logger.info(scope, '일정 동기화 Ticker 정지')
    }
  }

  /**
   * 하네스 엔지니어링: Mock 시간 설정
   */
  const setMockNow = (isoString) => {
    isMocked.value = true
    currentTime.value = new Date(isoString)
    logger.warn(scope, `Mock 시간 설정됨: ${currentTime.value.toISOString()}`)
  }

  const clearMockNow = () => {
    isMocked.value = false
    currentTime.value = new Date()
    logger.info(scope, 'Mock 시간 해제됨')
  }

  const currentDay = computed(() => getNowDay(currentTime.value))

  return {
    currentTime,
    isMocked,
    favorites,
    reminders,
    allEvents,
    processedEvents,
    currentSession,
    nextSession,
    allCompleted,
    countdownText,
    currentProgress,
    toggleFavorite,
    toggleReminder,
    currentDay,
    startTicker,
    stopTicker,
    setMockNow,
    clearMockNow
  }
})
