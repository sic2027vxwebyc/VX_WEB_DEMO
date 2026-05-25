<script setup>
import { computed } from 'vue'
import { useNotificationControl } from '../composables/useNotificationControl'

const { kpiSummary } = useNotificationControl()

const cards = computed(() => [
  {
    id: 'active-tickers',
    labelKey: 'admin.notifications.kpi.activeTickers',
    value: kpiSummary.value.activeTickersCount,
    icon: 'AlertTriangle',
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10'
  },
  {
    id: 'sent-notifications',
    labelKey: 'admin.notifications.kpi.sentNotifications',
    value: kpiSummary.value.sentNotificationsCount,
    icon: 'Send',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'total-logs',
    labelKey: 'admin.notifications.kpi.totalLogs',
    value: kpiSummary.value.totalLogs,
    icon: 'List',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  }
])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div 
      v-for="card in cards" 
      :key="card.id"
      class="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-4"
    >
      <div :class="['p-3 rounded-xl', card.bgColor]">
        <!-- Simple Icon Placeholder -->
        <div :class="['w-6 h-6', card.color]">
          <svg v-if="card.icon === 'AlertTriangle'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" /></svg>
          <svg v-else-if="card.icon === 'Send'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          <svg v-else-if="card.icon === 'List'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
        </div>
      </div>
      <div>
        <p class="text-sm text-white/60">{{ $t(card.labelKey) }}</p>
        <p class="text-2xl font-bold text-white">{{ card.value }}</p>
      </div>
    </div>
  </div>
</template>
