<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 인터랙티브 맵 뷰
 * 층별 공간 구조 시각화, 카테고리 필터링, 실시간 혼잡도 및 인기 공간 정보를 제공합니다.
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'
import { useMapStore } from '@/stores/map'
import ArPermissionModal from '@/components/map/ArPermissionModal.vue'
import { useArPermissions } from '@/composables/useArPermissions'

const router = useRouter()
const spacesStore = useSpacesStore()
const mapStore = useMapStore()
const { t } = useI18n()
const scope = 'InteractiveMap'

const { 
  requestCameraPermission, 
  requestLocationPermission, 
  checkWebXrSupport 
} = useArPermissions()

// 선택된 공간 ID (페이지 수준 UI 상태로 유지)
const selectedSpaceId = ref(null)

// AR 관련 상태
const isArModalOpen = ref(false)
const targetSpaceForAr = ref(null)

/**
 * 선택된 공간 객체
 */
const selectedSpace = computed(() => {
  if (!selectedSpaceId.value) return null
  const allSpaces = Object.values(mapStore.floorData).flat()
  return allSpaces.find(s => s.id === selectedSpaceId.value)
})

/**
 * 현재 필터에 따라 렌더링할 공간 목록
 */
const filteredSpaces = computed(() => {
  const spaces = mapStore.floorData[mapStore.currentFloorKey] || []
  return spaces.filter(space => mapStore.activeFilters[space.type])
})

/**
 * 인기 공간 (스토어 데이터 기반 동적 생성)
 */
const popularSpaces = computed(() => {
  return spacesStore.spaces
    .filter(s => s.category === 'exhibition')
    .slice(0, 5)
    .map(s => ({
      id: s.id,
      name: s.name,
      floor: t(`map.floors.${s.floorId}`),
      floorKey: s.floorId,
      congestion: s.congestion,
      count: s.congestionType === 'high' ? 1240 : s.congestionType === 'moderate' ? 415 : 120,
      color: s.congestionType === 'high' ? 'status-high' : s.congestionType === 'moderate' ? 'status-moderate' : 'status-low',
      percent: s.congestionType === 'high' ? 92 : s.congestionType === 'moderate' ? 65 : 20
    }))
})

const changeFloor = (key) => {
  mapStore.setFloor(key)
  selectedSpaceId.value = null
  logger.info(scope, `전시장 변경: ${key}`)
}

const toggleFilter = (type) => {
  mapStore.toggleFilter(type)
  logger.debug(scope, `필터 변경: ${type} -> ${mapStore.activeFilters[type]}`)
}

const selectSpace = (space) => {
  selectedSpaceId.value = space.id
  logger.info(scope, `공간 선택: ${space.name}`)
}

const adjustScale = (delta) => {
  let newScale = Math.round((mapStore.mapScale + delta) * 10) / 10
  if (newScale < 0.5) newScale = 0.5
  if (newScale > 2) newScale = 2
  mapStore.setScale(newScale)
  logger.debug(scope, `지도 배율 조정: ${mapStore.mapScale}`)
}

/**
 * 경로 안내 시작 버튼 클릭 시 실행
 */
const startNavigation = (space) => {
  targetSpaceForAr.value = space
  isArModalOpen.value = true
  logger.info(scope, `AR 권한 확인 모달 요청: ${space?.name}`)
}

/**
 * AR 권한 동의 시 실행
 */
const handleArConfirm = async () => {
  isArModalOpen.value = false
  const targetId = targetSpaceForAr.value?.id || 'hall-1'
  
  logger.info(scope, 'AR 권한 요청 시작...')
  
  const isSupported = await checkWebXrSupport()
  const cameraOk = await requestCameraPermission()
  const locationOk = await requestLocationPermission()
  
  if (isSupported && cameraOk && locationOk) {
    logger.info(scope, '모든 권한 허용됨. AR 내비게이션으로 진입합니다.')
    router.push(`/ar-navigation/${targetId}`)
  } else {
    logger.warn(scope, '일부 권한이 거부되었거나 WebXR 미지원입니다. 일반 지도로 전환합니다.')
    router.push(`/route-guide/${targetId}?ar_fallback=true`)
  }
}

/**
 * AR 권한 거절 시 실행
 */
const handleArDeny = () => {
  isArModalOpen.value = false
  const targetId = targetSpaceForAr.value?.id || 'hall-1'
  logger.info(scope, '사용자가 AR을 거절했습니다. 일반 지도로 안내합니다.')
  router.push(`/route-guide/${targetId}`)
}

onMounted(() => {
  logger.info(scope, '인터랙티브 맵 인터페이스 활성화')
})
</script>

