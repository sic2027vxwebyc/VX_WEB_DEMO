<script setup>
import { useMealDistribution } from '../composables/useMealDistribution'

const { filteredReservations } = useMealDistribution()

const getStatusColor = (status) => {
  switch (status) {
    case 'reserved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'pickedUp': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'cancelled': return 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    default: return 'bg-white/10 text-white/40 border-white/10'
  }
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col h-full overflow-hidden">
    <div class="flex items-center gap-2 mb-6 shrink-0">
      <div class="w-2 h-6 bg-indigo-500 rounded-full"></div>
      <h3 class="text-lg font-bold text-white">{{ $t('admin.meals.reservationList') }}</h3>
    </div>

    <div class="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr class="text-[10px] text-white/40 uppercase tracking-widest border-b border-white/10">
            <th class="py-3 px-2 font-bold">{{ $t('admin.meals.fields.reservationId') }}</th>
            <th class="py-3 px-2 font-bold">{{ $t('admin.meals.fields.name') }}</th>
            <th class="py-3 px-2 font-bold">{{ $t('admin.meals.fields.congregation') }} / {{ $t('admin.meals.fields.nationality') }}</th>
            <th class="py-3 px-2 text-center font-bold">{{ $t('admin.meals.fields.mealCount') }}</th>
            <th class="py-3 px-2 text-center font-bold">{{ $t('admin.meals.fields.status') }}</th>
            <th class="py-3 px-2 text-right font-bold">{{ $t('admin.meals.fields.pickedUpAt') }}</th>
          </tr>
        </thead>
        <tbody class="text-sm text-white/80 divide-y divide-white/5">
          <tr v-for="res in filteredReservations" :key="res.id" class="hover:bg-white/5 transition-colors">
            <td class="py-3 px-2 font-mono text-[11px] text-white/40">{{ res.id }}</td>
            <td class="py-3 px-2 font-bold">{{ res.name }}</td>
            <td class="py-3 px-2 text-xs text-white/60">{{ res.congregation }} <span class="text-white/20 mx-1">|</span> {{ res.nationality }}</td>
            <td class="py-3 px-2 text-center font-black text-emerald-400">{{ res.mealCount }}</td>
            <td class="py-3 px-2 text-center">
              <span :class="['px-2 py-0.5 rounded text-[10px] font-bold border', getStatusColor(res.status)]">
                {{ $t(`admin.meals.status.${res.status}`) }}
              </span>
            </td>
            <td class="py-3 px-2 text-right text-xs text-white/40 font-mono">
              {{ res.pickedUpAt ? new Date(res.pickedUpAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-' }}
            </td>
          </tr>
          <tr v-if="filteredReservations.length === 0">
            <td colspan="6" class="py-12 text-center text-white/20">{{ $t('admin.meals.noReservations') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
