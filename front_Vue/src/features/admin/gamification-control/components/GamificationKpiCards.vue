<script setup>
import { useI18n } from 'vue-i18n'
import { useGamificationControlStore } from '../stores/gamificationControlStore'

const { t } = useI18n()
const store = useGamificationControlStore()
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
    <div class="glass-panel p-md rounded-xl flex flex-col justify-between h-28 border-white/5">
      <div class="flex justify-between items-center text-on-surface-variant">
        <span class="font-label-sm">{{ t('admin.gamification.kpi.totalParticipants') }}</span>
        <span class="material-symbols-outlined text-sm text-primary">groups</span>
      </div>
      <div class="flex items-end gap-xs">
        <span class="font-display-md text-primary">{{ store.kpiSummary.totalParticipants.toLocaleString() }}</span>
        <span class="font-label-sm mb-xs text-on-surface-variant">Users</span>
      </div>
    </div>

    <div class="glass-panel p-md rounded-xl flex flex-col justify-between h-28 border-white/5">
      <div class="flex justify-between items-center text-on-surface-variant">
        <span class="font-label-sm">{{ t('admin.gamification.kpi.averageStampCount') }}</span>
        <span class="material-symbols-outlined text-sm text-primary">auto_awesome</span>
      </div>
      <div class="flex items-end gap-xs">
        <span class="font-display-md text-primary">{{ store.kpiSummary.averageStampCount }}</span>
        <span class="font-label-sm mb-xs text-on-surface-variant">Avg</span>
      </div>
    </div>

    <div class="glass-panel p-md rounded-xl flex flex-col justify-between h-28 border-white/5">
      <div class="flex justify-between items-center text-on-surface-variant">
        <span class="font-label-sm">{{ t('admin.gamification.kpi.completedParticipants') }}</span>
        <span class="material-symbols-outlined text-sm text-status-low">verified</span>
      </div>
      <div class="flex items-end gap-xs">
        <span class="font-display-md text-status-low">{{ store.kpiSummary.completedParticipants.toLocaleString() }}</span>
        <span class="font-label-sm mb-xs text-on-surface-variant">Finishers</span>
      </div>
    </div>

    <div class="glass-panel p-md rounded-xl flex flex-col justify-between h-28 border-white/5 relative overflow-hidden">
      <div class="flex justify-between items-center text-on-surface-variant z-10">
        <span class="font-label-sm">{{ t('admin.gamification.kpi.completionRate') }}</span>
        <span class="material-symbols-outlined text-sm text-primary">trending_up</span>
      </div>
      <div class="z-10 flex items-end gap-xs">
        <span class="font-display-md text-primary">{{ store.kpiSummary.completionRate }}%</span>
      </div>
      <div class="absolute bottom-0 left-0 h-1 bg-primary/30" :style="{ width: store.kpiSummary.completionRate + '%' }"></div>
    </div>
  </div>
</template>
