<script setup>
import { useI18n } from 'vue-i18n'
import { useHotelManagement } from '../composables/useHotelManagement'

const { t, te } = useI18n()
const { checkInLogs, resetData } = useHotelManagement()

const getTypeClass = (type) => {
  if (type === 'duplicate') return 'text-rose-400 bg-rose-400/10 border-rose-400/20'
  if (type === 'checkOut') return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
  if (type === 'system') return 'text-slate-400 bg-white/5 border-white/10'
  return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' // checkIn
}

const formatMessage = (log) => {
  if (!log.message) return ''
  return te(log.message) ? t(log.message, log.params || {}) : log.message
}
</script>

<template>
  <div class="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden flex flex-col h-full">
    <div class="flex items-center justify-between mb-6 shrink-0">
      <div class="flex items-center gap-2">
        <div class="w-2 h-6 bg-slate-400 rounded-full"></div>
        <h3 class="text-lg font-bold text-white">{{ t('admin.hotel.checkInLog') }}</h3>
      </div>
      <button 
        @click="resetData"
        class="text-[10px] text-white/40 hover:text-rose-400 transition-colors flex items-center gap-1 font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10"
      >
        {{ t('admin.hotel.resetData') || 'Reset Data' }}
      </button>
    </div>

    <div class="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
      <div v-if="checkInLogs.length === 0" class="py-12 text-center text-white/10 text-sm italic">
        {{ t('admin.hotel.noLogs') || 'No logs available' }}
      </div>

      <div 
        v-for="log in checkInLogs" 
        :key="log.id"
        class="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
      >
        <div class="text-[10px] text-white/20 font-mono mt-1 whitespace-nowrap">
          {{ new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span :class="['px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider', getTypeClass(log.type)]">
              {{ log.type }}
            </span>
            <span class="text-white/80 text-xs font-medium leading-relaxed">{{ formatMessage(log) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
