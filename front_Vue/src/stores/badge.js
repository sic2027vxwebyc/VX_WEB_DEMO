import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { badges } from '@/data/mockGamification'
import { useStampStore } from './stamp'
import { useQuestStore } from './quest'
import { logger } from '@/utils/logger'

export const useBadgeStore = defineStore('badge', () => {
  const scope = 'BadgeStore'
  const stampStore = useStampStore()
  const questStore = useQuestStore()
  
  const unlockedBadgeIds = ref(JSON.parse(localStorage.getItem('unlocked_badges') || '[]'))

  watch(unlockedBadgeIds, (val) => {
    localStorage.setItem('unlocked_badges', JSON.stringify(val))
  }, { deep: true })

  // Getters
  const processedBadges = computed(() => {
    return badges.map(b => ({
      ...b,
      isUnlocked: unlockedBadgeIds.value.includes(b.id)
    }))
  })

  const unlockedBadges = computed(() => processedBadges.value.filter(b => b.isUnlocked))
  const lockedBadges = computed(() => processedBadges.value.filter(b => !b.isUnlocked))

  // Actions
  const checkBadgeUnlocks = () => {
    // 1. 웰컴 익스플로러 (웰컴 투어 퀘스트 완료)
    if (questStore.completedQuestIds.includes('quest-welcome-tour')) {
      unlockBadge('badge-welcome-explorer')
    }
    
    // 2. 홀 익스플로러 (홀 마스터 퀘스트 완료)
    if (questStore.completedQuestIds.includes('quest-hall-master')) {
      unlockBadge('badge-hall-explorer')
    }

    // 3. 공간 미식가 (미식가 퀘스트 완료)
    if (questStore.completedQuestIds.includes('quest-foodie')) {
      unlockBadge('badge-gourmet')
    }

    // 4. 스페셜 마스터 (모든 스탬프 수집)
    if (stampStore.isCompletedAll) {
      unlockBadge('badge-master')
    }
  }

  const unlockBadge = (id) => {
    if (!unlockedBadgeIds.value.includes(id)) {
      unlockedBadgeIds.value.push(id)
      logger.info(scope, `배지 획득: ${id}`)
      return true
    }
    return false
  }

  const resetProgress = () => {
    unlockedBadgeIds.value = []
  }

  return {
    unlockedBadgeIds,
    processedBadges,
    unlockedBadges,
    lockedBadges,
    checkBadgeUnlocks,
    resetProgress
  }
})
