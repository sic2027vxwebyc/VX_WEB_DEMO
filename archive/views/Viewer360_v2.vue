<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 360 공간 경험 V2 (Spatial Operating Style)
 * Three.js를 기반으로 한 고해상도 360 파노라마 뷰어입니다.
 * 실시간 공간 데이터(혼잡도, 온도) 오버레이와 인접 공간 이동 기능을 제공하며,
 * WebXR을 통한 프리미엄 VR 경험을 지원합니다.
 */
import { onMounted, onUnmounted, ref, computed, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'
import { getWebXRDiagnostics } from '@/utils/webxrDiagnostics'

const route = useRoute()
const router = useRouter()
const spacesStore = useSpacesStore()
const { t } = useI18n({ useScope: 'global' })
const scope = 'Viewer360_v2'

// DOM 참조
const canvasRef = ref(null)

// 현재 공간 정보
const spaceData = computed(() => {
  return spacesStore.getSpaceById(route.params.id) || spacesStore.getSpaceById('hall-1')
})

// 인접 공간 정보 (단순히 현재 공간을 제외한 무작위 2개 공간 선택)
const nearbySpaces = computed(() => {
  return spacesStore.spaces
    .filter(s => s.id !== spaceData.value.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
})

// 실시간 시뮬레이션 데이터
const simulatedData = ref({
  congestion: 45,
  temperature: 22.4,
  humidity: 48,
  visitors: 1240
})

// Three.js 리소스
const scene = shallowRef(null)
const camera = shallowRef(null)
const renderer = shallowRef(null)
const sphere = shallowRef(null)
const controls = shallowRef(null)

// 뷰어 상태
const fov = ref(75)
const isVrSupported = ref(false)
const vrErrorMessage = ref('')
const diagnostics = ref(null)
const isScanning = ref(true)

/**
 * Three.js 초기화
 */
const initThree = async () => {
  logger.info(scope, 'Spatial 360 뷰어 초기화 시작')

  scene.value = new THREE.Scene()
  camera.value = new THREE.PerspectiveCamera(fov.value, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.value.position.set(0, 0, 0.1)

  const geometry = new THREE.SphereGeometry(500, 60, 40)
  geometry.scale(-1, 1, 1)

  const loader = new THREE.TextureLoader()
  const texturePath = spaceData.value.image.startsWith('http') 
    ? spaceData.value.image 
    : `${import.meta.env.BASE_URL}${spaceData.value.image.replace(/^\//, '')}`
  
  loader.load(
    texturePath,
    (texture) => {
      logger.info(scope, '360 텍스처 로드 완료')
      const material = new THREE.MeshBasicMaterial({ map: texture })
      sphere.value = new THREE.Mesh(geometry, material)
      scene.value.add(sphere.value)
      
      // 로딩 후 스캔 효과 시뮬레이션 종료
      setTimeout(() => { isScanning.value = false }, 2000)
    },
    undefined,
    (err) => logger.error(scope, '텍스처 로드 실패:', err)
  )

  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true
  })
  renderer.value.setPixelRatio(window.devicePixelRatio)
  renderer.value.setSize(window.innerWidth, window.innerHeight)
  renderer.value.xr.enabled = true

  controls.value = new OrbitControls(camera.value, renderer.value.domElement)
  controls.value.enableDamping = true
  controls.value.dampingFactor = 0.05
  controls.value.rotateSpeed = -0.4
  controls.value.enableZoom = true

  diagnostics.value = await getWebXRDiagnostics()
  isVrSupported.value = diagnostics.value.supportsImmersiveVR

  renderer.value.setAnimationLoop(animate)
}

const animate = () => {
  if (!renderer.value || !scene.value || !camera.value) return
  if (controls.value) controls.value.update()
  renderer.value.render(scene.value, camera.value)
}

const handleResize = () => {
  if (!camera.value || !renderer.value) return
  camera.value.aspect = window.innerWidth / window.innerHeight
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(window.innerWidth, window.innerHeight)
}

/**
 * 공간 전환
 */
const jumpToSpace = (id) => {
  logger.info(scope, `공간 이동 시도: ${id}`)
  router.push(`/viewer-360-v2/${id}`)
}

/**
 * VR 모드 활성화
 */
const toggleVr = async () => {
  if (!isVrSupported.value) {
    vrErrorMessage.value = t('viewer.vr.notSupportedToast')
    setTimeout(() => { vrErrorMessage.value = '' }, 3000)
    return
  }

  try {
    const session = await navigator.xr.requestSession('immersive-vr', {
      optionalFeatures: ['local-floor', 'bounded-floor']
    })
    renderer.value.xr.setSession(session)
  } catch (error) {
    logger.error(scope, 'VR 세션 시작 실패', error)
  }
}

// 라우트 변경 시 데이터 재로딩
watch(() => route.params.id, () => {
  if (sphere.value && scene.value) {
    isScanning.value = true
    const loader = new THREE.TextureLoader()
    const texturePath = spaceData.value.image.startsWith('http') 
      ? spaceData.value.image 
      : `${import.meta.env.BASE_URL}${spaceData.value.image.replace(/^\//, '')}`
    
    loader.load(texturePath, (texture) => {
      sphere.value.material.map = texture
      sphere.value.material.needsUpdate = true
      setTimeout(() => { isScanning.value = false }, 1500)
    })
  }
})

onMounted(() => {
  initThree()
  window.addEventListener('resize', handleResize)
  
  // 데이터 시뮬레이션 루프
  const interval = setInterval(() => {
    simulatedData.value.congestion = Math.floor(40 + Math.random() * 20)
    simulatedData.value.temperature = +(22 + Math.random()).toFixed(1)
  }, 5000)
  
  onUnmounted(() => clearInterval(interval))
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (renderer.value) {
    renderer.value.setAnimationLoop(null)
    renderer.value.dispose()
  }
})
</script>

<template>
  <div class="fixed inset-0 z-[60] bg-surface-dark overflow-hidden select-none touch-none">
    <!-- Three.js Canvas -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>

    <!-- 스캐닝 오버레이 (Spatial Boot) -->
    <Transition name="fade">
      <div v-if="isScanning" class="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
        <div class="flex flex-col items-center gap-6">
          <div class="relative w-24 h-24">
            <div class="absolute inset-0 border-2 border-primary/20 rounded-full"></div>
            <div class="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-primary font-bold tracking-[0.2em] uppercase text-sm animate-pulse">{{ t('viewer.v2.scanning') }}</span>
            <span class="text-on-surface-variant text-[10px] mt-1 uppercase tracking-tighter">{{ t('viewer.v2.initializing') }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 프리미엄 헤더 -->
    <header class="absolute top-0 w-full z-10 flex items-center justify-between px-margin-desktop h-20 bg-gradient-to-b from-black/90 to-transparent">
      <div class="flex items-center gap-md">
        <button 
          @click="router.back()"
          class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all group"
        >
          <span class="material-symbols-outlined text-on-surface group-hover:text-primary">arrow_back</span>
        </button>
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-bold text-on-surface tracking-tight">{{ spaceData.nameKey ? t(spaceData.nameKey) : spaceData.name }}</h2>
            <span class="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] text-primary font-bold uppercase tracking-widest">{{ t('viewer.v2.experience') }}</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-status-low animate-pulse"></span>
              <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">{{ t('viewer.status.normal') }}</span>
            </div>
            <div class="w-[1px] h-2 bg-white/10"></div>
            <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">ID: {{ spaceData.id }}</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-6">
        <div class="hidden sm:flex flex-col items-end">
          <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">{{ t('viewer.live.realtimeData') }}</span>
          <div class="flex items-center gap-4 mt-0.5">
            <div class="flex flex-col items-end">
              <span class="text-[10px] text-on-surface-variant uppercase">{{ t('viewer.stats.temp') }}</span>
              <span class="text-sm font-bold text-primary leading-none">{{ simulatedData.temperature }}°C</span>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-[10px] text-on-surface-variant uppercase">{{ t('viewer.stats.humid') }}</span>
              <span class="text-sm font-bold text-primary leading-none">{{ simulatedData.humidity }}%</span>
            </div>
          </div>
        </div>
        <button 
          @click="router.push('/map')"
          class="px-5 py-2.5 bg-primary text-on-primary rounded-full font-bold text-sm shadow-[0_0_20px_rgba(0,219,233,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          {{ t('viewer.live.switchToMap') }}
        </button>
      </div>
    </header>

    <!-- 공간 운영 레이어 (Spatial Operating Overlay) -->
    <div class="absolute inset-0 pointer-events-none z-20">
      <!-- 중앙 조준선 -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center opacity-20">
        <div class="w-full h-[1px] bg-primary"></div>
        <div class="absolute w-[1px] h-full bg-primary"></div>
        <div class="absolute w-4 h-4 border border-primary rounded-full"></div>
      </div>

      <!-- 실시간 혼잡도 오버레이 -->
      <div class="absolute left-margin-desktop bottom-10 pointer-events-auto">
        <div class="glass-panel p-6 rounded-[2rem] bg-surface-container-high/40 backdrop-blur-3xl border border-white/10 w-[320px] shadow-2xl overflow-hidden relative group">
          <!-- 배경 장식용 그리드 -->
          <div class="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          
          <div class="relative z-10">
            <div class="flex justify-between items-center mb-5">
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{{ t('viewer.status.operational') }}</span>
                <h3 class="text-lg font-bold text-on-surface mt-0.5">{{ t('viewer.live.spaceDensity') }}</h3>
              </div>
              <div :class="`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${simulatedData.congestion > 70 ? 'bg-status-high text-on-surface' : 'bg-status-low/20 text-status-low border border-status-low/30'}`">
                {{ simulatedData.congestion > 70 ? t('viewer.live.densityHigh') : t('viewer.live.densityNormal') }}
              </div>
            </div>

            <div class="space-y-5">
              <div class="relative">
                <div class="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                  <span>{{ t('viewer.live.currentDensity') }}</span>
                  <span class="text-primary">{{ simulatedData.congestion }}%</span>
                </div>
                <div class="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div class="h-full bg-primary shadow-[0_0_10px_rgba(0,240,255,0.5)] transition-all duration-1000" :style="{ width: `${simulatedData.congestion}%` }"></div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white/5 rounded-xl p-3 border border-white/5">
                  <span class="text-[9px] text-on-surface-variant uppercase tracking-tighter block mb-1">{{ t('viewer.live.estimatedVisitors') }}</span>
                  <span class="text-sm font-bold text-on-surface">{{ simulatedData.visitors.toLocaleString() }}</span>
                </div>
                <div class="bg-white/5 rounded-xl p-3 border border-white/5">
                  <span class="text-[9px] text-on-surface-variant uppercase tracking-tighter block mb-1">{{ t('viewer.live.peakTime') }}</span>
                  <span class="text-sm font-bold text-on-surface">14:00 - 16:00</span>
                </div>
              </div>
            </div>

            <button 
              @click="router.push(`/route-guide-v2/${spaceData.id}`)"
              class="mt-6 w-full py-4 bg-primary/10 border border-primary/20 rounded-2xl font-bold text-primary hover:bg-primary/20 transition-all flex items-center justify-center gap-2 group"
            >
              <span class="material-symbols-outlined text-[20px]">directions</span>
              <span>{{ t('viewer.live.optimizedPathSearch') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 인접 공간 이동 버튼 (Jump Points) -->
      <div class="absolute right-margin-desktop bottom-10 flex flex-col items-end gap-4 pointer-events-auto">
        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em] opacity-60 mr-2">{{ t('viewer.v2.nearbyTerminals') }}</span>
        
        <div class="flex flex-col gap-3">
          <button 
            v-for="space in nearbySpaces" 
            :key="space.id"
            @click="jumpToSpace(space.id)"
            class="glass-panel group flex items-center gap-4 p-2 pr-6 rounded-2xl bg-surface/40 border border-white/10 hover:bg-primary/10 hover:border-primary/40 transition-all shadow-xl"
          >
            <div class="w-12 h-12 rounded-xl overflow-hidden relative border border-white/10">
              <img :src="space.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-120" />
              <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div class="flex flex-col text-left">
              <span class="text-[9px] font-bold text-primary uppercase tracking-widest">{{ t('viewer.hotspots.jumpTo') }}</span>
              <span class="font-bold text-on-surface text-sm">{{ space.nameKey ? t(space.nameKey) : space.name }}</span>
            </div>
            <span class="material-symbols-outlined text-on-surface-variant text-[18px] ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
          </button>
        </div>

        <!-- VR 모드 스위치 -->
        <div class="mt-4 flex items-center gap-4 glass-panel bg-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl">
          <div class="flex flex-col items-end pl-4">
            <span class="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{{ t('viewer.vr.interface') }}</span>
            <span class="text-[10px] font-bold text-primary uppercase">{{ t('viewer.vr.available') }}</span>
          </div>
          <button 
            @click="toggleVr"
            class="w-14 h-8 rounded-full relative flex items-center px-1 transition-all group overflow-hidden"
            :class="isVrSupported ? 'bg-primary/20 hover:bg-primary/30 cursor-pointer' : 'bg-white/5 opacity-40 cursor-not-allowed'"
          >
            <div 
              class="w-6 h-6 rounded-full shadow-lg transition-transform duration-500 z-10"
              :class="isVrSupported ? 'bg-primary translate-x-6' : 'bg-on-surface-variant translate-x-0'"
            ></div>
            <!-- 내부 흐르는 빛 효과 -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" v-if="isVrSupported"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- 에러 토스트 -->
    <Transition name="fade">
      <div v-if="vrErrorMessage" class="absolute bottom-32 left-1/2 -translate-x-1/2 px-8 py-4 bg-error text-on-error rounded-2xl font-bold shadow-2xl z-50 flex items-center gap-3">
        <span class="material-symbols-outlined">warning</span>
        {{ vrErrorMessage }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.glass-panel {
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
}

.fade-enter-active, .fade-leave-active { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.95); }

@keyframes shimmer {
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Three.js 캔버스 부드러운 전환 */
canvas {
  transition: filter 1s ease-in-out;
}
.is-scanning canvas {
  filter: blur(10px) grayscale(0.5);
}
</style>
