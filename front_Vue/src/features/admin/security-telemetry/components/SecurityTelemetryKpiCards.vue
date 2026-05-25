<script setup>
import { computed } from 'vue'
import { useSecurityTelemetry } from '../composables/useSecurityTelemetry'

const { kpiSummary } = useSecurityTelemetry()

const cards = computed(() => [
  {
    id: 'total-devices',
    labelKey: 'admin.security.kpi.totalDevices',
    value: kpiSummary.value.totalDevices,
    icon: 'Monitor',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'offline-devices',
    labelKey: 'admin.security.kpi.offlineDevices',
    value: kpiSummary.value.offlineDevices,
    icon: 'WifiOff',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10'
  },
  {
    id: 'critical-events',
    labelKey: 'admin.security.kpi.criticalEvents',
    value: kpiSummary.value.criticalEvents,
    icon: 'ShieldAlert',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10'
  },
  {
    id: 'new-logs',
    labelKey: 'admin.security.kpi.newSecurityLogs',
    value: kpiSummary.value.newSecurityLogs,
    icon: 'Activity',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10'
  }
])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div 
      v-for="card in cards" 
      :key="card.id"
      class="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-4 group hover:border-white/20 transition-all"
    >
      <div :class="['p-3 rounded-xl transition-transform group-hover:scale-110', card.bgColor]">
        <div :class="['w-6 h-6', card.color]">
          <svg v-if="card.icon === 'Monitor'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <svg v-else-if="card.icon === 'WifiOff'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0119 12.55"/><path d="M5 12.55a10.94 10.94 0 015.17-2.39"/><path d="M10.71 5.05A16 16 0 0122.58 9"/><path d="M1.42 9a15.91 15.91 0 014.7-2.88"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
          <svg v-else-if="card.icon === 'ShieldAlert'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <svg v-else-if="card.icon === 'Activity'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
      </div>
      <div>
        <p class="text-xs text-white/40 mb-1 uppercase tracking-wider font-bold">{{ $t(card.labelKey) }}</p>
        <p class="text-2xl font-black text-white">{{ card.value }}</p>
      </div>
    </div>
  </div>
</template>
