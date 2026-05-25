import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { mockGamificationStats, mockRewardStocks, mockDynamicQuests } from '../data/mockGamificationControlData'
import { stampSpots } from '@/data/mockGamification'

export const useGamificationControlStore = defineStore('gamificationControl', () => {
  const STORAGE_KEY = 'vx:v2:admin:gamification-control'

  // 상태 로드 (localStorage)
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

  const stampStats = ref(mockGamificationStats)
  const stampSpotsList = ref(stampSpots)
  const rewardStocks = ref(savedState.rewardStocks || JSON.parse(JSON.stringify(mockRewardStocks)))
  const dynamicQuests = ref(savedState.dynamicQuests || JSON.parse(JSON.stringify(mockDynamicQuests)))
  const eventLogs = ref(savedState.eventLogs || [])
  const isMockTickerRunning = ref(false)
  const lastUpdatedAt = ref(new Date())
  let tickerInterval = null

  // Getters
  const completionRate = computed(() => stampStats.value.completionRate)
  
  const popularStampSpots = computed(() => {
    // 실제로는 로그 기반 계산이 필요하지만 현재는 mock 정렬
    return [...stampSpotsList.value].slice(0, 5).map(spot => ({
      ...spot,
      visitCount: Math.floor(Math.random() * 1000) + 500
    })).sort((a, b) => b.visitCount - a.visitCount)
  })

  const lowStockRewards = computed(() => rewardStocks.value.filter(r => r.status === 'low'))
  const soldOutRewards = computed(() => rewardStocks.value.filter(r => r.status === 'soldOut'))
  const activeQuests = computed(() => dynamicQuests.value.filter(q => q.status === 'active'))

  const kpiSummary = computed(() => ({
    totalParticipants: stampStats.value.totalParticipants,
    averageStampCount: stampStats.value.averageStampCount,
    completedParticipants: stampStats.value.completedParticipants,
    completionRate: stampStats.value.completionRate,
    activeQuestsCount: activeQuests.value.length
  }))

  // Actions
  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      rewardStocks: rewardStocks.value,
      dynamicQuests: dynamicQuests.value,
      eventLogs: eventLogs.value.slice(0, 50)
    }))
  }

  const addEventLog = (message, type = 'info', params = null) => {
    eventLogs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message,
      type,
      params
    })
    saveToStorage()
  }

  const adjustRewardStock = (rewardId, delta) => {
    const reward = rewardStocks.value.find(r => r.id === rewardId)
    if (!reward) return

    reward.remainingStock = Math.max(0, reward.remainingStock + delta)
    reward.claimedCount = Math.max(0, reward.claimedCount - delta)
    
    // 상태 자동 전환
    if (reward.remainingStock === 0) {
      reward.status = 'soldOut'
    } else if (reward.remainingStock < reward.totalStock * 0.2) {
      reward.status = 'low'
    } else {
      reward.status = 'available'
    }

    addEventLog('admin.gamification.logs.rewardStockAdjusted', 'inventory', { id: rewardId, delta: (delta > 0 ? '+' : '') + delta, remaining: reward.remainingStock })
    lastUpdatedAt.value = new Date()
    saveToStorage()
  }

  const setRewardStatus = (rewardId, status) => {
    const reward = rewardStocks.value.find(r => r.id === rewardId)
    if (!reward) return
    reward.status = status
    addEventLog('admin.gamification.logs.rewardStatusChanged', 'config', { id: rewardId, status })
    saveToStorage()
  }

  const createDynamicQuest = (payload) => {
    const newQuest = {
      id: `quest-${Date.now()}`,
      status: 'active',
      participantCount: 0,
      ...payload
    }
    dynamicQuests.value.unshift(newQuest)
    addEventLog('admin.gamification.logs.questCreated', 'quest', { title: payload.titleKey || payload.id })
    lastUpdatedAt.value = new Date()
    saveToStorage()
  }

  const toggleQuestStatus = (questId) => {
    const quest = dynamicQuests.value.find(q => q.id === questId)
    if (!quest) return
    quest.status = quest.status === 'active' ? 'paused' : 'active'
    addEventLog('admin.gamification.logs.questStatusChanged', 'quest', { id: questId, status: quest.status })
    saveToStorage()
  }

  const deleteQuest = (questId) => {
    dynamicQuests.value = dynamicQuests.value.filter(q => q.id !== questId)
    addEventLog('admin.gamification.logs.questDeleted', 'warning', { id: questId })
    saveToStorage()
  }

  const startMockTicker = () => {
    if (tickerInterval) return
    isMockTickerRunning.value = true
    tickerInterval = setInterval(() => {
      // 참여자 수 및 스탬프 수집 시뮬레이션
      if (Math.random() > 0.7) {
        stampStats.value.totalParticipants += 1
        if (Math.random() > 0.8) {
          stampStats.value.completedParticipants += 1
        }
        // 평균 스탬프 수 살짝 변동
        stampStats.value.averageStampCount = +(stampStats.value.averageStampCount + (Math.random() * 0.1 - 0.05)).toFixed(1)
        stampStats.value.completionRate = +((stampStats.value.completedParticipants / stampStats.value.totalParticipants) * 100).toFixed(1)
        lastUpdatedAt.value = new Date()
      }
    }, 5000)
  }

  const stopMockTicker = () => {
    if (tickerInterval) {
      clearInterval(tickerInterval)
      tickerInterval = null
    }
    isMockTickerRunning.value = false
  }

  const resetMockGamificationControl = () => {
    rewardStocks.value = JSON.parse(JSON.stringify(mockRewardStocks))
    dynamicQuests.value = JSON.parse(JSON.stringify(mockDynamicQuests))
    eventLogs.value = []
    stampStats.value = { ...mockGamificationStats }
    addEventLog('게이미피케이션 Mock 데이터 초기화 완료', 'system')
    lastUpdatedAt.value = new Date()
    saveToStorage()
  }

  return {
    stampStats,
    stampSpotsList,
    rewardStocks,
    dynamicQuests,
    eventLogs,
    isMockTickerRunning,
    lastUpdatedAt,
    completionRate,
    popularStampSpots,
    lowStockRewards,
    soldOutRewards,
    activeQuests,
    kpiSummary,
    adjustRewardStock,
    setRewardStatus,
    createDynamicQuest,
    toggleQuestStatus,
    deleteQuest,
    startMockTicker,
    stopMockTicker,
    resetMockGamificationControl,
    addEventLog
  }
})
