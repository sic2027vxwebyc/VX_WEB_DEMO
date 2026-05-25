<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 실시간 공간 경험 - 라이브 (Viewer360Live)
 * 3D Hotspot 프로젝션, 실시간 혼잡도 Overlay, 시네마틱 전환 및 Route 연동을 제공합니다.
 * "국제대회 공간을 미리 걷고 안내받는 느낌"을 구현한 최종 진화형 360 뷰어입니다.
 */
import { onMounted, onUnmounted, onBeforeUnmount, ref, computed, shallowRef, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'
import { useOperationalStore } from '@/stores/operational'
import { useViewerStore } from '@/stores/viewer'
import { getWebXRDiagnostics } from '@/utils/webxrDiagnostics'
import { resolveI18nText } from '@/utils/i18nResolver'

const route = useRoute()
const router = useRouter()
const spacesStore = useSpacesStore()
const opStore = useOperationalStore()
const viewerStore = useViewerStore()
const { t, te } = useI18n({ useScope: 'global' })
const scope = 'Viewer360Live'

// DOM 참조
const canvasRef = ref(null)
const containerRef = ref(null)

// 현재 공간 정보
const spaceData = computed(() => {
  const id = route.params.id
  if (!id) return null
  return spacesStore.getSpaceById(id)
})

const canInitializeViewer = computed(() => {
  return spaceData.value && spaceData.value.image
})

// Hotspots 데이터 (정적 번역 데이터 포함)
const localizedHotspots = computed(() => {
  if (!spaceData.value) return []
  return viewerStore.getHotspotsBySpaceId(spaceData.value.id).map(h => ({
    ...h,
    localizedLabel: h.labelKey ? t(h.labelKey) : h.label,
    congestion: opStore.congestionData[h.targetId] || { level: 'low' }
  }))
})

const hotspotData = ref([]) // 핫스팟 기본 데이터 (위치 계산용)
const selectedHotspot = ref(null)

// Three.js 리소스 (shallowRef로 성능 최적화 및 reactive 오버헤드 감소)
const scene = shallowRef(null)
const camera = shallowRef(null)
const renderer = shallowRef(null)
const sphere = shallowRef(null)
const controls = shallowRef(null)
const currentTexture = shallowRef(null)

// 뷰어 상태 및 가드
const fov = ref(75)
const isScanning = ref(true)
const isVrSupported = ref(false)
let isActive = true
let initToken = 0
let activeLoadToken = 0
let animationFrameId = null
let cleanupDone = false
let updateTimer = null

/**
 * Three.js 리소스 정리 (Idempotent)
 */
const disposeScene = () => {
  if (!scene.value) return
  scene.value.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose()
    }
    if (object.material) {
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]
      materials.forEach((material) => {
        // 텍스처 정리
        Object.keys(material).forEach((key) => {
          const value = material[key]
          if (value && typeof value.dispose === 'function' && value instanceof THREE.Texture) {
            value.dispose()
          }
        })
        material.dispose()
      })
    }
  })
  scene.value.clear()
}

const disposeRenderer = () => {
  if (!renderer.value) return
  renderer.value.setAnimationLoop(null)
  renderer.value.dispose()
  renderer.value.forceContextLoss?.()
  const canvas = renderer.value.domElement
  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas)
  }
  renderer.value = null
}

const cleanupViewer = () => {
  if (cleanupDone) return
  cleanupDone = true
  
  logger.info(scope, '뷰어 리소스 정리 시작')
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  
  if (updateTimer) {
    clearInterval(updateTimer)
    updateTimer = null
  }
  
  disposeScene()
  disposeRenderer()
  
  if (currentTexture.value) {
    currentTexture.value.dispose()
    currentTexture.value = null
  }
  
  window.removeEventListener('resize', handleResize)
  logger.info(scope, '뷰어 리소스 정리 완료')
}

/**
 * Three.js 초기화
 */
