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
    updateQuestProgress,
    resetProgress
  }
})
