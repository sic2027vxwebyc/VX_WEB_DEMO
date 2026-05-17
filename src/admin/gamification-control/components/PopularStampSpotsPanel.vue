<script setup>
import { useI18n } from 'vue-i18n'
import { useGamificationControlStore } from '../stores/gamificationControlStore'

const { t } = useI18n()
const store = useGamificationControlStore()
</script>

<template>
  <div class="glass-panel p-md rounded-xl border-white/10 h-full">
    <h3 class="font-label-md text-on-surface flex items-center gap-xs mb-lg">
      <span class="material-symbols-outlined text-sm text-primary">local_fire_department</span>
      Most Popular Spots
    </h3>

    <div class="space-y-md">
      <div v-for="(spot, index) in store.popularStampSpots" :key="spot.id" class="flex items-center gap-md p-sm rounded-lg hover:bg-white/2 transition-colors">
        <div class="w-6 h-6 rounded bg-primary/20 flex items-center justify-center font-black text-[10px] text-primary">#{{ index + 1 }}</div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center mb-1">
            <span class="font-label-sm text-on-surface line-clamp-1">{{ t(spot.nameKey) }}</span>
            <span class="text-[10px] text-on-surface-variant font-bold">{{ spot.visitCount.toLocaleString() }}</span>
          </div>
          <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-primary/60" :style="{ width: (spot.visitCount / store.popularStampSpots[0].visitCount * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
