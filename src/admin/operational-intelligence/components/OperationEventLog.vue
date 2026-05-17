<script setup>
import { useI18n } from 'vue-i18n'
import { useOperationalIntelligenceStore } from '../stores/operationalIntelligenceStore'

const { t, te } = useI18n()
const store = useOperationalIntelligenceStore()

const getIcon = (type) => {
  switch (type) {
    case 'warning': return 'warning'
    case 'config': return 'settings'
    case 'system': return 'info'
    default: return 'event_note'
  }
}

const getTypeColor = (type) => {
  switch (type) {
    case 'warning': return 'text-security-alert'
    case 'config': return 'text-primary'
    case 'system': return 'text-status-low'
    default: return 'text-on-surface-variant'
  }
}

const formatTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const formatMessage = (log) => {
  if (!log.message) return ''
  return te(log.message) ? t(log.message, log.params || {}) : log.message
}
</script>

<template>
  <div class="glass-panel rounded-xl flex flex-col h-full border-white/10 overflow-hidden">
    <div class="p-md border-b border-white/5 flex justify-between items-center bg-white/2">
      <h3 class="font-label-md text-on-surface flex items-center gap-xs">
        <span class="material-symbols-outlined text-sm">history</span>
        {{ t('admin.operations.eventLog') }}
      </h3>
      <span class="text-[10px] text-on-surface-variant opacity-50 uppercase tracking-tighter">{{ t('admin.operations.realTimeStream') }}</span>
    </div>

    <div class="flex-1 overflow-y-auto p-md space-y-sm custom-scrollbar">
      <div v-if="store.eventLogs.length === 0" class="h-full flex flex-col items-center justify-center text-on-surface-variant py-lg">
        <span class="material-symbols-outlined text-4xl mb-sm opacity-20">inventory_2</span>
        <p class="font-label-sm">{{ t('admin.operations.noEvents') }}</p>
      </div>

      <div v-for="log in store.eventLogs" :key="log.id" class="flex gap-sm p-sm rounded hover:bg-white/2 transition-colors border-l-2" :class="getTypeColor(log.type).replace('text-', 'border-')">
        <div class="flex-shrink-0 mt-1">
          <span class="material-symbols-outlined text-sm" :class="getTypeColor(log.type)">{{ getIcon(log.type) }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start gap-xs">
            <p class="font-label-xs text-on-surface leading-tight">{{ formatMessage(log) }}</p>
            <span class="text-[9px] text-on-surface-variant flex-shrink-0">{{ formatTime(log.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>