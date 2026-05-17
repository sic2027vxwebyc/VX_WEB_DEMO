<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGamificationControlStore } from '../stores/gamificationControlStore'
import { logger } from '@/utils/logger'

const { t } = useI18n()
const store = useGamificationControlStore()
const scope = 'AdminQrScannerPanel'

const selectedSpotId = ref('')
const isScanning = ref(false)
const scanSuccess = ref(false)
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
    logger.info(scope, 'Admin QR 스캐너 카메라 활성화됨')
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
  if (!selectedSpotId.value) return
  
  isScanning.value = true
  scanSuccess.value = false
  
  // 스캔 애니메이션 시뮬레이션 (1.5초)
  setTimeout(() => {
    isScanning.value = false
    const spot = store.stampSpotsList.find(s => s.id === selectedSpotId.value)
    const spotName = spot ? t(spot.nameKey) : selectedSpotId.value
    
    store.addEventLog('admin.gamification.logs.scannerSuccess', 'system', { spot: spotName, id: selectedSpotId.value })
    
    // 스토어 통계 소폭 업데이트 (시뮬레이션)
    store.stampStats.totalParticipants += 1
    
    scanSuccess.value = true
    setTimeout(() => {
      scanSuccess.value = false
    }, 2000)
  }, 1500)
}
</script>

<template>
  <div class="glass-panel p-md rounded-xl border-white/10 flex flex-col h-full">
    <h3 class="font-label-md text-on-surface flex items-center gap-xs mb-lg">
      <span class="material-symbols-outlined text-sm text-primary">qr_code_scanner</span>
      {{ t('admin.gamification.scanner.title') }}
    </h3>

    <div class="flex-1 flex flex-col gap-lg">
      <!-- Scanner Viewfinder Simulation -->
      <div class="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 group">
        <!-- 실제 카메라 화면 -->
        <video ref="videoRef" autoplay playsinline muted class="absolute inset-0 w-full h-full object-cover opacity-60"></video>
        
        <!-- Grid Background -->
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 2px 2px, rgba(0, 219, 233, 0.5) 1px, transparent 0); background-size: 20px 20px;"></div>
        
        <!-- Scan Line -->
        <div v-if="isScanning" class="absolute left-0 w-full h-0.5 bg-primary shadow-[0_0_15px_rgba(0,219,233,0.8)] z-10 animate-scan"></div>
        
        <!-- Success Overlay -->
        <div v-if="scanSuccess" class="absolute inset-0 bg-status-low/20 flex items-center justify-center z-20 animate-in fade-in">
          <span class="material-symbols-outlined text-status-low text-6xl drop-shadow-lg">check_circle</span>
        </div>

        <!-- Placeholder Icon -->
        <div class="absolute inset-0 flex items-center justify-center opacity-40">
          <span class="material-symbols-outlined text-6xl text-white" :class="{ 'animate-pulse': isScanning }">qr_code_2</span>
        </div>

        <!-- Corner Accents -->
        <div class="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary/50"></div>
        <div class="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary/50"></div>
        <div class="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary/50"></div>
        <div class="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary/50"></div>
      </div>

      <!-- Controls -->
      <div class="space-y-md">
        <div class="space-y-xs">
          <label class="text-[10px] text-on-surface-variant uppercase tracking-widest">{{ t('admin.gamification.scanner.selectSpot') }}</label>
          <select v-model="selectedSpotId" :disabled="isScanning" class="w-full bg-surface-dark border border-white/10 rounded-lg px-md py-sm text-sm outline-none focus:border-primary transition-all">
            <option value="">-- Select QR Spot --</option>
            <option v-for="spot in store.stampSpotsList" :key="spot.id" :value="spot.id">{{ t(spot.nameKey) }}</option>
          </select>
        </div>

        <button @click="handleScan" :disabled="!selectedSpotId || isScanning" 
                class="w-full bg-primary text-on-primary py-sm rounded-lg font-label-md shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-sm">{{ isScanning ? 'sync' : 'sensors' }}</span>
          {{ isScanning ? t('admin.gamification.scanner.scanning') : t('admin.gamification.scanner.action') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}
.animate-scan {
  animation: scan 2s linear infinite;
}
</style>
