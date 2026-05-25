<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMealDistribution } from '../composables/useMealDistribution'
import { logger } from '@/utils/logger'

const { scanMockQr } = useMealDistribution()
const scope = 'MealQrScannerPanel'

const payloadInput = ref('meal-0001')
const scanResult = ref(null)
const videoRef = ref(null)
const streamRef = ref(null)

/**
 * 카메라 스트림 시작
 */
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      streamRef.value = stream
    }
    logger.info(scope, 'Meal QR 스캐너 카메라 활성화됨')
  } catch (error) {
    logger.error(scope, '카메라 접근 실패', error)
  }
}

/**
 * 카메라 스트림 중지
 */
const stopCamera = () => {
  if (streamRef.value) {
    streamRef.value.getTracks().forEach(track => track.stop())
    streamRef.value = null
  }
}

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  stopCamera()
})

const handleScan = () => {
  if (!payloadInput.value) return
  const result = scanMockQr(payloadInput.value)
  scanResult.value = result
}
</script>

<template>
  <div class="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col min-h-[400px]">
    <div class="flex items-center gap-2 mb-6 shrink-0">
      <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
      <h3 class="text-lg font-bold text-white">{{ $t('admin.meals.qrScanner') }}</h3>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center space-y-6 overflow-y-auto custom-scrollbar pr-1">
      <div class="relative w-40 h-40 border-2 border-dashed border-blue-500/50 rounded-3xl flex items-center justify-center bg-blue-500/5 group overflow-hidden shrink-0">
        <!-- 실제 카메라 화면 -->
        <video ref="videoRef" autoplay playsinline muted class="absolute inset-0 w-full h-full object-cover opacity-40"></video>
        
        <div class="absolute top-0 w-full h-[2px] bg-blue-400 shadow-[0_0_10px_#60A5FA] animate-scan z-10"></div>
        <span class="material-symbols-outlined text-5xl text-blue-500/20">qr_code_2</span>
      </div>

      <div class="w-full space-y-4">
        <div>
          <label class="block text-[10px] text-white/40 text-center uppercase tracking-widest font-black mb-2">Payload Simulation</label>
          <div class="flex gap-2">
            <input 
              v-model="payloadInput"
              @keyup.enter="handleScan"
              type="text" 
              class="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="예약 ID"
            />
            <button @click="handleScan" class="px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all text-xs uppercase">{{ $t('admin.meals.scanButton') }}</button>
          </div>
        </div>
        
        <div class="flex gap-2 justify-center shrink-0">
          <button @click="payloadInput = 'meal-0001'" class="text-[9px] px-2 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white/60 font-bold uppercase">#0001</button>
          <button @click="payloadInput = 'meal-0002'" class="text-[9px] px-2 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white/60 font-bold uppercase">#0002</button>
        </div>
      </div>

      <div v-if="scanResult && !scanResult.success" class="text-xs text-rose-400 font-bold bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20 w-full text-center">
        {{ scanResult.message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scan {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
.animate-scan {
  animation: scan 2s linear infinite;
}
</style>
