<script setup>
import { computed } from 'vue'
import { useHotelManagement } from '../composables/useHotelManagement'

const { kpiSummary } = useHotelManagement()

const cards = computed(() => [
  {
    id: 'total-rooms',
    labelKey: 'admin.hotel.kpi.totalRooms',
    value: kpiSummary.value.totalRooms,
    icon: 'meeting_room',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10'
  },
  {
    id: 'checked-in',
    labelKey: 'admin.hotel.status.checkedIn',
    value: kpiSummary.value.checkedInCount,
    icon: 'key',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10'
  },
  {
    id: 'checked-out',
    labelKey: 'admin.hotel.status.checkedOut',
    value: kpiSummary.value.checkedOutCount,
    icon: 'logout',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'no-show',
    labelKey: 'admin.hotel.kpi.noShow',
    value: kpiSummary.value.noShowCount,
    icon: 'person_off',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10'
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
        <span class="material-symbols-outlined" :class="card.color">{{ card.icon }}</span>
      </div>
      <div>
        <p class="text-[10px] text-white/40 mb-1 uppercase tracking-wider font-bold">{{ $t(card.labelKey) }}</p>
        <p class="text-xl md:text-2xl font-black text-white">{{ card.value }}</p>
      </div>
    </div>
  </div>
</template>