const initThree = async () => {
  const token = ++initToken
  logger.info(scope, 'Immersive 360 뷰어 초기화 시작')

  if (!canvasRef.value) {
    logger.error(scope, 'Three.js 초기화 실패: canvasRef가 null입니다.')
    return
  }

  scene.value = new THREE.Scene()
  camera.value = new THREE.PerspectiveCamera(fov.value, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.value.position.set(0, 0, 0.1)

  const geometry = new THREE.SphereGeometry(500, 60, 40)
  geometry.scale(-1, 1, 1)

  const texture = await loadPanoramaTexture(spaceData.value.image)
  if (!isActive || token !== initToken || !texture) {
    geometry.dispose()
    if (texture) texture.dispose()
    return
  }

  const material = new THREE.MeshBasicMaterial({ map: texture })
  sphere.value = new THREE.Mesh(geometry, material)
  scene.value.add(sphere.value)
  
  try {
    renderer.value = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      alpha: true
    })
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.value.setSize(window.innerWidth, window.innerHeight)

    controls.value = new OrbitControls(camera.value, renderer.value.domElement)
    controls.value.enableDamping = true
    controls.value.dampingFactor = 0.05
    controls.value.rotateSpeed = -0.4
    
    const diag = await getWebXRDiagnostics()
    if (!isActive || token !== initToken) return
    isVrSupported.value = diag.supportsImmersiveVR

    setTimeout(() => { 
      if (isActive) isScanning.value = false 
    }, 2000)

    animate()
  } catch (error) {
    logger.error(scope, 'WebGLRenderer 초기화 중 치명적 오류 발생', error)
    isScanning.value = false
  }
}

/**
 * 텍스처 로드 (Race Condition 방지 및 메모리 관리)
 */
async function loadPanoramaTexture(imagePath) {
  const token = ++activeLoadToken
  const loader = new THREE.TextureLoader()
  const texturePath = imagePath.startsWith('http') 
    ? imagePath 
    : `${import.meta.env.BASE_URL}${imagePath.replace(/^\//, '')}`
  
  try {
    const loadedTexture = await loader.loadAsync(texturePath)
    if (!isActive || token !== activeLoadToken) {
      loadedTexture.dispose()
      return null
    }
    if (currentTexture.value) {
      currentTexture.value.dispose()
    }
    currentTexture.value = loadedTexture
    return loadedTexture
  } catch (err) {
    logger.error(scope, '텍스처 로드 실패', err)
    return null
  }
}

/**
 * 매 프레임 애니메이션 루프 (최적화)
 */
const animate = () => {
  if (!isActive || !renderer.value || !scene.value || !camera.value) return
  
  animationFrameId = requestAnimationFrame(animate)
  
  if (controls.value) controls.value.update()
  
  // 핫스팟 투영 좌표 업데이트
  if (!isScanning.value) {
    updateHotspotProjections()
  }
  
  renderer.value.render(scene.value, camera.value)
}

const updateHotspotProjections = () => {
  if (!camera.value || !containerRef.value || !hotspotData.value.length) return
  
  const widthHalf = window.innerWidth / 2
  const heightHalf = window.innerHeight / 2
  const radius = 400
  const projVector = new THREE.Vector3()

  const hotspotElements = containerRef.value.querySelectorAll('.hotspot-marker-container')
  
  hotspotElements.forEach((el) => {
    const id = el.getAttribute('data-id')
    const h = hotspotData.value.find(item => item.id === id)
    if (!h) return

    const phi = h.phi || 0
    const theta = (h.theta || 0) * (Math.PI / 180)
    
    projVector.set(
      radius * Math.cos(phi) * Math.sin(theta),
      radius * Math.sin(phi),
      radius * Math.cos(phi) * Math.cos(theta)
    )

    projVector.project(camera.value)
    
    if (projVector.z < 1) {
      const x = (projVector.x * widthHalf) + widthHalf
      const y = -(projVector.y * heightHalf) + heightHalf
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      el.style.display = 'block'
    } else {
      el.style.display = 'none'
    }
  })
}

const handleResize = () => {
  if (!camera.value || !renderer.value) return
  camera.value.aspect = window.innerWidth / window.innerHeight
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(window.innerWidth, window.innerHeight)
}

