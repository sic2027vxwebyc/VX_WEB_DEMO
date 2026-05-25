/**
 * [ 운영 스토어 ]
 * 실시간 국제대회 운영 상태, 혼잡도, 위치 기반 컨텍스트 및 긴급 공지를 관리합니다.
 */
import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getNowMinutes } from '@/utils/date'

export const useOperationalStore = defineStore('operational', () => {
  const { t } = useI18n({ useScope: 'global' })

  // 현재 가상 위치 (시뮬레이션용)
  const currentHallId = ref('hall-1')
  const lastUpdated = ref(new Date())

  // 내비게이션 상태
  const isAccessibilityMode = ref(false)
  const isRerouting = ref(false)

  // 혼잡도 데이터 (hallId: level)
  const congestionData = reactive({
    'hall-1': { level: 'low', percent: 25 },
    'hall-2': { level: 'moderate', percent: 65 },
    'hall-3': { level: 'high', percent: 92 },
    'hall-4': { level: 'low', percent: 15 },
    'hall-5': { level: 'low', percent: 30 },
    'f-sodam': { level: 'high', percent: 88 },
    'c-cu1': { level: 'moderate', percent: 55 }
  })

  // 긴급 및 실시간 운영 공지
  const noticesData = ref([
    { id: 1, type: 'emergency', active: true },
    { id: 2, type: 'info', active: true },
    { id: 3, type: 'status', active: true }
  ])

  const emergencyNotices = computed(() => {
    return noticesData.value.map(notice => ({
      ...notice,
      messageKey: `homeV2.ticker.${notice.type}`
    }))
  })

  // 시간 기반 운영 페이즈 (Morning, Lunch, Afternoon, Evening)
  const timePhase = computed(() => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const totalMinutes = hours * 60 + minutes

    if (totalMinutes < 11 * 60 + 30) return 'morning'
    if (totalMinutes < 13 * 60) return 'lunch'
    if (totalMinutes < 17 * 60) return 'afternoon'
    return 'evening'
  })


  /**
   * 실시간 데이터 시뮬레이션
   * 데모 환경에서 "살아있는" 느낌을 주기 위해 주기적으로 호출됩니다.
   */
  const simulateUpdates = () => {
    lastUpdated.value = new Date()
    
    // 혼잡도 랜덤 변동
    Object.keys(congestionData).forEach(key => {
      const change = Math.floor(Math.random() * 11) - 5 // -5 ~ +5
      congestionData[key].percent = Math.min(100, Math.max(0, congestionData[key].percent + change))
      
      if (congestionData[key].percent < 40) congestionData[key].level = 'low'
      else if (congestionData[key].percent < 80) congestionData[key].level = 'moderate'
      else congestionData[key].level = 'high'
    })
  }

  const setLocation = (hallId) => {
    currentHallId.value = hallId
  }

  const clearNavigationState = () => {
    isRerouting.value = false
    // 추가적인 내비게이션 관련 상태 초기화 필요 시 여기에 추가
  }

  return {
    currentHallId,
    lastUpdated,
    isAccessibilityMode,
    isRerouting,
    congestionData,
    noticesData,
    emergencyNotices,
    timePhase,
    simulateUpdates,
    setLocation,
    clearNavigationState
  }
})
