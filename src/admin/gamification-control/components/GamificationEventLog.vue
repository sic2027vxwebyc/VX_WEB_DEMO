<script setup>
import { useI18n } from 'vue-i18n'
import { useGamificationControlStore } from '../stores/gamificationControlStore'

const { t, te } = useI18n()
const store = useGamificationControlStore()

const getStatusColor = (type) => {
  switch (type) {
    case 'quest': return 'text-primary'
    case 'inventory': return 'text-status-moderate'
    case 'warning': return 'text-security-alert'
    case 'system': return 'text-status-low'
    default: return 'text-on-surface-variant'
  }
}

const getIcon = (type) => {
  switch (type) {
    case 'quest': return 'assignment'
    case 'inventory': return 'inventory_2'
    case 'warning': return 'warning'
    case 'system': return 'settings'
    default: return 'event_note'
  }
}

const formatTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatMessage = (log) => {
  if (!log.message) return ''
  // i18n 키인 경우 번역, 아니면 원문 표시
  return te(log.message) ? t(log.message, log.params || {}) : log.message
}
</script>

<template>
  <div class="glass-panel rounded-xl flex flex-col h-full border-white/10 overflow-hidden">
    <div class="p-md border-b border-white/5 flex justify-between items-center bg-white/2">
      <h3 class="font-label-md text-on-surface flex items-center gap-xs">
        <span class="material-symbols-outlined text-sm text-primary">history</span>
        {{ t('admin.gamification.eventLog') }}
      </h3>
    </div>

    <div class="flex-1 overflow-y-auto p-md space-y-sm custom-scrollbar">
      <div v-for="log in store.eventLogs" :key="log.id" class="flex gap-sm p-sm rounded hover:bg-white/2 transition-colors border-l-2" :class="getStatusColor(log.type).replace('text-', 'border-')">
        <div class="flex-shrink-0 mt-1">
          <span class="material-symbols-outlined text-sm" :class="getStatusColor(log.type)">{{ getIcon(log.type) }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start gap-xs">
            <p class="font-label-xs text-on-surface leading-tight">{{ formatMessage(log) }}</p>
            <span class="text-[9px] text-on-surface-variant flex-shrink-0">{{ formatTime(log.timestamp) }}</span>
          </div>
        </div>
      </div>
      <div v-if="store.eventLogs.length === 0" class="h-32 flex flex-col items-center justify-center text-on-surface-variant opacity-20">
        <span class="material-symbols-outlined text-4xl">inbox</span>
        <p class="text-xs">{{ t('admin.gamification.noEvents') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>
