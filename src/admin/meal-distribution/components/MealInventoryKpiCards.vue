<script setup>
import { computed } from 'vue'
import { useMealDistribution } from '../composables/useMealDistribution'

const { kpiSummary } = useMealDistribution()

const cards = computed(() => [
  {
    id: 'total-stock',
    labelKey: 'admin.meals.kpi.totalStock',
    value: kpiSummary.value.totalStock,
    icon: 'Package',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'reserved',
    labelKey: 'admin.meals.kpi.reservedCount',
    value: kpiSummary.value.reservedCount,
    icon: 'Ticket',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10'
  },
  {
    id: 'picked-up',
    labelKey: 'admin.meals.kpi.pickedUpCount',
    value: kpiSummary.value.pickedUpCount,
    icon: 'CheckCircle',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10'
  },
  {
    id: 'remaining',
    labelKey: 'admin.meals.kpi.remainingCount',
    value: kpiSummary.value.remainingCount,
    icon: 'Box',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10'
  }
])
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div 
      v-for="card in cards" 
      :key="card.id"
      class="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-4 group hover:border-white/20 transition-all"
    >
      <div :class="['p-3 rounded-xl transition-transform group-hover:scale-110', card.bgColor]">
        <div :class="['w-6 h-6', card.color]">
          <svg v-if="card.icon === 'Package'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          <svg v-else-if="card.icon === 'Ticket'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
          <svg v-else-if="card.icon === 'CheckCircle'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <svg v-else-if="card.icon === 'Box'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        </div>
      </div>
      <div>
        <p class="text-[10px] text-white/40 mb-1 uppercase tracking-wider font-bold">{{ $t(card.labelKey) }}</p>
        <p class="text-xl md:text-2xl font-black text-white">{{ card.value }}</p>
      </div>
    </div>
  </div>
</template>
