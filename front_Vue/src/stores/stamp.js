import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { stampSpots } from '@/data/mockGamification'
import { logger } from '@/utils/logger'

export const useStampStore = defineStore('stamp', () => {
  const scope = 'StampStore'
  
  // 상태 관리 (LocalStorage 연동)
  const collectedStampIds = ref(JSON.parse(localStorage.getItem('collected_stamps') || '[]'))
  const lastVisitedSpotId = ref(localStorage.getItem('last_visited_spot') || null)

  watch(collectedStampIds, (val) => {
    localStorage.setItem('collected_stamps', JSON.stringify(val))
  }, { deep: true })

  watch(lastVisitedSpotId, (val) => {
    if (val) localStorage.setItem('last_visited_spot', val)
    else localStorage.removeItem('last_visited_spot')
  })

  // Getters
  const totalStampCount = computed(() => stampSpots.length)
  const collectedStampCount = computed(() => collectedStampIds.value.length)
  const progressPercent = computed(() => Math.round((collectedStampCount.value / totalStampCount.value) * 100))
  const isCompletedAll = computed(() => collectedStampCount.value === totalStampCount.value)
  
  const recentlyCollectedStamps = computed(() => {
    return collectedStampIds.value.slice(-3).map(id => stampSpots.find(s => s.id === id)).reverse()
  })

  const nextRecommendedSpot = computed(() => {
    return stampSpots.find(s => !collectedStampIds.value.includes(s.id)) || stampSpots[0]
  })

  // Actions
  const scanQr = (qrCode) => {
    const spot = stampSpots.find(s => s.qrCode === qrCode)
    if (!spot) {
      logger.error(scope, `잘못된 QR 코드: ${qrCode}`)
      return { success: false, message: '유효하지 않은 QR 코드입니다.' }
    }

    if (collectedStampIds.value.includes(spot.id)) {
      logger.info(scope, `이미 획득한 스탬프: ${spot.id}`)
      return { success: false, isDuplicate: true, spot, message: '이미 획득한 스탬프입니다.' }
    }

    return { success: true, spot }
  }

  const collectStamp = (spotId) => {
    if (!collectedStampIds.value.includes(spotId)) {
      collectedStampIds.value.push(spotId)
      lastVisitedSpotId.value = spotId
      logger.info(scope, `스탬프 획득 성공: ${spotId}`)
      return true
    }
    return false
  }

  const isStampCollected = (spotId) => collectedStampIds.value.includes(spotId)

  const resetProgress = () => {
    collectedStampIds.value = []
    lastVisitedSpotId.value = null
    logger.info(scope, '데모 진행률 초기화')
  }

  return {
    collectedStampIds,
    lastVisitedSpotId,
    totalStampCount,
    collectedStampCount,
    progressPercent,
    isCompletedAll,
    recentlyCollectedStamps,
    nextRecommendedSpot,
    scanQr,
    collectStamp,
    isStampCollected,
    resetProgress
  }
})
