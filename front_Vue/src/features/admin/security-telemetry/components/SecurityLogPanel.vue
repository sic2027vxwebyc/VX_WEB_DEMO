<script setup>
import { useSecurityTelemetry } from '../composables/useSecurityTelemetry'

const { securityLogs, selectedSecurityLogId } = useSecurityTelemetry()

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    case 'high': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'new': return 'bg-rose-500'
    case 'reviewing': return 'bg-blue-500'
    case 'resolved': return 'bg-emerald-500'
    default: return 'bg-white/20'
  }
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 h-full flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <div class="w-2 h-6 bg-rose-500 rounded-full"></div>
        <h3 class="text-lg font-bold text-white">{{ $t('admin.security.securityLogs') }}</h3>
      </div>
      <span class="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/40 font-mono">LIVE</span>
    </div>

    <div class="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
      <div 
        v-for="log in securityLogs" 
        :key="log.id"
        @click="selectedSecurityLogId = log.id"
        :class="[
          'p-4 rounded-xl border transition-all cursor-pointer group',
          selectedSecurityLogId === log.id 
            ? 'bg-white/10 border-white/30 shadow-lg' 
            : 'bg-white/5 border-white/5 hover:border-white/20'
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <span :class="['px-2 py-0.5 rounded text-[9px] font-bold border uppercase', getSeverityColor(log.severity)]">
            {{ $t(`admin.security.severity.${log.severity}`) }}
          </span>
          <div class="flex items-center gap-2">
            <div :class="['w-1.5 h-1.5 rounded-full', getStatusColor(log.status)]"></div>
            <span class="text-[10px] text-white/40">{{ new Date(log.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
          </div>
        </div>
        
        <p class="text-white text-sm font-medium mb-1 truncate">{{ log.id }}</p>
        <p class="text-white/60 text-xs line-clamp-1 italic">
          {{ log.messageKey.startsWith('admin.') ? $t(log.messageKey) : log.messageKey }}
        </p>
      </div>
    </div>
  </div>
</template>
