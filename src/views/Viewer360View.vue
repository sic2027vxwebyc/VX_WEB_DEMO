<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 360 뷰어 뷰
 * Three.js를 활용한 실제 360 파노라마 렌더링과 WebXR 기반 VR 모드를 제공합니다.
 */
import { onMounted, onUnmounted, ref, computed, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as THREE from 'three'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'

const route = useRoute()
const router = useRouter()
const spacesStore = useSpacesStore()
const { t } = useI18n()
const scope = 'Viewer360'

// DOM 참조
const canvasRef = ref(null)

// 현재 공간 정보
const spaceData = computed(() => {
  return spacesStore.getSpaceById(route.params.id) || spacesStore.getSpaceById('hall-1')
})

// Three.js 리소스 (shallowRef로 반응성 오버헤드 방지)
const scene = shallowRef(null)
const camera = shallowRef(null)
const renderer = shallowRef(null)
const sphere = shallowRef(null)

// 뷰어 상태
const isDragging = ref(false)
const lon = ref(0)
const lat = ref(0)
const onPointerDownLon = ref(0)
const onPointerDownLat = ref(0)
const onPointerDownPointerX = ref(0)
const onPointerDownPointerY = ref(0)
const fov = ref(75)
const isVrSupported = ref(false)
const vrErrorMessage = ref('')

/**
 * Three.js 초기화
 */
const initThree = () => {
  logger.info(scope, 'Three.js 초기화를 시작합니다.')

  // 1. Scene & Camera
  scene.value = new THREE.Scene()
  camera.value = new THREE.PerspectiveCamera(fov.value, window.innerWidth / window.innerHeight, 1, 1100)
  camera.value.target = new THREE.Vector3(0, 0, 0)

  // 2. Geometry & Texture
  const geometry = new THREE.SphereGeometry(500, 60, 40)
  // 구체 내부를 바라보도록 X축 반전
  geometry.scale(-1, 1, 1)

  const loader = new THREE.TextureLoader()
  loader.load(
    spaceData.value.image,
    (texture) => {
      logger.info(scope, '360 텍스처 로드 완료:', spaceData.value.image)
      const material = new THREE.MeshBasicMaterial({ map: texture })
      sphere.value = new THREE.Mesh(geometry, material)
      scene.value.add(sphere.value)
    },
    undefined,
    (err) => {
      logger.error(scope, '텍스처 로드 실패:', err)
    }
  )

  // 3. Renderer
  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true
  })
  renderer.value.setPixelRatio(window.devicePixelRatio)
  renderer.value.setSize(window.innerWidth, window.innerHeight)
  renderer.value.xr.enabled = true

  // 4. VR 지원 확인
  if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
      isVrSupported.value = supported
      if (!supported) {
        logger.warn(scope, '이 기기/브라우저는 immersive-vr을 지원하지 않습니다.')
      }
    })
  } else {
    logger.warn(scope, 'WebXR을 지원하지 않는 환경입니다.')
  }

  // 5. Animation Loop
  renderer.value.setAnimationLoop(animate)
}

/**
 * 애니메이션 루프
 */
const animate = () => {
  if (!renderer.value || !scene.value || !camera.value) return

  // 위도 제한 (폴 방지)
  lat.value = Math.max(-85, Math.min(85, lat.value))
  
  const phi = THREE.MathUtils.degToRad(90 - lat.value)
  const theta = THREE.MathUtils.degToRad(lon.value)

  camera.value.target.x = 500 * Math.sin(phi) * Math.cos(theta)
  camera.value.target.y = 500 * Math.cos(phi)
  camera.value.target.z = 500 * Math.sin(phi) * Math.sin(theta)

  camera.value.lookAt(camera.value.target)
  renderer.value.render(scene.value, camera.value)
}

/**
 * 리사이즈 핸들러
 */
const handleResize = () => {
  if (!camera.value || !renderer.value) return
  camera.value.aspect = window.innerWidth / window.innerHeight
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(window.innerWidth, window.innerHeight)
}

/**
 * 포인터 이벤트 핸들러 (드래그 회전)
 */
