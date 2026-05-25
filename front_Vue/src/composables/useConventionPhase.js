/**
 * [ 컨벤션 페이즈 컴포저블 ]
 * 현재 시간을 기준으로 대회의 진행 단계(시작 전, 회기 종료, 전체 종료 등)를 계산합니다.
 * Home Hero 영역에서 상황에 맞는 메시지를 출력하기 위해 사용됩니다.
 */
import { computed } from 'vue'
import { useEventsStore } from '@/stores/events'
import { DAY_ORDER, getNowDay } from '@/utils/date'

export function useConventionPhase() {
  const eventsStore = useEventsStore()

  /**
   * Hero 표시 모드 결정
   */
  const heroMode = computed(() => {
    const now = eventsStore.currentTime
    const currentDay = getNowDay(now)
    const dayOrder = DAY_ORDER[currentDay] || 0

    // 1. 대회 시작 전 (월~목)
    if (dayOrder >= DAY_ORDER['monday'] && dayOrder <= DAY_ORDER['thursday']) {
      return 'beforeConvention'
    }

    // 2. 일요일 이후 (대회 완전 종료)
    if (dayOrder > DAY_ORDER['sunday'] || (currentDay === 'sunday' && eventsStore.allCompleted)) {
      return 'conventionFinished'
    }

    // 3. 금/토/일 대회 기간 중
    if (eventsStore.allCompleted) {
      return 'dayEnded' // 금요일 또는 토요일 종료됨
    }

    if (eventsStore.currentSession) {
      return 'liveEvent'
    }

    if (eventsStore.nextSession) {
      // 오늘 남은 일정이 있는지 확인 (events.json 기반)
      const nextSessionDay = eventsStore.nextSession.day
      if (nextSessionDay === currentDay) {
        // 오늘 첫 일정이 아직 시작 안 했는지 확인
        const todayEvents = eventsStore.allEvents.filter(e => e.day === currentDay)
        const firstEventId = todayEvents[0]?.id
        if (eventsStore.nextSession.id === firstEventId) {
          return 'beforeTodayFirstSession'
        }
        return 'betweenSessions'
      } else {
        // 다음 일정이 내일이면 오늘은 끝난 것
        return 'dayEnded'
      }
    }

    return 'dayEnded'
  })

  /**
   * 단계별 i18n 메시지 키
   */
  const heroMessageKey = computed(() => {
    if (heroMode.value === 'dayEnded') {
      const currentDay = getNowDay(eventsStore.currentTime)
      if (currentDay === 'friday') return 'homeV2.messages.fridayEnded'
      if (currentDay === 'saturday') return 'homeV2.messages.saturdayEnded'
    }
    return `homeV2.messages.${heroMode.value}`
  })

  /**
   * 현재 진행 중인 세션이 있는지 여부
   */
  const isSessionLive = computed(() => {
    return !!eventsStore.currentSession
  })

  return {
    heroMode,
    heroMessageKey,
    isSessionLive,
    currentSession: computed(() => eventsStore.currentSession),
    nextSession: computed(() => eventsStore.nextSession),
    countdownText: computed(() => eventsStore.countdownText),
    currentProgress: computed(() => eventsStore.currentProgress)
  }
}
