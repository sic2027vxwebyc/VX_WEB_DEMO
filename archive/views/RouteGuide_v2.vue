<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 실시간 경로 안내 V2 (Spatial Navigation)
 * 실시간 경로 재계산, 다층 시각화, 고령층 접근성을 강화한 내비게이션입니다.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'
import { useOperationalStore } from '@/stores/operational'

const route = useRoute()
const router = useRouter()
const spacesStore = useSpacesStore()
const opStore = useOperationalStore()
const { t } = useI18n({ useScope: 'global' })
const scope = 'RouteGuide_v2'

// 목적지 정보
const destination = computed(() => {
  return spacesStore.getSpaceById(route.params.id) || spacesStore.getSpaceById('hall-1')
})

// 실시간 상태 시뮬레이션
const isRecalculating = ref(false)
const currentFloor = ref(1)

// 경로 단계 (V2: 더 직관적이고 큰 텍스트 중심)
const routeSteps = computed(() => {
  const name = destination.value.name
  return [
    { id: 1, title: t('map.navigation.steps.straight'), desc: t('map.navigation.steps.straightDesc'), icon: 'straight', status: 'completed', dist: '0m' },
    { id: 2, title: t('map.navigation.steps.turnRight'), desc: t('map.navigation.steps.turnRightDesc'), icon: 'turn_right', status: 'active', dist: '15m' },
    { id: 3, title: t('map.navigation.steps.elevator'), desc: t('map.navigation.steps.elevatorDesc'), icon: 'elevator', status: 'pending', dist: '25m' },
    { id: 4, title: t('map.navigation.steps.arrival', { name: name }), desc: t('map.navigation.steps.arrivalDesc'), icon: 'location_on', status: 'pending', dist: '40m' }
  ]
})

/**
 * 실시간 경로 재계산 시뮬레이션
 */
const triggerRecalculate = () => {
  isRecalculating.value = true
  logger.info(scope, '혼잡도 변화로 인한 경로 재계산을 시작합니다.')
  setTimeout(() => {
    isRecalculating.value = false
    logger.info(scope, '우회 경로가 반영되었습니다.')
  }, 2000)
}

onMounted(() => {
  logger.info(scope, `실시간 경로 안내 V2 시작: ${destination.value.name}`)
  // 5초 후 시뮬레이션용 경로 재계산 트리거
  setTimeout(triggerRecalculate, 5000)
})

const handleArrival = () => {
  logger.info(scope, '목적지 도착 완료')
  router.push('/arrival-success')
}
</script>