const jumpToSpace = (id) => {
  logger.info(scope, `공간 이동: ${id}`)
  selectedHotspot.value = null
  router.push(`/viewer-360-live/${id}`)
}

const startRoute = (id) => {
  logger.info(scope, `경로 안내 시작: ${id}`)
  router.push(`/route-guide/${id}`)
}

// Lifecycle Hooks - Synchronously registered in setup
onMounted(async () => {
  isActive = true
  cleanupDone = false
  
  await spacesStore.fetchSpaces()
  await nextTick() // DOM 렌더링 완료 보장
  
  if (!isActive) return

  if (!canInitializeViewer.value) {
    logger.warn(scope, '공간 데이터가 없거나 이미지가 유효하지 않아 뷰어를 시작할 수 없습니다.', { id: route.params.id })
    return
  }

  await initThree()
  window.addEventListener('resize', handleResize)
  
  updateTimer = setInterval(() => {
    if (isActive) opStore.simulateUpdates()
  }, 5000)
})

onBeforeUnmount(() => {
  isActive = false
  cleanupViewer()
})

onUnmounted(() => {
  logger.info(scope, 'Viewer360 unmounted')
})

watch(localizedHotspots, (newList) => {
  hotspotData.value = newList
}, { immediate: true })

watch(() => route.params.id, async (newId) => {
  if (sphere.value && newId) {
    const space = spacesStore.getSpaceById(newId)
    if (!space || !space.image) return

    isScanning.value = true
    const texture = await loadPanoramaTexture(space.image)
    if (!isActive || !texture) return

    sphere.value.material.map = texture
    sphere.value.material.needsUpdate = true
    
    setTimeout(() => { 
      if (isActive) isScanning.value = false 
    }, 1000)
  }
})



</script>

