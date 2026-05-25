import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { quests } from '@/data/mockGamification'
import { useStampStore } from './stamp'
import { logger } from '@/utils/logger'

export const useQuestStore = defineStore('quest', () => {
  const scope = 'QuestStore'
  const stampStore = useStampStore()
  
  const completedQuestIds = ref(JSON.parse(localStorage.getItem('completed_quests') || '[]'))

  watch(completedQuestIds, (val) => {
    localStorage.setItem('completed_quests', JSON.stringify(val))
  }, { deep: true })

  // Getters
  const processedQuests = computed(() => {
    return quests.map(q => {
      const collectedCount = q.requiredSpotIds.filter(id => stampStore.isStampCollected(id)).length
      const progress = Math.round((collectedCount / q.requiredSpotIds.length) * 100)
      const isCompleted = collectedCount === q.requiredSpotIds.length
      
      // 자동 완료 처리 (부수 효과 방지를 위해 UI에서 호출 권장되지만 getter에서 상태 반영)
      return { ...q, progress, isCompleted, currentCount: collectedCount }
    })
  })

  const activeQuests = computed(() => processedQuests.value.filter(q => !completedQuestIds.value.includes(q.id)))
  const completedQuests = computed(() => processedQuests.value.filter(q => completedQuestIds.value.includes(q.id)))

  // Actions
  const scanQr = async (token, gps) => {
    logger.info(scope, 'QR 스캔 시도', { token, gps })
    
    // 1. 토큰 유효성 검사 (Mock: 시간 제한)
    const tokenTimestamp = parseInt(token.split('-')[2])
    if (Date.now() - tokenTimestamp > 5000) {
      logger.error(scope, '만료된 토큰')
      return false
    }

    // 2. GPS 위치 검증 (Mock: 킨텍스 영역)
    if (gps.lat < 36 || gps.lat > 38) {
      logger.error(scope, '위치 검증 실패')
      return false
    }

    // 성공 시 스탬프 업데이트 로직 호출
    logger.info(scope, 'QR 검증 성공')
    return true
  }

  const updateQuestProgress = () => {
    processedQuests.value.forEach(q => {
      if (q.isCompleted && !completedQuestIds.value.includes(q.id)) {
        completedQuestIds.value.push(q.id)
        logger.info(scope, `퀘스트 완료: ${q.id}`)
      }
    })
  }

  const resetProgress = () => {
    completedQuestIds.value = []
  }

  return {
    completedQuestIds,
    processedQuests,
    activeQuests,
    completedQuests,
    scanQr,
    updateQuestProgress,
    resetProgress
  }
})
