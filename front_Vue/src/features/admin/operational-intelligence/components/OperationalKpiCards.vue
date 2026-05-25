<script setup>
import { useI18n } from 'vue-i18n'
import { useOperationalIntelligenceStore } from '../stores/operationalIntelligenceStore'

const { t } = useI18n()
const store = useOperationalIntelligenceStore()
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
    <!-- 운영 구역 -->
    <div class="glass-panel p-md rounded-xl flex flex-col justify-between h-28 border-white/5">
      <div class="flex justify-between items-center text-on-surface-variant">
        <span class="font-label-sm">{{ t('admin.operations.kpi.activeZones') }}</span>
        <span class="material-symbols-outlined text-sm">grid_view</span>
      </div>
      <div class="flex items-end gap-xs">
        <span class="font-display-md text-primary">{{ store.kpiSummary.totalZones }}</span>
        <span class="font-label-sm mb-xs text-on-surface-variant">Units</span>
      </div>
    </div>

    <!-- 혼잡 구역 -->
    <div class="glass-panel p-md rounded-xl flex flex-col justify-between h-28 border-white/5" :class="{ 'border-status-high/30 bg-status-high/5': store.kpiSummary.crowdedCount > 0 }">
      <div class="flex justify-between items-center text-on-surface-variant">
        <span class="font-label-sm">{{ t('admin.operations.kpi.crowdedZones') }}</span>
        <span class="material-symbols-outlined text-sm" :class="{ 'text-status-high': store.kpiSummary.crowdedCount > 0 }">groups</span>
      </div>
      <div class="flex items-end gap-xs">
        <span class="font-display-md" :class="store.kpiSummary.crowdedCount > 0 ? 'text-status-high' : 'text-primary'">{{ store.kpiSummary.crowdedCount }}</span>
        <span class="font-label-sm mb-xs text-on-surface-variant">Active</span>
      </div>
    </div>

    <!-- 통제 구역 -->
    <div class="glass-panel p-md rounded-xl flex flex-col justify-between h-28 border-white/5" :class="{ 'border-security-alert/30 bg-security-alert/5': store.kpiSummary.restrictedCount > 0 }">
      <div class="flex justify-between items-center text-on-surface-variant">
        <span class="font-label-sm">{{ t('admin.operations.kpi.restrictedZones') }}</span>
        <span class="material-symbols-outlined text-sm" :class="{ 'text-security-alert': store.kpiSummary.restrictedCount > 0 }">block</span>
      </div>
      <div class="flex items-end gap-xs">
        <span class="font-display-md" :class="store.kpiSummary.restrictedCount > 0 ? 'text-security-alert' : 'text-primary'">{{ store.kpiSummary.restrictedCount }}</span>
        <span class="font-label-sm mb-xs text-on-surface-variant">Nodes</span>
      </div>
    </div>

    <!-- 추천 조치 -->
    <div class="glass-panel p-md rounded-xl flex flex-col justify-between h-28 border-white/5 overflow-hidden relative">
      <div class="flex justify-between items-center text-on-surface-variant z-10">
        <span class="font-label-sm">{{ t('admin.operations.kpi.recommendedActions') }}</span>
        <span class="material-symbols-outlined text-sm">smart_toy</span>
      </div>
      <div class="z-10 h-12 flex items-center">
        <p v-if="store.recommendedActions.length > 0" class="font-label-xs text-primary animate-pulse line-clamp-2">
          {{ t(store.recommendedActions[0].message) }}
        </p>
        <p v-else class="font-label-xs text-on-surface-variant">
          {{ t('admin.operations.noEvents') }}
        </p>
      </div>
      <div class="absolute -right-4 -bottom-4 opacity-5">
        <span class="material-symbols-outlined text-6xl text-primary">analytics</span>
      </div>
    </div>
  </div>
</template>
