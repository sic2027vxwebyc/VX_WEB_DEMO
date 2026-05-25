/**
 * [ 일정 시간 계산 유틸리티 ]
 * 이벤트의 현재 진행 여부, 다음 일정, 카운트다운 및 진행률을 계산하는 순수 함수들을 제공합니다.
 * 
 * [Timezone Policy]
 * - 기본적으로 브라우저의 로컬 타임존을 따르나, 국제대회 현장(Asia/Seoul) 기준의 
 *   ISO string(+09:00) 사용을 권장합니다.
 */
import { toMinutes, getNowMinutes, DAY_ORDER } from './date'

/**
 * 특정 시간(HH:mm)을 오늘 날짜의 Date 객체로 변환합니다.
 */
export function timeToTodayDate(timeStr, baseDate = new Date()) {
  const [hours, minutes] = timeStr.split(':').map(Number)
  const date = new Date(baseDate)
  date.setHours(hours, minutes, 0, 0)
  return date
}

/**
 * 이벤트 목록과 현재 시간을 기준으로 상태를 계산합니다.
 */
export function calculateScheduleState(events, now) {
  if (!events || events.length === 0) {
    return {
      currentEvent: null,
      nextEvent: null,
      completedEvents: [],
      upcomingEvents: [],
      allCompleted: true
    }
  }

  const nowMin = getNowMinutes(now)
  const nowDay = getNowDayString(now)
  const nowDayOrder = DAY_ORDER[nowDay] || 0

  const processed = events.map((event, index, array) => {
    const startMin = toMinutes(event.normalizedTime)
    
    // 종료 시간 계산: 다음 이벤트 시작 시간 또는 30분 후
    const nextEventInSameDay = array.slice(index + 1).find(e => e.day === event.day)
    const endMin = nextEventInSameDay 
      ? toMinutes(nextEventInSameDay.normalizedTime) 
      : startMin + 30

    const eventDayOrder = DAY_ORDER[event.day] || 0
    
    let status = 'upcoming'
    if (eventDayOrder < nowDayOrder) {
      status = 'completed'
    } else if (eventDayOrder > nowDayOrder) {
      status = 'upcoming'
    } else {
      // 같은 날
      if (nowMin >= startMin && nowMin < endMin) {
        status = 'ongoing'
      } else if (nowMin >= endMin) {
        status = 'completed'
      }
    }

    return {
      ...event,
      runtimeStatus: status,
      startMinutes: startMin,
      endMinutes: endMin
    }
  })

  const currentEvent = processed.find(e => e.runtimeStatus === 'ongoing') || null
  const nextEvent = processed.find(e => e.runtimeStatus === 'upcoming') || null
  const completedEvents = processed.filter(e => e.runtimeStatus === 'completed')
  const upcomingEvents = processed.filter(e => e.runtimeStatus === 'upcoming')
  
  const allCompleted = upcomingEvents.length === 0 && !currentEvent

  return {
    currentEvent,
    nextEvent,
    completedEvents,
    upcomingEvents,
    allCompleted,
    processedEvents: processed
  }
}

/**
 * 현재 요일 문자열 반환 (sunday, monday, ...)
 */
function getNowDayString(date) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

/**
 * 다음 이벤트까지의 카운트다운 텍스트를 생성합니다.
 */
export function getCountdownText(nextEvent, now, t) {
  if (!nextEvent) return t('events.live.allSessionsCompleted')

  const nowMin = getNowMinutes(now)
  const startMin = toMinutes(nextEvent.normalizedTime)
  const diff = startMin - nowMin

  if (diff > 0) {
    const hours = Math.floor(diff / 60)
    const mins = diff % 60
    if (hours > 0) {
      return t('events.live.startsIn', { h: hours, m: mins })
    }
    return t('events.live.startsInMin', { m: mins })
  }
  
  return t('events.live.startingSoon')
}

/**
 * 현재 이벤트의 진행률(0~100)을 계산합니다.
 */
export function getProgress(currentEvent, now) {
  if (!currentEvent) return 0
  
  const nowMin = getNowMinutes(now)
  const total = currentEvent.endMinutes - currentEvent.startMinutes
  const elapsed = nowMin - currentEvent.startMinutes
  
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
}
