<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGamificationControlStore } from '../stores/gamificationControlStore'
import { logger } from '@/utils/logger'

// 컴포넌트 임포트
import GamificationKpiCards from '../components/GamificationKpiCards.vue'
import RewardStockPanel from '../components/RewardStockPanel.vue'
import QuestControlPanel from '../components/QuestControlPanel.vue'
import PopularStampSpotsPanel from '../components/PopularStampSpotsPanel.vue'
import GamificationEventLog from '../components/GamificationEventLog.vue'
import AdminQrScannerPanel from '../components/AdminQrScannerPanel.vue'

const { t } = useI18n()
const store = useGamificationControlStore()
const scope = 'AdminGamification'

onMounted(() => {
  logger.info(scope, '게이미피케이션 관리 대시보드 활성화')
  store.startMockTicker()
})

onUnmounted(() => {
  logger.info(scope, '게이미피케이션 관리 대시보드 종료')
  store.stopMockTicker()
})

const resetData = () => {
  if (confirm(t('admin.gamification.reset'))) {
    store.resetMockGamificationControl()
  }
}
</script>

<template>
  <div class="px-margin-mobile md:px-margin-desktop pb-margin-desktop pt-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-4">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <router-link to="/admin" class="text-primary hover:underline font-label-sm flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            {{ t('navigation.admin') }}
          </router-link>
        </div>
        <h1 class="font-display-lg text-display-lg text-on-surface">{{ t('admin.gamification.title') }}</h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant">{{ t('admin.gamification.subtitle') }}</p>
      </div>
      <div class="flex gap-md">
        <div class="flex items-center gap-sm bg-primary/10 border border-primary/30 px-md py-xs rounded-full">
          <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span class="text-[10px] text-primary uppercase tracking-wider font-bold">{{ t('admin.gamification.engineActive') }}</span>
        </div>
        <button 
          @click="resetData"
          class="bg-white/5 hover:bg-white/10 text-on-surface-variant border border-white/10 font-label-md px-md py-sm rounded-lg transition-all"
        >
          {{ t('admin.gamification.reset') }}
        </button>
      </div>
    </div>

    <!-- KPI -->
    <GamificationKpiCards />

    <div class="grid grid-cols-12 gap-lg h-auto">
      <!-- Left: Analytics & Quests -->
      <div class="col-span-12 lg:col-span-8 flex flex-col gap-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <PopularStampSpotsPanel />
          <AdminQrScannerPanel />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <!-- 시간대별 참여 추이 (Placeholder 차트 스타일) -->
          <div class="glass-panel p-md rounded-xl border-white/10 flex flex-col h-full">
            <h3 class="font-label-md text-on-surface flex items-center gap-xs mb-lg">
              <span class="material-symbols-outlined text-sm text-primary">analytics</span>
              {{ t('admin.gamification.participationTrend') }}
            </h3>
            <div class="flex-1 flex items-end justify-between gap-1 px-sm pb-sm min-h-[150px]">
              <div v-for="(val, i) in store.stampStats.hourlyTrend" :key="i" 
                   class="bg-primary/40 rounded-t-sm w-full"
                   :style="{ height: (val / Math.max(...store.stampStats.hourlyTrend) * 100) + '%' }">
              </div>
            </div>
            <div class="flex justify-between px-xs mt-2">
              <span class="text-[8px] text-on-surface-variant">09:00</span>
              <span class="text-[8px] text-on-surface-variant">13:00</span>
              <span class="text-[8px] text-on-surface-variant">18:00</span>
            </div>
          </div>
          <QuestControlPanel />
        </div>
        
        <div class="lg:hidden">
          <RewardStockPanel />
        </div>
        
        <GamificationEventLog class="h-64" />
      </div>

      <!-- Right: Stocks (PC only) -->
      <div class="hidden lg:block col-span-12 lg:col-span-4">
        <RewardStockPanel />
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
