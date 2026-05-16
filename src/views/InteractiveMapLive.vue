<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 실시간 인터랙티브 맵 - 라이브 (InteractiveMapLive)
 * 실시간 공간 혼잡도 히트맵, 지능형 경로 추천 및 운영 데이터 통합 뷰를 제공합니다.
 * "공간의 상태를 한눈에 파악하고 최적의 이동을 제안하는" 실시간 운영 허브의 핵심 인터페이스입니다.
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'
import { useMapStore } from '@/stores/map'
import { useOperationalStore } from '@/stores/operational'

const router = useRouter()
const spacesStore = useSpacesStore()
const mapStore = useMapStore()
const opStore = useOperationalStore()
const { t, te } = useI18n({ useScope: 'global' })
import { resolveI18nText } from '@/utils/i18nResolver'
const scope = 'InteractiveMapLive'

// 상태 관리
const selectedSpaceId = ref(null)
const showUtilityPanel = ref(true)

/**
 * 선택된 공간 객체 (실시간 데이터 포함)
 */
const selectedSpace = computed(() => {
  if (!selectedSpaceId.value) return null
  const allSpaces = Object.values(mapStore.liveFloorData).flat()
  return allSpaces.find(s => s.id === selectedSpaceId.value)
})

/**
 * 현재 층의 실시간 공간 데이터
 */
const currentFloorSpaces = computed(() => {
  return mapStore.liveFloorData[mapStore.currentFloorKey] || []
})

/**
 * 혼잡도 점수에 따른 히트맵 색상 반환
 */
const getHeatColor = (score) => {
  if (score > 80) return 'rgba(244, 67, 54, 0.6)' // High (Red)
  if (score > 40) return 'rgba(255, 193, 7, 0.4)'  // Moderate (Yellow)
  return 'rgba(0, 219, 233, 0.2)'                 // Low (Cyan)
}

/**
 * 전시장(층) 변경
 */
const changeFloor = (key) => {
  mapStore.setFloor(key)
  selectedSpaceId.value = null
  logger.info(scope, `전시장 변경: ${key}`)
}

/**
 * 공간 선택
 */
const selectSpace = (space) => {
  selectedSpaceId.value = space.id
  logger.info(scope, `공간 선택: ${space.id}`)
}

/**
 * 페이지 이동
 */
const navigateTo = (path) => {
  logger.info(scope, `페이지 이동: ${path}`)
  router.push(path)
}

onMounted(() => {
  logger.info(scope, '인터랙티브 맵 라이브 인터페이스 활성화')
})
</script>

