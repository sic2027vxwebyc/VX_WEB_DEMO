<script setup>
/**
 * [ QR 스캐너 목업 ]
 * 실제 카메라 연동 없이 QR 스캔 UX를 시뮬레이션합니다.
 * 테스트용 QR 목록을 제공하여 스탬프 획득 흐름을 검증할 수 있습니다.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useStampStore } from '@/stores/stamp'
import { stampSpots } from '@/data/mockGamification'

const router = useRouter()
const { t, te } = useI18n({ useScope: 'global' })
import { resolveI18nText } from '@/utils/i18nResolver'
const stampStore = useStampStore()
const scope = 'QrScannerMock_v2'

// 상태 관리
const isScanning = ref(true)
const scanResult = ref(null)
const errorMessage = ref('')
const videoRef = ref(null)
const streamRef = ref(null)

/**
 * 카메라 스트림 시작
 */
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 1280 } }
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      streamRef.value = stream
    }
    logger.info(scope, 'QR 스캐너 카메라 활성화됨')
  } catch (error) {
    logger.error(scope, '카메라 접근 실패', error)
    errorMessage.value = t('qrScanner.cameraPermissionRequired')
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

const handleScan = (qrCode) => {
  logger.info(scope, `QR 스캔 시도: ${qrCode}`)
  const result = stampStore.scanQr(qrCode)
  
  if (result.success) {
    // 스탬프 획득 처리
    stampStore.collectStamp(result.spot.id)
    scanResult.value = result.spot
    isScanning.value = false
    stopCamera()
    
    // 성공 애니메이션/모달 처리를 위해 1초 후 이동
    setTimeout(() => {
      router.push('/v2/stamp-event')
    }, 1500)
  } else {
    errorMessage.value = result.message
    setTimeout(() => { errorMessage.value = '' }, 3000)
  }
}
</script>

<template>
  <div class="min-h-screen bg-black text-white flex flex-col items-center justify-center p-lg relative overflow-hidden">
    <!-- 배경 공간 효과 (Blur) -->
    <div class="absolute inset-0 opacity-40">
       <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[100px]"></div>
       <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"></div>
    </div>

    <!-- 스캐너 프레임 UI -->
    <div class="relative z-10 w-full max-w-md aspect-square mb-12 bg-black/60 rounded-3xl overflow-hidden shadow-2xl">
      <!-- 실제 카메라 화면 -->
      <video ref="videoRef" autoplay playsinline muted class="absolute inset-0 w-full h-full object-cover opacity-60"></video>

      <!-- 코너 포인트 -->
      <div class="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-3xl"></div>
      <div class="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-3xl"></div>
      <div class="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-3xl"></div>
      <div class="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-3xl"></div>

      <!-- 스캔 라인 애니메이션 -->
      <div v-if="isScanning" class="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#00dbe9] animate-scan"></div>

      <!-- 중앙 상태 메시지 -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div v-if="isScanning" class="text-center">
          <span class="material-symbols-outlined text-6xl text-primary/40 animate-pulse">qr_code_2</span>
          <p class="text-xs font-black uppercase tracking-[0.4em] text-primary mt-4">{{ t('qrScanner.detecting') }}</p>
        </div>
        
        <div v-else-if="scanResult" class="text-center animate-bounce-in">
          <div class="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-6 shadow-[0_0_40px_#00dbe9]">
            <span class="material-symbols-outlined text-5xl text-on-primary">check</span>
          </div>
          <h3 class="text-2xl font-black">{{ resolveI18nText({ key: scanResult.nameKey, t, te, context: 'qrScanner:result:name' }) }}</h3>
          <p class="text-primary font-bold mt-2 uppercase tracking-widest">{{ t('qrScanner.scanSuccess') }}</p>
        </div>
      </div>
    </div>

    <!-- 하단 테스트 패널 -->
    <div class="relative z-20 w-full max-w-lg glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-white/5">
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-lg font-bold">{{ t('qrScanner.testQrList') }}</h3>
        <button @click="router.back()" class="text-xs font-bold text-on-surface-variant hover:text-white transition-all uppercase tracking-widest">{{ t('common.cancel') }}</button>
      </div>

      <div class="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
        <button v-for="spot in stampSpots" :key="spot.id"
                @click="handleScan(spot.qrCode)"
                :disabled="!isScanning"
                class="p-4 rounded-2xl border text-sm font-bold transition-all text-left flex items-center gap-3"
                :class="stampStore.isStampCollected(spot.id) ? 'bg-white/5 border-white/5 opacity-40' : 'bg-white/10 border-white/20 hover:bg-primary/20 hover:border-primary/40'">
          <span class="text-2xl">{{ spot.stampIcon }}</span>
          <span class="truncate">{{ resolveI18nText({ key: spot.nameKey, t, te, context: `qrScanner:spot:${spot.id}:name` }) }}</span>
        </button>
      </div>

      <p v-if="errorMessage" class="mt-6 text-center text-error font-bold animate-shake">{{ errorMessage }}</p>
    </div>

    <!-- 안내 문구 -->
    <div class="mt-12 text-center relative z-10">
      <p class="text-on-surface-variant text-sm font-medium">
        {{ t('qrScanner.scannerGuideLine1') }}
        <br />
        {{ t('qrScanner.scannerGuideLine2') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes scan {
  0% { top: 10%; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 90%; opacity: 0; }
}
.animate-scan {
  animation: scan 3s linear infinite;
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake {
  animation: shake 0.3s ease-in-out;
}

.glass-panel {
  backdrop-filter: blur(40px);
  box-shadow: 0 20px 80px -20px rgba(0, 0, 0, 0.5);
}

.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
