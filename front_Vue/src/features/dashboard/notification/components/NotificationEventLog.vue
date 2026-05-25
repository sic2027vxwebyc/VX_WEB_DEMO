<script setup>
import { useI18n } from 'vue-i18n'
import { useNotificationControl } from '../composables/useNotificationControl'

const { t, te } = useI18n()
const { eventLogs, resetData } = useNotificationControl()

const getTypeClass = (type) => {
  switch (type) {
    case 'emergency': return 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    case 'system': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    default: return 'bg-white/10 text-white/60 border-white/10'
  }
}

// i18n 키인지 확인하여 번역하거나 원문 표시
const formatMessage = (log) => {
  if (!log.message) return ''
  // 만약 키가 존재하면 파라미터와 함께 번역, 아니면 원문 표시
  return te(log.message) ? t(log.message, log.params || {}) : log.message
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
        <h3 class="text-lg font-bold text-white">{{ $t('admin.notifications.eventLog') }}</h3>
      </div>
      <button 
        @click="resetData"
        class="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5"
      >
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
        {{ $t('admin.notifications.resetData') }}
      </button>
    </div>

    <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      <div v-if="eventLogs.length === 0" class="py-12 text-center text-white/20 text-sm">
        {{ $t('admin.notifications.noLogs') }}
      </div>

      <div 
        v-for="log in eventLogs" 
        :key="log.id"
        class="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
      >
        <div class="text-[10px] text-white/30 font-mono mt-1 whitespace-nowrap">
          {{ new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span :class="['px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase', getTypeClass(log.type)]">
              {{ log.type }}
            </span>
            <span class="text-white/80 text-sm">{{ formatMessage(log) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