const onPointerDown = (event) => {
  if (event.isPrimary === false) return
  isDragging.value = true
  onPointerDownPointerX.value = event.clientX
  onPointerDownPointerY.value = event.clientY
  onPointerDownLon.value = lon.value
  onPointerDownLat.value = lat.value
  
  logger.debug(scope, '드래그 시작')
}

const onPointerMove = (event) => {
  if (event.isPrimary === false || !isDragging.value) return
  lon.value = (onPointerDownPointerX.value - event.clientX) * 0.1 + onPointerDownLon.value
  lat.value = (event.clientY - onPointerDownPointerY.value) * 0.1 + onPointerDownLat.value
}

const onPointerUp = () => {
  isDragging.value = false
  logger.debug(scope, '드래그 종료')
}

const onWheel = (event) => {
  const delta = event.deltaY * 0.05
  fov.value = Math.max(30, Math.min(100, fov.value + delta))
  updateCameraFov()
}

const updateCameraFov = () => {
  if (camera.value) {
    camera.value.fov = fov.value
    camera.value.updateProjectionMatrix()
    logger.debug(scope, `줌 변경 (FOV): ${fov.value.toFixed(1)}`)
  }
}

/**
 * 줌 인/아웃 버튼 핸들러
 */
const handleZoom = (type) => {
  const step = 5
  if (type === 'in') fov.value = Math.max(30, fov.value - step)
  else fov.value = Math.min(100, fov.value + step)
  updateCameraFov()
}

/**
 * VR 모드 토글
 */
const toggleVr = async () => {
  logger.info(scope, 'VR 모드 버튼 클릭')
  
  if (!isVrSupported.value) {
    const reason = !navigator.xr ? 'WebXR 미지원' : '기기 미지원'
    logger.warn(scope, `VR 모드 진입 불가: ${reason}`)
    vrErrorMessage.value = t('viewer.vrNotSupported', '이 기기나 브라우저에서는 VR 모드를 지원하지 않습니다.')
    setTimeout(() => { vrErrorMessage.value = '' }, 3000)
    return
  }

  try {
    const sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking', 'layers'] }
    const session = await navigator.xr.requestSession('immersive-vr', sessionInit)
    renderer.value.xr.setSession(session)
    logger.info(scope, 'VR 세션 시작 성공')
  } catch (error) {
    logger.error(scope, 'VR 세션 시작 실패:', error)
    vrErrorMessage.value = 'VR 세션을 시작할 수 없습니다.'
    setTimeout(() => { vrErrorMessage.value = '' }, 3000)
  }
}

/**
 * 컴포넌트 마운트/언마운트
 */
onMounted(() => {
  logger.info(scope, `360 뷰어(공간 ID: ${route.params.id}) 초기화 중...`)
  initThree()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  logger.info(scope, '360 뷰어 리소스 해제')
  window.removeEventListener('resize', handleResize)
  
  if (renderer.value) {
    renderer.value.setAnimationLoop(null)
    renderer.value.dispose()
  }
  if (sphere.value) {
    sphere.value.geometry.dispose()
    sphere.value.material.dispose()
  }
  if (scene.value) {
    scene.value.clear()
  }
})

/**
 * 뷰어 종료
 */
const exitViewer = () => {
  logger.info(scope, '뷰어를 종료합니다.')
  router.back()
}
</script>

