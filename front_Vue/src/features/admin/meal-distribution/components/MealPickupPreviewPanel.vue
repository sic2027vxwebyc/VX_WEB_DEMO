<script setup>
import { ref } from 'vue'
import { useMealDistribution } from '../composables/useMealDistribution'

const { selectedReservation, completePickup } = useMealDistribution()
const isProcessing = ref(false)

const handleComplete = async () => {
  if (!selectedReservation.value) return
  isProcessing.value = true
  setTimeout(() => {
    completePickup(selectedReservation.value.id)
    isProcessing.value = false
  }, 500)
}
</script>

<template>
  <div class="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col min-h-[400px] h-full">
    <div class="flex items-center gap-2 mb-6 shrink-0">
      <div class="w-2 h-6 bg-amber-500 rounded-full"></div>
      <h3 class="text-lg font-bold text-white">{{ $t('admin.meals.pickupPreview') }}</h3>
    </div>

    <div v-if="!selectedReservation" class="flex-1 flex flex-col items-center justify-center text-white/20 space-y-4">
      <span class="material-symbols-outlined text-5xl opacity-10">info</span>
      <p class="text-sm font-medium">{{ $t('admin.meals.scanQrToPreview') }}</p>
    </div>

    <div v-else class="flex-1 flex flex-col overflow-y-auto custom-scrollbar pr-1">
      <!-- 중복 알림 -->
      <div v-if="selectedReservation.status === 'pickedUp'" class="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2">
        <p class="text-rose-400 font-black text-lg">{{ $t('admin.meals.duplicateDetected') }}</p>
        <p class="text-[10px] text-rose-400/60 uppercase font-bold">
          {{ new Date(selectedReservation.pickedUpAt).toLocaleString() }}
        </p>
      </div>

      <div class="space-y-4 flex-1">
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/5">
            <p class="text-[10px] text-white/30 uppercase font-black mb-1">{{ $t('admin.meals.fields.name') }}</p>
            <p class="text-white text-lg font-bold truncate">{{ selectedReservation.name }}</p>
          </div>
          <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)] text-center">
            <p class="text-[10px] text-emerald-400/60 uppercase font-black mb-1">{{ $t('admin.meals.fields.mealCount') }}</p>
            <p class="text-emerald-400 text-3xl font-black">{{ selectedReservation.mealCount }}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 rounded-xl bg-white/5 border border-white/5">
            <p class="text-[9px] text-white/30 uppercase font-black mb-0.5">{{ $t('admin.meals.fields.congregation') }}</p>
            <p class="text-white text-sm truncate">{{ selectedReservation.congregation }}</p>
          </div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/5">
            <p class="text-[9px] text-white/30 uppercase font-black mb-0.5">{{ $t('admin.meals.fields.nationality') }}</p>
            <p class="text-white text-sm truncate">{{ selectedReservation.nationality }}</p>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
          <span class="text-[9px] text-white/30 uppercase font-black">{{ $t('admin.meals.fields.reservationId') }}</span>
          <span class="text-white/40 text-[10px] font-mono tracking-tighter">{{ selectedReservation.id }}</span>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-white/5 shrink-0">
        <button 
          v-if="selectedReservation.status === 'reserved'"
          @click="handleComplete"
          :disabled="isProcessing"
          class="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          <span v-if="isProcessing" class="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ $t('admin.meals.completePickup') }}
        </button>
        <div v-else class="py-4 text-center bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
          <p class="text-emerald-400 font-black tracking-widest uppercase italic">{{ $t('admin.meals.collectionVerified') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