<template>
  <div ref="containerRef" class="fixed inset-0 z-[60] bg-surface-dark overflow-hidden select-none">
    <!-- 3D Canvas -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>

    <!-- Spatial Scanning Effect -->
    <Transition name="fade">
      <div v-if="isScanning" class="absolute inset-0 z-[70] bg-surface-dark/80 backdrop-blur-xl flex items-center justify-center pointer-events-none">
        <div class="flex flex-col items-center gap-8">
          <div class="relative w-32 h-32">
            <div class="absolute inset-0 border-[3px] border-primary/20 rounded-full"></div>
            <div class="absolute inset-0 border-t-[3px] border-primary rounded-full animate-spin"></div>
            <div class="absolute inset-4 border-[1px] border-secondary/30 rounded-full animate-pulse"></div>
          </div>
          <div class="text-center">
            <p class="text-primary font-black tracking-[0.5em] uppercase text-sm mb-2">{{ t('viewer.live.scanningTitle') }}</p>
            <p v-if="spaceData" class="text-on-surface-variant text-[10px] uppercase font-bold">{{ t('viewer.live.scanningDesc', { name: resolveI18nText({ key: spaceData.nameKey, t, te, context: 'viewer:scanning:name' }) }) }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Header Overlay -->
    <header class="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-margin-desktop h-24 bg-gradient-to-b from-surface-dark to-transparent">
      <div class="flex items-center gap-6">
        <button @click="router.back()" class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all group backdrop-blur-xl shadow-2xl">
          <span class="material-symbols-outlined text-on-surface group-hover:text-primary">arrow_back</span>
        </button>
        <div class="flex flex-col">
          <div class="flex items-center gap-3">
            <h2 v-if="spaceData" class="text-2xl font-display-lg text-on-surface tracking-tight">{{ resolveI18nText({ key: spaceData.nameKey, t, te, context: 'viewer:header:name' }) }}</h2>
            <div class="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span class="text-[10px] text-primary font-black uppercase tracking-widest">{{ t('viewer.live.liveSpatial') }}</span>
            </div>
          </div>
          <p class="text-xs text-on-surface-variant font-bold mt-1 uppercase tracking-widest">{{ t('viewer.live.terminalStatus') }}</p>
        </div>
      </div>

      <div class="hidden lg:flex items-center gap-8">
        <div class="flex flex-col items-end">
          <span class="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{{ t('viewer.live.telemetry') }}</span>
          <div class="flex gap-6 mt-2">
            <div v-if="spaceData" class="flex flex-col items-end">
              <span class="text-[9px] text-on-surface-variant font-bold">{{ t('viewer.live.occupancy').toUpperCase() }}</span>
              <span class="text-lg font-black">{{ opStore.congestionData[spaceData.id]?.percent || 0 }}%</span>
            </div>
            <div class="w-[1px] h-8 bg-white/10"></div>
            <div class="flex flex-col items-end text-secondary">
              <span class="text-[9px] text-on-surface-variant font-bold">{{ t('viewer.live.airQuality').toUpperCase() }}</span>
              <span class="text-lg font-black">{{ t('viewer.live.excellent').toUpperCase() }}</span>
            </div>
          </div>
        </div>
        <button @click="router.push('/map')" class="px-8 py-3 bg-primary text-on-primary rounded-2xl font-black text-sm shadow-[0_0_30px_rgba(0,219,233,0.3)] hover:scale-105 active:scale-95 transition-all">
          {{ t('viewer.live.dashboard').toUpperCase() }}
        </button>
      </div>
    </header>

    <!-- 3D Projected Hotspots (Direct DOM Update) -->
    <div class="absolute inset-0 z-30 pointer-events-none">
      <div v-for="h in hotspotData" :key="h.id" 
           class="absolute hotspot-marker-container pointer-events-auto group"
           :data-id="h.id"
           style="display: none;">
        
        <!-- Hotspot Marker -->
        <button @click="selectedHotspot = h" 
                class="-translate-x-1/2 -translate-y-1/2 relative flex items-center justify-center">
          <!-- Outer Glow -->
          <div :class="['absolute w-12 h-12 rounded-full transition-all duration-500', h.congestion.level === 'high' ? 'bg-error/20' : 'bg-primary/20']">
            <div :class="['absolute inset-0 rounded-full animate-ping opacity-40', h.congestion.level === 'high' ? 'bg-error' : 'bg-primary']"></div>
          </div>
          <!-- Inner Core -->
          <div :class="['relative w-6 h-6 rounded-full border-2 border-white shadow-2xl transition-all duration-300 group-hover:scale-125', h.congestion.level === 'high' ? 'bg-error' : 'bg-primary']">
            <span class="material-symbols-outlined text-[14px] text-white flex items-center justify-center h-full">
              {{ h.type === 'hall' ? 'meeting_room' : h.type === 'dining' ? 'restaurant' : h.type === 'exit' ? 'logout' : 'info' }}
            </span>
          </div>
          <!-- Label -->
          <div class="absolute top-10 whitespace-nowrap bg-surface-dark/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl transition-all group-hover:bg-primary group-hover:border-primary">
            <span class="text-xs font-bold text-on-surface group-hover:text-on-primary">{{ h.localizedLabel }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Right Side Detail Panel (PC) -->
    <aside v-if="selectedHotspot" 
           class="hidden lg:flex absolute right-margin-desktop top-1/2 -translate-y-1/2 w-[380px] z-50 flex-col gap-6 scale-in">
      <div class="glass-panel p-8 rounded-[2.5rem] bg-surface-container-high/90 backdrop-blur-3xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
        <div class="flex justify-between items-start mb-8">
          <div :class="['px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest', selectedHotspot.congestion.level === 'high' ? 'bg-error text-on-error' : 'bg-primary/20 text-primary border border-primary/30']">
            {{ selectedHotspot.congestion.level.toUpperCase() }} {{ t('viewer.live.density').toUpperCase() }}
          </div>
          <button @click="selectedHotspot = null" class="p-2 hover:bg-white/10 rounded-full">
            <span class="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <h3 class="text-3xl font-display-lg mb-2">{{ selectedHotspot.localizedLabel }}</h3>
        <p class="text-on-surface-variant font-medium leading-relaxed mb-8">
          {{ selectedHotspot.congestion.level === 'high' ? t('viewer.hotspot.guideBusy', { min: selectedHotspot.walkingMinutes }) : t('viewer.hotspot.guideOptimal', { min: selectedHotspot.walkingMinutes }) }}
        </p>

        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span class="text-[9px] font-bold text-on-surface-variant uppercase">{{ t('viewer.live.distance') }}</span>
            <p class="text-lg font-black mt-1">{{ selectedHotspot.walkingMinutes * 60 }}m</p>
          </div>
          <div class="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span class="text-[9px] font-bold text-on-surface-variant uppercase">{{ t('viewer.live.eta') }}</span>
            <p class="text-lg font-black mt-1">{{ selectedHotspot.walkingMinutes }} {{ t('common.minutes') }}</p>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <button v-if="selectedHotspot.type === 'hall'" 
                  @click="jumpToSpace(selectedHotspot.targetId)"
                  class="w-full py-5 bg-white text-surface-dark rounded-2xl font-black text-lg hover:bg-primary hover:text-on-primary transition-all shadow-xl active:scale-95">
            {{ t('viewer.live.enterSpace').toUpperCase() }}
          </button>
          <button @click="startRoute(selectedHotspot.targetId)"
                  class="w-full py-5 border-2 border-primary/30 text-primary rounded-2xl font-black text-lg hover:bg-primary/10 transition-all flex items-center justify-center gap-3 active:scale-95">
            <span class="material-symbols-outlined font-black">near_me</span>
            {{ t('viewer.live.getDirections').toUpperCase() }}
          </button>
        </div>
      </div>
    </aside>

    <!-- Bottom Sheet (Mobile) -->
    <Transition name="slide-up">
      <div v-if="selectedHotspot" 
           class="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-10 bg-surface-container-high/95 backdrop-blur-3xl rounded-t-[3rem] border-t border-white/10 shadow-2xl">
        <div class="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8"></div>
        <div class="px-4">
          <div class="flex justify-between items-center mb-6">
             <h3 class="text-2xl font-bold">{{ selectedHotspot.localizedLabel }}</h3>
             <span :class="['px-3 py-1 rounded-lg text-[10px] font-black uppercase', selectedHotspot.congestion.level === 'high' ? 'bg-error' : 'bg-primary/20 text-primary']">
               {{ selectedHotspot.congestion.level }}
             </span>
          </div>
          <p class="text-on-surface-variant mb-8 font-medium">{{ t('map.details.etaValue', { min: selectedHotspot.walkingMinutes }) }} • {{ selectedHotspot.congestion.level === 'high' ? t('map.congestion') : t('map.status.optimal') }}</p>
          <div class="flex gap-3">
            <button v-if="selectedHotspot.type === 'hall'"
                    @click="jumpToSpace(selectedHotspot.targetId)"
                    class="flex-1 py-5 bg-primary text-on-primary rounded-2xl font-black">{{ t('common.details') }}</button>
            <button @click="startRoute(selectedHotspot.targetId)"
                    class="flex-[2] py-5 bg-white/10 border border-white/10 rounded-2xl font-black flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">near_me</span> {{ t('common.routing') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Compass -->
    <div class="absolute left-margin-desktop bottom-10 z-40 pointer-events-auto hidden lg:block">
      <div class="w-20 h-20 glass-panel bg-surface-container-high/40 rounded-full border border-white/10 flex items-center justify-center group cursor-pointer hover:bg-white/5 transition-all shadow-2xl">
        <div class="relative w-14 h-14 border border-primary/20 rounded-full">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-primary rounded-full shadow-[0_0_15px_#00f0ff]"></div>
          <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-primary">N</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.glass-panel {
  backdrop-filter: blur(50px);
  box-shadow: 0 20px 80px -20px rgba(0, 0, 0, 0.4);
}

.fade-enter-active, .fade-leave-active { transition: all 1s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
@keyframes scaleIn {
  from { transform: translateY(-50%) scale(0.9); opacity: 0; }
  to { transform: translateY(-50%) scale(1); opacity: 1; }
}

canvas { transition: filter 1s ease-in-out; }
</style>
