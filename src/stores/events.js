import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { normalizeEventTime, toMinutes, DAY_ORDER, getNowDay, getNowMinutes } from '@/utils/date'

export const useEventsStore = defineStore('events', () => {
  const { t, tm } = useI18n()
  
  const currentTime = ref(new Date())
  
  /**
   * 전체 이벤트 목록 (i18n 데이터 기반)
   */
  const allEvents = computed(() => {
    const items = tm('events.items')
    if (!items || typeof items !== 'object') return []

    const events = Object.entries(items).map(([id, item]) => ({
      id,
      ...item,
      normalizedTime: normalizeEventTime(item),
      dayLabel: t(`events.days.${item.day}.label`)
    }))

    return events.sort((a, b) => {
      if (a.day !== b.day) {
        return (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99)
      }
      return toMinutes(a.normalizedTime) - toMinutes(b.normalizedTime)
    })
  })

  /**
   * 실시간 상태가 계산된 이벤트 목록
   */
  const processedEvents = computed(() => {
    const nowMin = getNowMinutes(currentTime.value)
    const nowDay = getNowDay(currentTime.value)
    
    return allEvents.value.map((event, index, array) => {
      const nextEvent = array.slice(index + 1).find(e => e.day === event.day)
      const start = toMinutes(event.normalizedTime)
      const end = nextEvent ? toMinutes(nextEvent.normalizedTime) : start + 30
      
      let status = 'upcoming'
      if (nowDay === event.day) {
        if (nowMin >= start && nowMin < end) status = 'ongoing'
        else if (nowMin >= end) status = 'completed'
      } else if (DAY_ORDER[nowDay] > DAY_ORDER[event.day]) {
        status = 'completed'
      }

      return { ...event, runtimeStatus: status }
    })
  })

  const updateCurrentTime = () => {
    currentTime.value = new Date()
  }

  const currentDay = computed(() => getNowDay(currentTime.value))

  return {
    currentTime,
    allEvents,
    processedEvents,
    currentDay,
    updateCurrentTime
  }
})
