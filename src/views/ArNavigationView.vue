<script setup>
/**
 * [ AR 내비게이션 뷰 컴포넌트 ]
 * 카메라 화면 위에 3D 화살표를 표시하여 목적지 방향을 안내합니다.
 */
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'
import { useArNavigation } from '@/composables/useArNavigation'

const route = useRoute()
const router = useRouter()
const spacesStore = useSpacesStore()
const { t } = useI18n({ useScope: 'global' })
const scope = 'ArNavigation'
const { 
  isInitialized, 
  distanceToTarget, 
  initScene, 
  updateDirection, 
  dispose 
} = useArNavigation()

const targetSpace = computed(() => {
  return spacesStore.getSpaceById(route.params.id) || { name: t('ar.lost'), x: 0, y: 0 }
})

const canvasRef = ref(null)
const videoRef = ref(null)

// 시뮬레이션된 현재 위치 (지도 좌표계 기준)
const currentPos = ref({ x: 200, y: 500 })

/**
 * 카메라 스트림 시작
 */
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
    logger.info(scope, 'AR 카메라 스트림이 활성화되었습니다.')
  } catch (error) {
    logger.error(scope, '카메라 스트림 시작 실패', error)
    // 실패 시 일반 지도로 이동
    router.push(`/route-guide/${route.params.id}?error=camera`)
  }
}

/**
 * 길 안내 종료
 */
const exitAr = () => {
  logger.info(scope, '사용자가 AR 안내를 종료했습니다.')
  router.push('/map')
}

/**
 * 일반 지도 보기로 전환
 */
const switchToMap = () => {
  router.push(`/route-guide/${route.params.id}`)
}

// 위치 업데이트 시뮬레이션 인터벌
let updateInterval = null

onMounted(async () => {
  await startCamera()
  if (canvasRef.value) {
    initScene(canvasRef.value, videoRef.value)
  }

  // 방향 업데이트 시뮬레이션
  updateInterval = setInterval(() => {
    // 실제 앱에서는 Geolocation API나 실시간 위치 트래킹 데이터를 사용함
    updateDirection(currentPos.value, { x: targetSpace.value.x || 400, y: targetSpace.value.y || 100 })
  }, 100)
})

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval)
  const stream = videoRef.value?.srcObject
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
  dispose()
})
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col">
    <!-- 카메라 배경 -->
    <video 
      ref="videoRef" 
      autoplay 
      playsinline 
      muted 
      class="absolute inset-0 w-full h-full object-cover opacity-80"
    ></video>

    <!-- Three.js 오버레이 -->
    <canvas 
      ref="canvasRef" 
      class="absolute inset-0 w-full h-full pointer-events-none"
    ></canvas>

    <!-- UI 레이어 -->
    <div class="relative z-10 flex flex-col h-full pointer-events-none">
      <!-- 상단 바 -->
      <div class="p-lg bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between pointer-events-auto">
        <div class="flex items-center gap-md">
          <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <span class="material-symbols-outlined text-on-primary">near_me</span>
          </div>
          <div>
            <h2 class="text-white font-headline-md leading-tight">{{ targetSpace.name }}</h2>
            <p class="text-primary font-label-lg">{{ t('map.remaining', { dist: distanceToTarget }) }}</p>
          </div>
        </div>
        <button @click="exitAr" class="p-3 bg-black/40 backdrop-blur-md rounded-full text-white">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- 중앙 안내 메시지 -->
      <div class="mt-auto mb-10 flex flex-col items-center gap-lg">
        <div class="px-lg py-md bg-primary/20 backdrop-blur-xl border border-primary/40 rounded-full text-primary font-bold animate-pulse shadow-2xl">
          {{ isInitialized ? t('ar.start') : t('ar.initializing') }}
        </div>
        
        <!-- 하단 컨트롤 -->
        <div class="flex gap-md pointer-events-auto">
          <button 
            @click="switchToMap"
            class="px-lg py-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white font-bold flex items-center gap-md active:scale-95 transition-all"
          >
            <span class="material-symbols-outlined">map</span>
            {{ t('ar.controls.map') }}
          </button>
          <button 
            @click="exitAr"
            class="px-lg py-md bg-status-high/80 backdrop-blur-md border border-status-high/40 rounded-2xl text-white font-bold flex items-center gap-md active:scale-95 transition-all"
          >
            <span class="material-symbols-outlined">cancel</span>
            {{ t('ar.controls.exit') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 안전 안내 바텀 시트 (최하단) -->
    <div class="absolute bottom-0 left-0 right-0 p-sm bg-black/80 text-white/60 text-[10px] text-center">
      {{ t('ar.permissions.safety') }}
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.98); }
}
</style>
