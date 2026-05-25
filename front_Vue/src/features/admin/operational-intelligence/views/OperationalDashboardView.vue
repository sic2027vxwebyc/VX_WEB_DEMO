<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOperationalIntelligenceStore } from '../stores/operationalIntelligenceStore'
import { logger } from '@/utils/logger'

// 컴포넌트 임포트
import OperationalKpiCards from '../components/OperationalKpiCards.vue'
import AdminHeatmapPanel from '../components/AdminHeatmapPanel.vue'
import CongestionOverridePanel from '../components/CongestionOverridePanel.vue'
import RestrictedAreaPanel from '../components/RestrictedAreaPanel.vue'
import OperationEventLog from '../components/OperationEventLog.vue'

const { t } = useI18n()
const store = useOperationalIntelligenceStore()
const scope = 'AdminOperations'

onMounted(() => {
  logger.info(scope, '운영 관제 대시보드가 마운트되었습니다.')
  store.startMockTicker()
})

onUnmounted(() => {
  logger.info(scope, '운영 관제 대시보드를 벗어납니다.')
  store.stopMockTicker()
})

const resetData = () => {
  if (confirm(t('admin.operations.reset'))) {
    store.resetMockOperations()
  }
}
</script>

<template>
  <div class="px-margin-mobile md:px-margin-desktop pb-margin-desktop pt-8">
    <!-- 헤더 -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-4">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <router-link to="/admin" class="text-primary hover:underline font-label-sm flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            {{ t('navigation.admin') }}
          </router-link>
        </div>
        <h1 class="font-display-lg text-display-lg text-on-surface">{{ t('admin.operations.title') }}</h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant">{{ t('admin.operations.subtitle') }}</p>
      </div>
      <div class="flex gap-md">
        <div class="flex items-center gap-sm bg-primary/10 border border-primary/30 px-md py-xs rounded-full">
          <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span class="text-[10px] text-primary uppercase tracking-wider font-bold">{{ t('admin.operations.engineActive') }}</span>
        </div>
        <button 
          @click="resetData"
          class="bg-white/5 hover:bg-white/10 text-on-surface-variant border border-white/10 font-label-md px-md py-sm rounded-lg transition-all"
        >
          {{ t('admin.operations.reset') }}
        </button>
      </div>
    </div>

    <!-- KPI 섹션 -->
    <OperationalKpiCards />

    <!-- 메인 대시보드 그리드 -->
    <div class="grid grid-cols-12 gap-lg">
      <!-- 좌측: 히트맵 (PC 기준 8컬럼) -->
      <div class="col-span-12 lg:col-span-8 flex flex-col gap-lg">
        <AdminHeatmapPanel class="min-h-[400px] lg:flex-1" />
        
        <!-- 최근 이벤트 로그 (모바일에서는 아래로, PC에서는 히트맵 하단) -->
        <div class="hidden lg:block h-64">
          <OperationEventLog />
        </div>
      </div>

      <!-- 우측: 제어 패널 (PC 기준 4컬럼) -->
      <div class="col-span-12 lg:col-span-4 flex flex-col gap-lg">
        <CongestionOverridePanel />
        <RestrictedAreaPanel />
        
        <!-- 모바일 전용 이벤트 로그 -->
        <div class="lg:hidden h-80">
          <OperationEventLog />
        </div>
      </div>
    </div>

    <!-- 마지막 업데이트 시각 -->
    <div class="mt-lg flex justify-end">
      <p class="text-[10px] text-on-surface-variant">
        {{ t('admin.operations.lastUpdate', { time: store.lastUpdatedAt.toLocaleTimeString() }) }}
      </p>
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
