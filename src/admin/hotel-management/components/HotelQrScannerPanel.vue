<script setup>
import { ref } from 'vue'
import { useHotelManagement } from '../composables/useHotelManagement'

const { scanQr, completeCheckIn, completeCheckOut, selectedReservation } = useHotelManagement()

const payloadInput = ref('hotel-res-0001')
const isProcessing = ref(false)

const handleScan = () => {
  if (!payloadInput.value) return
  scanQr(payloadInput.value)
}

const handleCheckIn = async () => {
  if (!selectedReservation.value) return
  isProcessing.value = true
  setTimeout(() => {
    completeCheckIn(selectedReservation.value.id)
    isProcessing.value = false
  }, 600)
}

const handleCheckOut = async () => {
  if (!selectedReservation.value) return
  isProcessing.value = true
  setTimeout(() => {
    completeCheckOut(selectedReservation.value.id)
    isProcessing.value = false
  }, 600)
}
</script>

<template>
  <div class="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 h-full flex flex-col">
    <div class="flex items-center gap-2 mb-6 shrink-0">
      <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
      <h3 class="text-lg font-bold text-white">{{ $t('admin.hotel.qrScanner') }}</h3>
    </div>

    <div class="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
      <div class="relative w-full aspect-square max-w-[160px] mx-auto border-2 border-dashed border-blue-500/30 rounded-3xl flex items-center justify-center bg-blue-500/5 group overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="absolute top-0 w-full h-[2px] bg-blue-400 shadow-[0_0_15px_#60A5FA] animate-scan-slow"></div>
        <span class="material-symbols-outlined text-4xl text-blue-500/20">qr_code_2</span>
      </div>

      <div class="space-y-4">
        <div>
          <div class="flex gap-2">
            <input 
              v-model="payloadInput"
              type="text" 
              class="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Reservation ID"
              @keyup.enter="handleScan"
            />
            <button @click="handleScan" class="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all text-xs">
              SCAN
            </button>
          </div>
        </div>

        <div v-if="selectedReservation" class="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-4">
          <div v-if="selectedReservation.status === 'duplicate'" class="flex items-center gap-2 text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 justify-center">
            <span class="text-[10px] font-bold uppercase">{{ $t('admin.hotel.duplicateCheckIn') }}</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-[9px] text-white/30 uppercase font-bold">{{ $t('admin.hotel.fields.name') }}</p>
              <p class="text-white font-bold text-sm truncate">{{ selectedReservation.name }}</p>
            </div>
            <div>
              <p class="text-[9px] text-white/30 uppercase font-bold">{{ $t('admin.hotel.fields.nationality') }}</p>
              <p class="text-white text-xs truncate">{{ selectedReservation.nationality }}</p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-white/10">
            <!-- 체크인 버튼 (예약 완료 상태일 때) -->
            <button 
              v-if="selectedReservation.status === 'reserved'"
              @click="handleCheckIn"
              :disabled="isProcessing"
              class="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <span v-if="isProcessing" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ $t('admin.hotel.completeCheckIn') }}
            </button>

            <!-- 체크아웃 버튼 (입실 완료 상태일 때) -->
            <button 
              v-else-if="selectedReservation.status === 'checkedIn'"
              @click="handleCheckOut"
              :disabled="isProcessing"
              class="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-black text-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span v-if="isProcessing" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ $t('admin.hotel.completeCheckOut') || '체크아웃 처리' }}
            </button>
            
            <div v-else class="py-3 text-center bg-white/5 rounded-xl border border-white/10">
              <p class="text-white/40 font-bold text-sm uppercase tracking-widest">{{ $t(`admin.hotel.status.${selectedReservation.status}`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scan-slow {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
.animate-scan-slow {
  animation: scan-slow 3s linear infinite;
}
</style>
