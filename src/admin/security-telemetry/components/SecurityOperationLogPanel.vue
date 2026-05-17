<script setup>
import { useI18n } from 'vue-i18n'
import { useSecurityTelemetry } from '../composables/useSecurityTelemetry'

const { t, te } = useI18n()
const { operationLogs, resetData } = useSecurityTelemetry()

const getTypeClass = (type) => {
  switch (type) {
    case 'security': return 'text-rose-400 bg-rose-400/10 border-rose-400/20'
    case 'system': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    default: return 'text-white/40 bg-white/5 border-white/10'
  }
}

const formatMessage = (log) => {
  if (!log.message) return ''
  return te(log.message) ? t(log.message, log.params || {}) : log.message
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
        <h3 class="text-lg font-bold text-white">{{ t('admin.security.operationLog') }}</h3>
      </div>
      <button 
        @click="resetData"
        class="text-[10px] text-white/40 hover:text-rose-400 transition-colors flex items-center gap-1 font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10"
      >
        {{ t('admin.security.resetData') }}
      </button>
    </div>

    <div class="space-y-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
      <div v-if="operationLogs.length === 0" class="py-12 text-center text-white/10 text-sm italic">
        {{ t('admin.security.noLogs') }}
      </div>

      <div 
        v-for="log in operationLogs" 
        :key="log.id"
        class="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
      >
        <div class="text-[10px] text-white/20 font-mono mt-1 whitespace-nowrap">
          {{ new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span :class="['px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase', getTypeClass(log.type)]">
              {{ log.type }}
            </span>
            <span class="text-white/80 text-xs font-medium">{{ formatMessage(log) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