<template>
  <div class="fixed inset-0 z-50 bg-background overflow-hidden flex flex-col lg:flex-row">
    <!-- 1. 왼쪽: 핵심 안내 패널 (PC에서는 고정, 모바일에서는 하단) -->
    <aside class="w-full lg:w-[450px] bg-surface-container-highest/80 backdrop-blur-3xl border-r border-white/10 flex flex-col z-20 shadow-2xl order-2 lg:order-1">
      <!-- 상단 목적지 헤더 -->
      <div class="p-lg border-b border-white/5 bg-surface-container-highest/50">
        <button @click="router.back()" class="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-6 transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
          <span class="font-bold">{{ t('map.navigation.exitGuide') }}</span>
        </button>
        
        <div class="flex items-center gap-md">
          <div class="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-[0_0_20px_rgba(0,219,233,0.2)]">
            <img :src="destination.image" class="w-full h-full object-cover" />
          </div>
          <div>
            <span class="text-xs font-bold text-primary tracking-widest uppercase">{{ t('map.navigation.guidingTo') }}</span>
            <h1 class="text-headline-md font-display-lg leading-tight">{{ destination.name }}</h1>
            <div class="flex items-center gap-2 text-on-surface-variant mt-1">
              <span class="material-symbols-outlined text-sm">near_me</span>
              <span class="text-sm font-bold">{{ t('map.navigation.etaFormat', { min: 3, dist: 40 }) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 실시간 안내 텍스트 (고령층 배려 대형 타이포) -->
      <div class="flex-1 overflow-y-auto px-lg py-xl space-y-xl no-scrollbar">
        <div v-if="isRecalculating" class="flex flex-col items-center justify-center py-12 animate-pulse">
          <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <h3 class="text-2xl font-bold text-primary">{{ t('map.navigation.recalculating') }}</h3>
          <p class="text-on-surface-variant mt-2 text-center">{{ t('map.navigation.recalculatingDesc') }}</p>
        </div>

        <template v-else>
          <div v-for="step in routeSteps" :key="step.id" 
               class="flex gap-lg group transition-all duration-500"
               :class="step.status === 'active' ? 'scale-105' : 'opacity-40 grayscale-[50%]'">
            <div class="flex flex-col items-center">
              <div :class="`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${step.status === 'active' ? 'bg-primary text-on-primary ring-8 ring-primary/20' : 'bg-surface-container border border-white/10'}`">
                <span class="material-symbols-outlined text-3xl">{{ step.icon }}</span>
              </div>
              <div v-if="step.id !== routeSteps.length" class="w-1 h-20 bg-gradient-to-b from-primary/50 to-transparent mt-2"></div>
            </div>
            <div class="flex-1 pt-2">
              <div class="flex justify-between items-baseline mb-2">
                <h3 :class="`text-2xl font-bold ${step.status === 'active' ? 'text-on-surface' : 'text-on-surface-variant'}`">{{ step.title }}</h3>
                <span class="text-lg font-bold text-primary">{{ step.dist }}</span>
              </div>
              <p class="text-lg text-on-surface-variant font-medium leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </template>
      </div>

      <!-- 하단 액션 바 -->
      <div class="p-lg bg-surface-container-highest border-t border-white/5">
        <button 
          @click="handleArrival"
          class="w-full bg-primary text-on-primary py-5 rounded-2xl font-headline-md font-bold text-2xl shadow-[0_0_40px_rgba(0,219,233,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          {{ t('map.navigation.arrivalAction') }}
        </button>
      </div>
    </aside>

    <!-- 2. 오른쪽: Spatial Map 레이어 (PC에서는 넓게, 모바일에서는 배경) -->
    <main class="flex-1 relative order-1 lg:order-2">
      <!-- 층수 선택기 -->
      <div class="absolute top-margin-desktop left-margin-desktop z-10 flex flex-col gap-sm">
        <button v-for="f in [3, 2, 1]" :key="f" 
                @click="currentFloor = f"
                :class="`w-14 h-14 rounded-2xl font-bold text-xl flex items-center justify-center transition-all backdrop-blur-xl border ${currentFloor === f ? 'bg-primary text-on-primary border-primary shadow-[0_0_20px_rgba(0,219,233,0.4)]' : 'bg-surface/40 text-on-surface-variant border-white/10'}`">
          {{ f }}F
        </button>
      </div>

      <!-- 실시간 상태 오버레이 -->
      <div class="absolute top-margin-desktop right-margin-desktop z-10 flex flex-col gap-md items-end">
        <div class="glass-panel p-4 rounded-2xl bg-surface/40 backdrop-blur-xl border border-white/10 flex items-center gap-4 shadow-2xl">
          <div class="flex flex-col">
            <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{{ t('map.navigation.currentLocation') }}</span>
            <span class="text-lg font-bold">{{ t('map.navigation.locationLobby') }}</span>
          </div>
          <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary">my_location</span>
          </div>
        </div>
        
        <div class="glass-panel p-4 rounded-2xl bg-status-low/10 backdrop-blur-xl border border-status-low/30 flex items-center gap-4 shadow-2xl">
          <div class="flex flex-col">
            <span class="text-xs font-bold text-status-low uppercase tracking-widest">{{ t('map.navigation.optimized') }}</span>
            <span class="text-lg font-bold">{{ t('map.navigation.avoidingCongestion') }}</span>
          </div>
          <div class="w-10 h-10 rounded-full bg-status-low/20 flex items-center justify-center">
            <span class="material-symbols-outlined text-status-low">verified_user</span>
          </div>
        </div>
      </div>

      <!-- 메인 공간 지도 (Spatial Grid) -->
      <div class="absolute inset-0 bg-surface-dark overflow-hidden">
        <div class="absolute inset-0 opacity-20 map-grid"></div>
        <!-- 시뮬레이션된 경로 라인 -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#00dbe9;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#d1bcff;stop-opacity:1" />
            </linearGradient>
          </defs>
          <!-- 경로 경로 -->
          <path d="M 500 800 L 500 500 L 800 500 L 800 200" 
                fill="none" 
                stroke="url(#routeGradient)" 
                stroke-width="12" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                filter="url(#glow)"
                class="animate-dash"
                stroke-dasharray="20, 15"
          />
          <!-- 사용자 위치 펄스 -->
          <g transform="translate(500, 800)">
            <circle r="30" fill="#00dbe9" opacity="0.2">
              <animate attributeName="r" values="30;50;30" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="12" fill="#00dbe9" />
          </g>
          <!-- 목적지 핀 -->
          <g transform="translate(800, 200)">
            <path d="M0 0 L-15 -35 A20 20 0 1 1 15 -35 Z" fill="#00dbe9" filter="url(#glow)" />
            <circle cy="-35" r="8" fill="#121315" />
          </g>
        </svg>
      </div>
    </main>
  </div>
</template>

<style scoped>
.map-grid {
  background-image: 
    linear-gradient(to right, rgba(0, 219, 233, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 219, 233, 0.1) 1px, transparent 1px);
  background-size: 60px 60px;
}

.animate-dash {
  stroke-dashoffset: 1000;
  animation: dash 60s linear infinite;
}

@keyframes dash {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