<template>
  <div class="h-[calc(100vh-64px)] flex relative overflow-hidden bg-surface-dark transition-colors duration-300">
    
    <!-- 1. 좌측 상단: 층 선택 및 줌 컨트롤 -->
    <div class="absolute top-8 left-8 z-30 flex flex-col gap-6">
      <div class="glass-panel p-2 rounded-2xl flex flex-col gap-1 border border-white/10 shadow-2xl bg-surface-container-low/40">
        <button 
          v-for="floor in mapStore.floors" 
          :key="floor.id"
          @click="changeFloor(floor.id)"
          class="px-6 py-4 flex items-center justify-center rounded-xl font-black transition-all text-sm whitespace-nowrap"
          :class="mapStore.currentFloorKey === floor.id ? 'bg-primary text-on-primary shadow-[0_0_30px_rgba(0,219,233,0.4)]' : 'text-on-surface-variant hover:bg-white/5'"
        >
          {{ floor.labelKey ? t(floor.labelKey) : floor.id.toUpperCase() }}
        </button>
      </div>
      
      <div class="glass-panel p-2 rounded-2xl flex flex-col gap-1 border border-white/10 shadow-2xl bg-surface-container-low/40">
        <button @click="mapStore.setScale(Math.min(2, mapStore.mapScale + 0.1))" class="w-12 h-12 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-white/5">
          <span class="material-symbols-outlined">add</span>
        </button>
        <button @click="mapStore.setScale(Math.max(0.5, mapStore.mapScale - 0.1))" class="w-12 h-12 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-white/5">
          <span class="material-symbols-outlined">remove</span>
        </button>
      </div>
    </div>

    <!-- 2. 중앙: 인터랙티브 실시간 맵 캔버스 -->
    <main class="flex-1 relative overflow-hidden flex items-center justify-center map-grid-live">
      <!-- 배경 유동 흐름 시뮬레이션 -->
      <div class="absolute inset-0 pointer-events-none opacity-10">
        <div v-for="i in 5" :key="i" 
             class="flow-line h-[1px] bg-primary w-full"
             :style="{ top: (i * 20) + '%', animationDelay: (i * 1.2) + 's' }"
             :class="i % 2 === 0 ? 'animate-flow' : 'animate-flow-delayed'"></div>
      </div>

      <div 
        class="relative transition-transform duration-700 ease-out"
        :style="{ transform: `scale(${mapStore.mapScale}) rotateX(30deg) rotateZ(-10deg)`, transformStyle: 'preserve-3d' }"
      >
        <!-- 층 베이스 구조 -->
        <div class="relative w-[1000px] h-[700px] bg-surface-container-lowest/20 backdrop-blur-sm border border-white/5 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden">
          
          <!-- 실시간 공간 타일 -->
          <div 
            v-for="space in currentFloorSpaces" 
            :key="space.id"
            @click.stop="selectSpace(space)"
            class="absolute border-2 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden rounded-2xl group"
            :style="{ 
              left: space.x + 'px', 
              top: space.y + 'px', 
              width: space.w + 'px', 
              height: space.h + 'px',
              transform: 'translateZ(10px)',
              backgroundColor: getHeatColor(space.congestionScore),
              borderColor: space.congestionScore > 80 ? 'rgba(244, 67, 54, 0.8)' : 'rgba(255,255,255,0.1)'
            }"
            :class="[
              selectedSpaceId === space.id ? 'shadow-[0_0_40px_rgba(0,219,233,0.5)] ring-4 ring-primary/40' : 'hover:scale-105'
            ]"
          >
            <!-- 실시간 혼잡도 Pulse 효과 -->
            <div v-if="space.congestionScore > 60" 
                 class="absolute inset-0 animate-pulse-fast pointer-events-none"
                 :style="{ backgroundColor: space.congestionScore > 80 ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 193, 7, 0.1)' }"></div>

            <span class="font-black text-[12px] text-on-surface uppercase tracking-tight text-center px-2 z-10">{{ space.nameKey ? t(space.nameKey) : space.name }}</span>
            <span class="text-[10px] font-bold text-on-surface/60 mt-1 z-10">{{ space.congestionScore }}%</span>

            <!-- 추천 마커 -->
            <div v-if="space.recommended && space.congestionScore < 40" 
                 class="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span class="material-symbols-outlined text-white text-[18px]">thumb_up</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 선택된 공간 상세 오버레이 -->
      <transition name="slide-up">
        <div v-if="selectedSpace" class="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-40">
          <div class="glass-panel p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/10 bg-surface-container-high/90 backdrop-blur-3xl">
            <div class="flex justify-between items-start mb-8">
              <div>
                <span class="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{{ t('map.filters.' + selectedSpace.type) }}</span>
                <h3 class="text-3xl font-display-lg mt-1 text-on-surface">{{ selectedSpace.nameKey ? t(selectedSpace.nameKey) : selectedSpace.name }}</h3>
              </div>
              <button @click="selectedSpaceId = null" class="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                <span class="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            
            <div class="grid grid-cols-2 gap-6 mb-10">
              <div class="bg-white/5 p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-4">{{ t('map.details.congestion') }}</p>
                <div class="flex items-end gap-3">
                  <span :class="['text-4xl font-black ', selectedSpace.congestionScore > 80 ? 'text-error' : selectedSpace.congestionScore > 40 ? 'text-status-moderate' : 'text-status-low']">
                    {{ selectedSpace.congestionScore }}%
                  </span>
                  <span class="text-xs font-bold text-on-surface-variant pb-1">{{ selectedSpace.status.toUpperCase() }}</span>
                </div>
                <div class="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <div class="h-full bg-primary transition-all duration-1000" :style="{ width: selectedSpace.congestionScore + '%' }"></div>
                </div>
              </div>

              <div class="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex flex-col justify-between">
                <p class="text-[10px] text-primary font-bold uppercase tracking-widest">{{ t('map.optimalEntrance') }}</p>
                <div class="flex items-center gap-3 mt-2">
                  <span class="material-symbols-outlined text-primary text-3xl">door_front</span>
                  <span class="text-xl font-bold text-on-surface">{{ t('homeV2.optimalEntranceGate', { gate: 3, name: resolveI18nText({ key: 'spaces.exitWest.name', t, te }) }) }}</span>
                </div>
                <span class="text-[10px] text-on-surface-variant font-medium mt-1">{{ t('map.details.etaValue', { min: Math.ceil(selectedSpace.congestionScore / 20) + 1 }) }}</span>
              </div>
            </div>

            <!-- 우회 경로 추천 안내 -->
            <div v-if="selectedSpace.congestionScore > 70" 
                 class="mb-10 p-5 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-4">
              <span class="material-symbols-outlined text-error">alt_route</span>
              <p class="text-sm font-bold leading-snug text-on-surface">
                {{ t('map.detourRecommendLine1') }}
                <br />
                <span class="text-error">
                  {{ t('map.detourRecommendHighlight') }}
                </span>
                {{ t('map.detourRecommendLine2') }}
              </p>
            </div>

            <div class="flex gap-4">
              <button @click="navigateTo('/route-guide/' + selectedSpace.id)"
                      class="flex-[2] bg-primary text-on-primary py-6 rounded-[2rem] font-black text-xl shadow-[0_20px_50px_rgba(0,219,233,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                <span class="material-symbols-outlined text-3xl">near_me</span>
                {{ t('homeV2.startRouting') }}
              </button>
              <button @click="navigateTo('/viewer-360/' + selectedSpace.id)"
                      class="flex-1 bg-white/5 border border-white/10 text-on-surface py-6 rounded-[2rem] font-black flex items-center justify-center hover:bg-white/10 transition-all">
                <span class="material-symbols-outlined">view_in_ar</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </main>

    <!-- 3. 우측 패널: Live Utility intelligence (PC 전용) -->
    <aside v-if="showUtilityPanel" class="hidden xl:flex w-[380px] h-full border-l border-white/10 glass-panel p-12 flex flex-col gap-lg z-30 bg-surface-container-high/40 backdrop-blur-3xl">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-black flex items-center gap-3 text-on-surface">
          <span class="material-symbols-outlined text-primary">hub</span>
          {{ t('homeV2.operationalIntelligence') }}
        </h2>
        <div class="px-3 py-1 bg-status-low/20 rounded-lg text-status-low text-[10px] font-black border border-status-low/30 animate-pulse">LIVE</div>
      </div>

      <div class="flex-1 flex flex-col gap-12 overflow-y-auto pr-2 no-scrollbar">
        <!-- 식당가/편의시설 혼잡도 리스트 -->
        <section class="space-y-6">
          <div class="flex items-center justify-between px-2">
            <span class="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">{{ t('homeV2.nearbyFacilities') }}</span>
            <span class="material-symbols-outlined text-sm text-on-surface-variant">arrow_forward</span>
          </div>
          
          <div v-for="f in [
            { id: 'f-sodam', icon: 'restaurant', nameKey: 'spaces.fSodam.name' },
            { id: 'f-benvenuto', icon: 'local_cafe', nameKey: 'spaces.fBenvenuto.name' },
            { id: 'c-cu1', icon: 'info', nameKey: 'spaces.cCu1.name' }
          ]" :key="f.id"
               class="p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
            <div class="flex justify-between items-start mb-6">
               <div class="flex items-center gap-4">
                 <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                   <span class="material-symbols-outlined text-2xl">{{ f.icon }}</span>
                 </div>
                 <span class="font-bold text-on-surface">{{ resolveI18nText({ key: f.nameKey, t, te, context: `map:facility:${f.id}:name` }) }}</span>
               </div>
               <span :class="['text-[10px] font-black ', (opStore.congestionData[f.id]?.percent || 0) > 70 ? 'text-error' : 'text-status-low']">
                 {{ (opStore.congestionData[f.id]?.percent || 0) > 70 ? t('map.status.busy') : t('map.status.optimal') }}
               </span>
            </div>
            <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <div class="h-full bg-primary transition-all duration-1000" :style="{ width: (opStore.congestionData[f.id]?.percent || 0) + '%' }"></div>
            </div>
          </div>
        </section>

        <!-- 입구별 현황 (Recommended System) -->
        <section class="space-y-6">
          <div class="flex items-center justify-between px-2">
            <span class="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">{{ t('map.entranceEfficiency') }}</span>
          </div>
          <div class="grid grid-cols-1 gap-4">
             <div class="p-6 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex flex-col gap-4">
                <div class="flex items-center gap-3 text-primary">
                  <span class="material-symbols-outlined font-black">check_circle</span>
                  <span class="font-black text-lg">{{ t('homeV2.optimalEntrance', { name: t('spaces.exitWest.name') }) }}</span>
                </div>
                <p class="text-xs font-medium text-on-surface-variant leading-relaxed">
                  {{ t('homeV2.entranceGuide', { name: t('spaces.exitWest.name') + ' (Gate 3)' }) }}
                </p>
                <button @click="navigateTo('/route-guide/exit-west')" class="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-xs hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">{{ t('map.routeToWestGate') }}</button>
             </div>
          </div>
        </section>
      </div>
    </aside>

  </div>
</template>

<style scoped>
.map-grid-live {
  background-image: 
    radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.03) 1px, transparent 0);
  background-size: 50px 50px;
}

.flow-line {
  position: absolute;
  pointer-events: none;
  filter: blur(1px);
}

.animate-flow { animation: flowMove 12s linear infinite; }
.animate-flow-delayed { animation: flowMove 12s linear infinite 6s; }

@keyframes flowMove {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

.animate-pulse-fast {
  animation: heatPulse 2s infinite ease-in-out;
}

@keyframes heatPulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.glass-panel {
  backdrop-filter: blur(40px);
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.4);
}
</style>
