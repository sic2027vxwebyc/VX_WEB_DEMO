<script setup>
import { useHotelManagement } from '../composables/useHotelManagement'

const { hotels } = useHotelManagement()

const getProgressColor = (percent) => {
  if (percent > 90) return 'bg-rose-500'
  if (percent > 70) return 'bg-amber-500'
  return 'bg-emerald-500'
}
</script>

<template>
  <div class="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 h-full flex flex-col">
    <div class="flex items-center gap-2 mb-6 shrink-0">
      <div class="w-2 h-6 bg-indigo-500 rounded-full"></div>
      <h3 class="text-lg font-bold text-white">{{ $t('admin.hotel.inventoryStatus') }}</h3>
    </div>

    <div class="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
      <div v-for="hotel in hotels" :key="hotel.id" class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 group hover:bg-white/10 transition-all">
        <div class="flex justify-between items-start">
          <div class="max-w-[70%]">
            <h4 class="text-white font-bold text-sm truncate">{{ hotel.name }}</h4>
            <p class="text-[10px] text-white/40 uppercase tracking-tighter truncate">{{ hotel.location }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-[11px] text-white/60 font-mono">{{ hotel.occupancy.checkedIn }} / {{ hotel.totalRooms }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-[9px] text-white/40 font-bold uppercase">
            <span>Live Occupancy</span>
            <span>{{ Math.round((hotel.occupancy.checkedIn / hotel.totalRooms) * 100) }}%</span>
          </div>
          <div class="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              class="h-full transition-all duration-1000" 
              :class="getProgressColor((hotel.occupancy.checkedIn / hotel.totalRooms) * 100)"
              :style="{ width: `${(hotel.occupancy.checkedIn / hotel.totalRooms) * 100}%` }"
            ></div>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-2">
          <div class="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-center">
            <p class="text-[7px] text-emerald-400/60 uppercase font-bold">In</p>
            <p class="text-emerald-400 font-black text-xs">{{ hotel.occupancy.checkedIn }}</p>
          </div>
          <div class="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-center">
            <p class="text-[7px] text-blue-400/60 uppercase font-bold">Avail</p>
            <p class="text-blue-400 font-black text-xs">{{ hotel.occupancy.available }}</p>
          </div>
          <div class="p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 text-center">
            <p class="text-[7px] text-amber-400/60 uppercase font-bold">Resv</p>
            <p class="text-amber-400 font-black text-xs">{{ hotel.occupancy.reserved }}</p>
          </div>
          <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/10 text-center">
            <p class="text-[7px] text-white/40 uppercase font-bold">Out</p>
            <p class="text-white/60 font-black text-xs">{{ hotel.occupancy.checkedOut || 0 }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
