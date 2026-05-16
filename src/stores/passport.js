import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useStampStore } from './stamp'
import { useQuestStore } from './quest'
import { useBadgeStore } from './badge'
import { logger } from '@/utils/logger'

export const usePassportStore = defineStore('passport', () => {
  const scope = 'PassportStore'
  const stampStore = useStampStore()
  const questStore = useQuestStore()
  const badgeStore = useBadgeStore()
  
  const rewardClaimed = ref(localStorage.getItem('reward_claimed') === 'true')

  watch(rewardClaimed, (val) => {
    localStorage.setItem('reward_claimed', val.toString())
  })

  // Getters
  const claimAvailable = computed(() => {
    return stampStore.isCompletedAll && !rewardClaimed.value
  })

  const journeyTimeline = computed(() => {
    // 수집한 스탬프들을 시간순(현재는 ID 순서로 시뮬레이션)으로 나열
    return stampStore.collectedStampIds.map(id => {
      // Note: recentlyCollectedStamps might be limited, but using it as in original
      const spot = stampStore.recentlyCollectedStamps.find(s => s.id === id) || { nameKey: 'common.unknown' }
      return {
        id,
        nameKey: spot.nameKey,
        type: 'stamp',
        time: 'Today'
      }
    })
  })

  // Actions
  const markRewardClaimed = () => {
    if (claimAvailable.value) {
      rewardClaimed.value = true
      logger.info(scope, '보상 수령 완료 처리됨')
      return true
    }
    return false
  }

  const resetPassport = () => {
    rewardClaimed.value = false
    stampStore.resetProgress()
    questStore.resetProgress()
    badgeStore.resetProgress()
    logger.info(scope, '전체 패스포트 데이터 리셋')
  }

  return {
    rewardClaimed,
    claimAvailable,
    journeyTimeline,
    markRewardClaimed,
    resetPassport
  }
})