<template>
  <div class="fixed inset-0 z-[60] bg-surface-dark overflow-hidden select-none touch-none">
    <!-- Three.js Canvas -->
    <canvas 
      ref="canvasRef" 
      class="absolute inset-0 w-full h-full outline-none"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @wheel="onWheel"
    ></canvas>

    <!-- 상단 컨트롤 바 -->
    <header class="absolute top-0 w-full z-10 flex items-center justify-between px-margin-desktop h-16 bg-surface/40 backdrop-blur-[30px] border-b border-white/10">
      <div class="flex items-center gap-md">
        <span class="font-headline-md text-headline-md font-bold text-primary tracking-tight">VX Web</span>
        <div class="h-6 w-[1px] bg-outline-variant/30 mx-2"></div>
        <span class="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest">{{ spaceData.name }} 360</span>
      </div>
      
      <button 
        @click="exitViewer"
        class="flex items-center gap-2 px-4 py-2 bg-error/10 border border-error/20 rounded-full text-error hover:bg-error/20 transition-all"
      >
        <span class="material-symbols-outlined text-[20px]">close</span>
        <span class="font-label-lg">{{ t('viewer.exit') }}</span>
      </button>
    </header>

    <!-- 오버레이 UI -->
    <div class="absolute inset-0 pointer-events-none z-20">
      <!-- 줌 컨트롤 -->
      <div class="absolute left-margin-desktop top-1/2 -translate-y-1/2 flex flex-col gap-md">
        <div class="flex flex-col glass-panel bg-surface-container-low/60 border border-white/5 rounded-2xl p-2 gap-2 shadow-2xl pointer-events-auto">
          <button 
            @click="handleZoom('in')"
            class="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-primary/20 text-on-surface hover:text-primary transition-all"
            :title="t('viewer.controls.zoomIn')"
          >
            <span class="material-symbols-outlined">add</span>
          </button>
          <div class="h-[1px] bg-white/10 mx-2"></div>
          <button 
            @click="handleZoom('out')"
            class="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-primary/20 text-on-surface hover:text-primary transition-all"
            :title="t('viewer.controls.zoomOut')"
          >
            <span class="material-symbols-outlined">remove</span>
          </button>
        </div>
        
        <!-- 나침반 -->
        <div class="w-16 h-16 glass-panel bg-surface-container-low/60 border border-white/5 rounded-full flex items-center justify-center shadow-xl">
          <div class="relative w-12 h-12 border-2 border-primary/20 rounded-full flex items-center justify-center">
            <div class="absolute top-0 w-[2px] h-3 bg-primary-fixed-dim rounded-full shadow-[0_0_10px_rgba(0,219,233,1)]"></div>
            <span class="font-label-sm text-primary tracking-tighter">{{ t('viewer.controls.north') }}</span>
          </div>
        </div>
      </div>

      <!-- VR 모드 및 통계 -->
      <div class="absolute right-margin-desktop bottom-10 flex flex-col gap-md items-end">
        <!-- VR 모드 버튼 -->
        <div class="flex items-center gap-md glass-panel bg-surface-container-lowest/70 border border-white/10 p-2 rounded-full shadow-2xl pointer-events-auto">
          <span class="font-label-lg text-on-surface-variant px-4">{{ t('viewer.controls.vrMode') }}</span>
          <button 
            @click="toggleVr"
            class="w-14 h-8 rounded-full relative flex items-center px-1 transition-all group"
            :class="isVrSupported ? 'bg-primary/20 hover:bg-primary/40' : 'bg-surface-container-highest opacity-50 cursor-not-allowed'"
          >
            <div 
              class="w-6 h-6 rounded-full shadow-lg transition-transform"
              :class="isVrSupported ? 'bg-primary translate-x-6' : 'bg-on-surface-variant translate-x-0'"
            ></div>
          </button>
        </div>

        <!-- 통계 패널 -->
        <div class="glass-panel bg-surface-container-high/60 p-4 rounded-2xl border border-white/5 flex flex-col gap-2 w-[240px]">
          <h4 class="font-label-lg text-primary uppercase tracking-widest">{{ t('viewer.stats.title') }}</h4>
          <div class="flex items-center justify-between">
            <span class="text-on-surface-variant font-label-sm">{{ t('viewer.stats.occupancy') }}</span>
            <span class="text-on-surface font-label-sm">42%</span>
          </div>
          <div class="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div class="w-[42%] h-full bg-primary-fixed-dim"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- VR 미지원 안내 토스트 -->
    <Transition name="fade">
      <div v-if="vrErrorMessage" class="absolute bottom-32 left-1/2 -translate-x-1/2 px-6 py-3 bg-error/90 text-on-error rounded-full font-label-lg shadow-xl z-50">
        {{ vrErrorMessage }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(0, 219, 233, 0.4)); }
  50% { transform: scale(1.05); filter: drop-shadow(0 0 15px rgba(0, 219, 233, 0.8)); }
}
.animate-pulse-slow {
  animation: pulse-glow 3s infinite ease-in-out;
}
</style>
