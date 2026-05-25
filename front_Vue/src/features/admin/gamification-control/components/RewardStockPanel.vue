<script setup>
import { useI18n } from 'vue-i18n'
import { useGamificationControlStore } from '../stores/gamificationControlStore'

const { t } = useI18n()
const store = useGamificationControlStore()

const getStatusBadge = (status) => {
  switch (status) {
    case 'available': return 'bg-status-low/20 text-status-low border-status-low/30'
    case 'low': return 'bg-status-moderate/20 text-status-moderate border-status-moderate/30'
    case 'soldOut': return 'bg-security-alert/20 text-security-alert border-security-alert/30'
    default: return 'bg-white/10 text-on-surface-variant'
  }
}
</script>

<template>
  <div class="glass-panel p-md rounded-xl border-white/10 h-full flex flex-col">
    <div class="flex items-center justify-between mb-lg">
      <h3 class="font-label-md text-on-surface flex items-center gap-xs">
        <span class="material-symbols-outlined text-sm text-primary">inventory</span>
        {{ t('admin.gamification.rewardStock') }}
      </h3>
    </div>

    <div class="space-y-md flex-1 overflow-y-auto pr-sm custom-scrollbar">
      <div v-for="reward in store.rewardStocks" :key="reward.id" class="p-lg bg-white/2 border border-white/5 rounded-2xl flex flex-col gap-md mb-2">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-md">
            <span class="text-2xl">{{ reward.icon }}</span>
            <div>
              <p class="font-label-lg text-on-surface line-clamp-1">{{ t(reward.nameKey) }}</p>
              <div class="flex items-center gap-sm mt-1">
                <span class="px-xs py-0.5 rounded text-[8px] border font-bold uppercase" :class="getStatusBadge(reward.status)">
                  {{ t('admin.gamification.rewardStatus.' + reward.status) }}
                </span>
                <span class="text-[10px] text-on-surface-variant">{{ t('admin.gamification.rewards.id') }}: {{ reward.id }}</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs text-on-surface-variant">{{ reward.remainingStock }} / {{ reward.totalStock }}</p>
            <p class="text-[9px] text-on-surface-variant opacity-50 uppercase tracking-tighter">{{ t('admin.gamification.rewards.stockUnits') }}</p>
          </div>
        </div>

        <!-- Stock Bar -->
        <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div class="h-full transition-all duration-1000" 
               :class="reward.status === 'soldOut' ? 'bg-security-alert' : reward.status === 'low' ? 'bg-status-moderate' : 'bg-primary'"
               :style="{ width: (reward.remainingStock / reward.totalStock * 100) + '%' }"></div>
        </div>

        <!-- Controls -->
        <div class="flex justify-end gap-sm mt-xs">
          <button @click="store.adjustRewardStock(reward.id, -10)" class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all">-10</button>
          <button @click="store.adjustRewardStock(reward.id, -1)" class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all">-1</button>
          <button @click="store.adjustRewardStock(reward.id, 1)" class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all">+1</button>
          <button @click="store.adjustRewardStock(reward.id, 10)" class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all">+10</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>
