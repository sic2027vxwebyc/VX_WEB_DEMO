<script setup>
import { useHotelManagement } from '../composables/useHotelManagement'

const { reservations, selectReservation } = useHotelManagement()

const getStatusClass = (status) => {
  switch (status) {
    case 'checkedIn': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'checkedOut': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'reserved': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
    case 'noShow': return 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    default: return 'bg-white/10 text-white/40 border-white/10'
  }
}
</script>

<template>
  <div class="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col h-full overflow-hidden">
    <div class="flex items-center gap-2 mb-6 shrink-0">
      <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
      <h3 class="text-lg font-bold text-white">{{ $t('admin.hotel.reservationList') }}</h3>
    </div>

    <div class="flex-1 overflow-auto custom-scrollbar">
      <table class="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr class="text-[10px] text-white/40 uppercase tracking-widest border-b border-white/10">
            <th class="py-3 px-4 font-bold">{{ $t('admin.hotel.fields.hotel') }}</th>
            <th class="py-3 px-4 font-bold">{{ $t('admin.hotel.fields.room') }}</th>
            <th class="py-3 px-4 font-bold">{{ $t('admin.hotel.fields.name') }}</th>
            <th class="py-3 px-4 font-bold text-center">{{ $t('admin.hotel.fields.guests') }}</th>
            <th class="py-3 px-4 text-center font-bold">{{ $t('admin.hotel.fields.status') }}</th>
            <th class="py-3 px-4 text-right font-bold">{{ $t('admin.hotel.fields.checkInTime') }}</th>
          </tr>
        </thead>
        <tbody class="text-sm text-white/80 divide-y divide-white/5">
          <tr 
            v-for="res in reservations" 
            :key="res.id" 
            class="hover:bg-white/5 transition-colors cursor-pointer group"
            @click="selectReservation(res.id)"
          >
            <td class="py-4 px-4 font-bold">{{ res.hotelName }}</td>
            <td class="py-4 px-4 font-mono text-white/60 text-xs">{{ res.roomNumber }}호</td>
            <td class="py-4 px-4">
              <p class="font-bold">{{ res.name }}</p>
              <p class="text-[10px] text-white/20">{{ res.congregation }}</p>
            </td>
            <td class="py-4 px-4 text-center font-black text-indigo-400">{{ res.guestCount }}</td>
            <td class="py-4 px-4 text-center">
              <span :class="['px-2 py-0.5 rounded text-[9px] font-bold border uppercase', getStatusClass(res.status)]">
                {{ $t(`admin.hotel.status.${res.status}`) }}
              </span>
            </td>
            <td class="py-4 px-4 text-right text-xs text-white/40 font-mono">
              <div v-if="res.checkedInAt">
                <p>IN: {{ new Date(res.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
                <p v-if="res.checkedOutAt" class="text-blue-400">OUT: {{ new Date(res.checkedOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
              </div>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