<template>
  <div class="h-[calc(100vh-64px)] flex relative overflow-hidden bg-surface-light dark:bg-surface-dark transition-colors duration-300">
    <!-- AR 권한 모달 -->
    <ArPermissionModal 
      :is-open="isArModalOpen" 
      @confirm="handleArConfirm" 
      @deny="handleArDeny" 
      @close="isArModalOpen = false"
    />
    
    <!-- 층 탐색 오버레이 -->
    <div class="absolute top-lg left-lg z-30 flex flex-col gap-sm">
      <div class="glass-panel p-sm rounded-xl flex flex-col gap-xs shadow-xl">
        <button 
          v-for="key in mapStore.floors" 
          :key="key"
          @click="changeFloor(key)"
          class="px-4 py-3 flex items-center justify-center rounded-lg font-bold transition-all text-label-lg whitespace-nowrap"
          :class="mapStore.currentFloorKey === key ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(0,219,233,0.4)]' : 'hover:bg-black/5 dark:hover:bg-white/10 text-surface-dark/60 dark:text-on-surface-variant'"
        >
          {{ t(`map.floors.${key}`) }}
        </button>
      </div>
      
      <div class="glass-panel p-sm rounded-xl flex flex-col gap-xs mt-md shadow-xl">
        <button @click="adjustScale(0.1)" class="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-surface-dark/60 dark:text-on-surface-variant">
          <span class="material-symbols-outlined">add</span>
        </button>
        <button @click="adjustScale(-0.1)" class="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-surface-dark/60 dark:text-on-surface-variant">
          <span class="material-symbols-outlined">remove</span>
        </button>
      </div>
    </div>

    <!-- 필터 패널 -->
    <div class="absolute left-40 top-lg z-30 hidden lg:block">
      <div class="glass-panel p-md rounded-2xl w-64 shadow-2xl">
        <h3 class="font-label-lg text-primary mb-md uppercase tracking-widest">{{ t('map.filters.title') }}</h3>
        <div class="flex flex-col gap-sm">
          <div 
            v-for="(val, key) in mapStore.activeFilters" 
            :key="key"
            @click="toggleFilter(key)"
            class="flex items-center justify-between p-sm rounded-lg cursor-pointer transition-all border"
            :class="val ? 'bg-primary/10 border-primary/30' : 'bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5'"
          >
            <div class="flex items-center gap-md">
              <span class="material-symbols-outlined text-md" :class="val ? 'text-primary' : 'text-on-surface-variant'">
                {{ key === 'exhibition' ? 'event_seat' : key === 'dining' ? 'restaurant' : 'info' }}
              </span>
              <span class="font-label-lg" :class="val ? 'text-surface-dark dark:text-on-surface' : 'text-on-surface-variant'">
                {{ t(`map.filters.${key}`) }}
              </span>
            </div>
            <div class="w-8 h-4 rounded-full relative transition-colors" :class="val ? 'bg-primary' : 'bg-black/10 dark:bg-white/10'">
              <div class="absolute top-0.5 w-3 h-3 rounded-full transition-all" :class="val ? 'right-0.5 bg-on-primary' : 'left-0.5 bg-on-surface-variant'"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 지도 캔버스 -->
    <div class="flex-1 relative overflow-hidden flex items-center justify-center map-grid">
      <div 
        class="relative transition-transform duration-500 ease-out"
        :style="{ transform: `scale(${mapStore.mapScale}) rotateX(45deg) rotateZ(-15deg)`, transformStyle: 'preserve-3d' }"
      >
        <!-- 층 베이스 -->
        <div class="relative w-[800px] h-[600px] bg-primary/5 dark:bg-primary/10 backdrop-blur-sm border-2 border-primary/30 rounded-2xl shadow-2xl">
          <!-- 공간 렌더링 -->
          <div 
            v-for="space in filteredSpaces" 
            :key="space.id"
            @click.stop="selectSpace(space)"
            class="absolute border transition-all cursor-pointer group"
            :style="{ 
              left: `${space.x}px`, 
              top: `${space.y}px`, 
              width: `${space.w}px`, 
              height: `${space.h}px`,
              transform: 'translateZ(1px)'
            }"
            :class="[
              selectedSpaceId === space.id ? 'bg-primary/40 border-primary shadow-[0_0_20px_#00dbe9]' : 'bg-primary/10 border-primary/20 hover:bg-primary/20 hover:border-primary/40',
              'flex flex-col items-center justify-center'
            ]"
          >
            <span class="font-bold text-[12px] text-primary uppercase tracking-tighter text-center px-1">{{ space.name }}</span>
            <div v-if="space.status === 'high'" class="absolute -top-1 -right-1 w-3 h-3 bg-status-high rounded-full animate-pulse shadow-[0_0_8px_#FF3D00]"></div>
          </div>

          <!-- 경로 안내 가상 라인 -->
          <svg v-if="selectedSpace" class="absolute inset-0 w-full h-full pointer-events-none" style="filter: drop-shadow(0 0 8px #00dbe9); transform: translateZ(2px);">
            <path 
              class="animate-dash" 
              :d="`M 50 550 Q 200 400 ${selectedSpace.x + selectedSpace.w/2} ${selectedSpace.y + selectedSpace.h/2}`" 
              fill="none" 
              stroke="#00dbe9" 
              stroke-width="3" 
              stroke-dasharray="10 5"
            ></path>
          </svg>
        </div>
      </div>

      <!-- 선택된 공간 상세 오버레이 -->
      <transition name="slide-up">
        <div v-if="selectedSpace" class="absolute bottom-lg left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40">
          <div class="glass-panel p-lg rounded-[24px] shadow-2xl border border-primary/20">
            <div class="flex justify-between items-start mb-md">
              <div>
                <span class="text-[10px] font-bold text-primary uppercase tracking-widest">{{ t(`map.filters.${selectedSpace.type}`) }}</span>
                <h3 class="font-headline-md text-surface-dark dark:text-on-surface">{{ selectedSpace.name }}</h3>
              </div>
              <button @click="selectedSpaceId = null" class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div class="grid grid-cols-2 gap-md mb-lg">
              <div class="bg-black/5 dark:bg-white/5 p-md rounded-xl">
                <p class="text-[10px] text-on-surface-variant uppercase mb-xs">{{ t('map.details.congestion') }}</p>
                <div class="flex items-center gap-sm">
                  <div class="w-2 h-2 rounded-full" :class="selectedSpace.status === 'high' ? 'bg-status-high' : selectedSpace.status === 'moderate' ? 'bg-status-moderate' : 'bg-status-low'"></div>
                  <span class="font-label-lg" :class="selectedSpace.status === 'high' ? 'text-status-high' : selectedSpace.status === 'moderate' ? 'text-status-moderate' : 'text-status-low'">
                    {{ selectedSpace.status === 'high' ? t('admin.heatmap.levels.high') : selectedSpace.status === 'moderate' ? t('admin.heatmap.levels.moderate') : t('admin.heatmap.levels.low') }}
                  </span>
                </div>
              </div>
              <div class="bg-black/5 dark:bg-white/5 p-md rounded-xl">
                <p class="text-[10px] text-on-surface-variant uppercase mb-xs">{{ t('map.details.eta') }}</p>
                <span class="font-label-lg text-primary">{{ t('map.details.etaValue', { min: 3 }) }}</span>
              </div>
            </div>

            <button 
              @click="startNavigation(selectedSpace)"
              class="w-full bg-primary text-on-primary py-lg rounded-xl font-bold flex items-center justify-center gap-md shadow-lg active:scale-95 transition-all"
            >
              <span class="material-symbols-outlined">near_me</span>
              {{ t('map.details.navigate') }}
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- 인기 공간 사이드바 -->
    <aside class="w-80 h-full border-l border-black/5 dark:border-white/10 glass-panel p-lg flex flex-col gap-lg z-30 hidden xl:flex">
      <div class="flex items-center justify-between">
        <h2 class="font-headline-md text-surface-dark dark:text-on-surface">{{ t('map.popular.title') }}</h2>
        <span class="material-symbols-outlined text-on-surface-variant">trending_up</span>
      </div>

      <div class="flex-1 flex flex-col gap-md overflow-y-auto pr-2 no-scrollbar">
        <div 
          v-for="space in popularSpaces" 
          :key="space.id"
          @click="changeFloor(space.floorKey); selectedSpaceId = space.id"
          class="glass-panel p-md rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 border-l-4 group cursor-pointer"
          :class="`border-${space.color}`"
        >
          <div class="flex justify-between items-start mb-sm">
            <h3 class="font-label-lg text-surface-dark dark:text-on-surface group-hover:text-primary transition-colors">{{ space.name }}</h3>
            <span class="text-[10px] px-2 py-0.5 rounded-full font-bold" :class="`bg-${space.color}/20 text-${space.color}`">{{ space.congestion }}</span>
          </div>
          <div class="flex items-center gap-md text-on-surface-variant text-label-sm mb-md">
            <div class="flex items-center gap-xs">
              <span class="material-symbols-outlined text-sm">group</span>
              <span>{{ t('map.popular.visitors', { count: space.count.toLocaleString() }) }}</span>
            </div>
            <span class="text-[10px] opacity-60">{{ space.floor }}</span>
          </div>
          <div class="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div class="h-full transition-all duration-1000" :class="`bg-${space.color}`" :style="{ width: `${space.percent}%` }"></div>
          </div>
        </div>
      </div>

      <!-- 퀵 박스 -->
      <div class="mt-auto glass-panel p-md rounded-2xl bg-primary/5 border border-primary/10">
        <div class="flex items-center gap-md mb-sm text-primary">
          <span class="material-symbols-outlined">assistant</span>
          <span class="font-label-lg">{{ t('map.assistant.title') }}</span>
        </div>
        <p class="text-[12px] text-on-surface-variant leading-relaxed mb-md" v-html="t('map.assistant.recommend', { busy: t('map.filters.dining'), free: t('map.filters.info') })">
        </p>
        <button 
          @click="changeFloor('hall1')"
          class="w-full py-2 rounded-lg font-bold text-label-sm border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
        >
          {{ t('map.assistant.viewRecommend') }}
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.map-grid {
  background-image: 
    linear-gradient(to right, rgba(0, 219, 233, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 219, 233, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}

.animate-dash {
  stroke-dasharray: 10, 5;
  animation: dash 20s linear infinite;
}

@keyframes dash {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
