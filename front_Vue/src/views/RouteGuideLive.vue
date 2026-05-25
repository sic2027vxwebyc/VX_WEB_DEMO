<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 실시간 공간 내비게이션 - 라이브 (RouteGuideLive)
 * 혼잡 기반 동적 라우팅, 접근성 모드, 퀵 내비게이션 및 PC 전용 운영 콘솔 레이아웃을 제공합니다.
 * "사용자가 생각하지 않아도 공간이 자연스럽게 안내하는 느낌"을 구현한 최종 진화형 내비게이션입니다.
 */
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'
import { useOperationalStore } from '@/stores/operational'
import { resolveI18nText } from '@/utils/i18nResolver'
import ArFallbackPanel from '@/components/map/ArFallbackPanel.vue'

const route = useRoute()
const router = useRouter()
const spacesStore = useSpacesStore()
const opStore = useOperationalStore()
const { t, te } = useI18n({ useScope: 'global' })
const scope = 'RouteGuideLive'

// 상태 관리
const currentStepIndex = ref(1)
const showQuickNav = ref(false)
let isActive = true
let rerouteTimer = null

// 목적지 정보
const destinationId = computed(() => route.params.id)
const destination = computed(() => {
  return spacesStore.getSpaceById(destinationId.value) || spacesStore.getSpaceById('hall-1')
})
const hasDestination = computed(() => Boolean(destination.value))

// 번역된 목적지 이름
const destinationName = computed(() => {
  if (!destination.value) return ''
  return resolveI18nText({ 
    key: destination.value.nameKey, 
    t, te, 
    context: 'routeGuide:destination:name' 
  })
})

/**
 * 경로 단계 데이터 (접근성 모드 및 혼잡도에 따라 동적 변경 시뮬레이션)
 */
const routeSteps = computed(() => {
  if (!hasDestination.value) return []
  const name = destinationName.value
  
  if (opStore.isAccessibilityMode) {
    return [
      { id: 1, title: t('map.navigation.steps.elevator'), desc: t('map.navigation.steps.elevatorDesc'), icon: 'elevator', dist: '10m', type: 'accessibility' },
      { id: 2, title: t('map.navigation.steps.ramp'), desc: t('map.navigation.steps.rampDesc'), icon: 'ramp_left', dist: '30m', type: 'accessibility' },
      { id: 3, title: t('map.navigation.steps.accessEntry', { name }), desc: t('map.navigation.steps.accessEntryDesc'), icon: 'accessible', dist: t('map.arrival'), type: 'arrival' }
    ]
  }

  if (opStore.isRerouting) {
    return [
      { id: 1, title: t('map.navigation.steps.detour'), desc: t('map.navigation.steps.detourDesc'), icon: 'alt_route', dist: '5m', type: 'info' },
      { id: 2, title: t('map.navigation.steps.straight'), desc: t('map.navigation.steps.straightDesc'), icon: 'straight', dist: '40m', type: 'normal' },
      { id: 3, title: t('map.navigation.steps.arrival', { name }), desc: t('map.navigation.steps.arrivalDesc'), icon: 'location_on', dist: t('map.arrival'), type: 'arrival' }
    ]
  }

  return [
    { id: 1, title: '20m ' + t('map.navigation.steps.straight'), desc: t('map.navigation.steps.straightDesc'), icon: 'straight', dist: '20m', type: 'normal' },
    { id: 2, title: t('map.navigation.steps.turnRight'), desc: t('map.navigation.steps.turnRightDesc'), icon: 'turn_right', dist: '15m', type: 'normal' },
    { id: 3, title: t('map.navigation.steps.arrival', { name }), desc: t('map.navigation.steps.arrivalDesc'), icon: 'meeting_room', dist: t('map.arrival'), type: 'arrival' }
  ]
})

const currentStep = computed(() => routeSteps.value[currentStepIndex.value - 1] || routeSteps.value[0])

/**
 * 경로 재계산 시뮬레이션
 */
const triggerReroute = () => {
  if (!isActive) return
  opStore.isRerouting = true
  logger.info(scope, '실시간 혼잡도가 감지되어 경로를 재계산합니다.')
  rerouteTimer = setTimeout(() => {
    if (isActive) {
      opStore.isRerouting = false
      logger.info(scope, '최적 우회 경로가 적용되었습니다.')
    }
  }, 3000)
}

/**
 * 퀵 내비게이션 실행
 */
const quickNav = (targetId) => {
  logger.info(scope, '퀵 내비게이션 요청: ' + targetId)
  showQuickNav.value = false
  router.push('/route-guide/' + targetId)
}

onMounted(async () => {
  isActive = true
  await nextTick()
  
  if (!hasDestination.value) {
    logger.warn(scope, '목적지 데이터를 찾을 수 없습니다.', { id: destinationId.value })
    return
  }

  logger.info(scope, '라이브 내비게이션 시작: ' + destinationName.value)
  // 초기 8초 후 혼잡도 시뮬레이션
  rerouteTimer = setTimeout(triggerReroute, 8000)
})

onBeforeUnmount(() => {
  isActive = false
  if (rerouteTimer) {
    clearTimeout(rerouteTimer)
    rerouteTimer = null
  }
})

onUnmounted(() => {
  logger.info(scope, 'RouteGuide unmounted')
})

const handleArrival = () => {
  logger.info(scope, '목적지 도착 완료')
  router.push('/arrival-success')
}

watch(() => opStore.isAccessibilityMode, (val) => {
  logger.info(scope, '접근성 모드 ' + (val ? '활성화' : '비활성화') + ': 경로가 갱신되었습니다.')
  currentStepIndex.value = 1
})



</script>

<template>
  <div class="fixed inset-0 z-50 bg-background flex flex-col lg:flex-row overflow-hidden">
    
    <!-- Loading / Missing State -->
    <div v-if="!hasDestination" class="absolute inset-0 flex flex-col items-center justify-center bg-surface-dark z-[100]">
      <div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
      <p class="text-on-surface-variant font-bold tracking-widest uppercase">{{ t('common.loading') }}</p>
    </div>

    <!-- 1. 좌측 패널: Navigation Console (PC 전용 다중 패널) -->
    <aside v-if="hasDestination" class="w-full lg:w-[420px] bg-surface-container-highest/90 backdrop-blur-3xl border-r border-white/10 flex flex-col z-30 shadow-[20px_0_50px_rgba(0,0,0,0.5)] order-2 lg:order-1">
      
      <!-- 상단: 목적지 및 상태 Hero -->
      <div class="p-lg border-b border-white/5 bg-primary/5">
        <div class="flex justify-between items-start mb-8">
          <button @click="router.back()" class="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
            <span class="material-symbols-outlined">close</span>
          </button>
          <div class="px-4 py-2 bg-status-low/20 rounded-full border border-status-low/30 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-status-low animate-pulse"></span>
            <span class="text-xs font-bold text-status-low uppercase tracking-widest">{{ t('map.liveTracking') }}</span>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-[2rem] overflow-hidden border-2 border-primary/30 shadow-2xl relative">
            <img :src="destination.image" class="w-full h-full object-cover" />
            <div v-if="opStore.isRerouting" class="absolute inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center">
              <span class="material-symbols-outlined text-on-primary animate-spin">sync</span>
            </div>
          </div>
          <div>
            <span class="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{{ t('map.destinationLabel') }}</span>
            <h1 class="text-3xl font-display-lg leading-none mt-1">{{ resolveI18nText({ key: destination.nameKey, t, te, context: 'routeGuide:hero:name' }) }}</h1>
            <p class="text-on-surface-variant font-bold mt-2">{{ t('map.details.etaValue', { min: 3 }) }} • {{ t('map.remaining', { dist: 40 }) }}</p>
          </div>
        </div>
      </div>

      <!-- 중앙: Turn-by-Turn 가이드 -->
      <div class="flex-1 overflow-y-auto px-lg py-xl space-y-10 no-scrollbar relative">
        <!-- 수직 가이드 라인 -->
        <div class="absolute left-[59px] top-24 bottom-24 w-[2px] bg-gradient-to-b from-primary/50 via-white/10 to-transparent"></div>

        <div v-for="(step, idx) in routeSteps" :key="step.id" 
             class="flex gap-8 group transition-all duration-700"
             :class="idx + 1 === currentStepIndex ? 'scale-105 origin-left' : 'opacity-30 blur-[1px]'">
          
          <div class="relative z-10">
            <div :class="'w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 ' + (idx + 1 === currentStepIndex ? 'bg-primary text-on-primary ring-[12px] ring-primary/20 scale-110' : 'bg-surface-container border border-white/10')">
              <span class="material-symbols-outlined text-3xl">{{ step.icon }}</span>
            </div>
          </div>

          <div class="flex-1 pt-1">
            <div class="flex justify-between items-baseline mb-2">
              <h3 class="text-2xl font-bold">{{ step.title }}</h3>
              <span class="text-lg font-black text-primary">{{ step.dist }}</span>
            </div>
            <p class="text-lg text-on-surface-variant font-medium leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <!-- 하단: 메인 컨트롤 -->
      <div class="p-lg bg-surface-container-highest border-t border-white/5 space-y-md">
        <div class="grid grid-cols-2 gap-md">
          <button @click="currentStepIndex = Math.max(1, currentStepIndex - 1)" 
                  class="py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">{{ t('common.back') }}</button>
          <button @click="currentStepIndex = Math.min(routeSteps.length, currentStepIndex + 1)" 
                  class="py-4 rounded-2xl bg-primary text-on-primary font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all">{{ t('common.more') }}</button>
        </div>
        <button v-if="currentStepIndex === routeSteps.length"
                @click="handleArrival"
                class="w-full bg-secondary text-on-secondary py-5 rounded-2xl font-display-lg text-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
          {{ t('map.arrival') }}
        </button>
      </div>
    </aside>

    <!-- 2. 중앙 패널: Spatial Navigation Map -->
    <main v-if="hasDestination" class="flex-1 relative order-1 lg:order-2 bg-surface-dark overflow-hidden">
      <!-- 배경 그리드 및 Spatial 레이어 -->
      <div class="absolute inset-0 map-grid opacity-20"></div>
      
      <!-- 상단 컨트롤러: 층수 및 접근성 토글 -->
      <div class="absolute top-12 left-12 z-20 flex flex-col gap-sm">
        <div class="glass-panel p-2 rounded-3xl border border-white/10 flex flex-col gap-2 shadow-2xl">
          <button v-for="f in [3, 2, 1]" :key="f" 
                  @click="opStore.currentFloor = f"
                  :class="'w-14 h-14 rounded-2xl font-bold text-xl flex items-center justify-center transition-all ' + (opStore.currentFloor === f ? 'bg-primary text-on-primary' : 'hover:bg-white/5 text-on-surface-variant')">
            {{ f }}F
          </button>
        </div>
        
        <!-- 접근성 모드 퀵 토글 -->
        <button @click="opStore.isAccessibilityMode = !opStore.isAccessibilityMode"
                :class="'glass-panel px-6 py-4 rounded-[2rem] border transition-all flex items-center gap-3 shadow-2xl ' + (opStore.isAccessibilityMode ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-surface/40 border-white/10 text-on-surface-variant')">
          <span class="material-symbols-outlined">{{ opStore.isAccessibilityMode ? 'accessible' : 'directions_walk' }}</span>
          <span class="font-bold whitespace-nowrap">{{ opStore.isAccessibilityMode ? t('map.accessibleRoute') : t('map.normalRoute') }}</span>
        </button>
      </div>

      <!-- 실시간 혼잡도 및 위치 오버레이 (PC 우측 상단) -->
      <div class="absolute top-12 right-12 z-20 flex flex-col gap-md items-end hidden lg:flex">
        <div class="glass-panel p-5 rounded-[2rem] border border-white/10 flex items-center gap-5 shadow-2xl bg-surface/40 backdrop-blur-2xl min-w-[280px]">
          <div class="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-3xl">my_location</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{{ t('map.currentPosition') }}</span>
            <span class="text-xl font-bold">{{ t('map.navigation.locationLobby') }}</span>
            <span class="text-xs text-primary font-medium mt-0.5">{{ t('map.accuracy', { value: '0.5m' }) }} • {{ t('map.trackingInfo') }}</span>
          </div>
        </div>
      </div>

      <!-- 메인 공간 지도 엔진 (SVG Spatial Path) -->
      <div class="absolute inset-0 flex items-center justify-center">
        <svg class="w-[120%] h-[120%] opacity-80" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="spatialGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="routeFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#00dbe9;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#d1bcff;stop-opacity:1" />
            </linearGradient>
          </defs>

          <!-- 층 평면 시각화 레이어 (추상화) -->
          <rect x="200" y="200" width="600" height="600" rx="40" fill="none" stroke="rgba(0, 219, 233, 0.1)" stroke-width="2" />
          
          <!-- 경로 경로 (Glow 효과 포함) -->
          <path :d="opStore.isAccessibilityMode ? 'M 500 850 L 500 400 L 200 400 L 200 200' : 'M 500 850 L 500 550 L 800 550 L 800 200'" 
                fill="none" 
                stroke="url(#routeFlow)" 
                stroke-width="16" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                filter="url(#glow)"
                class="route-path-animation"
                :stroke-dasharray="opStore.isRerouting ? '1, 30' : '30, 20'"
          />

          <!-- 실시간 이동 방향 화살표 (Path 기반) -->
          <circle r="8" fill="#fff">
            <animateMotion :path="opStore.isAccessibilityMode ? 'M 500 850 L 500 400 L 200 400 L 200 200' : 'M 500 850 L 500 550 L 800 550 L 800 200'" 
                           dur="3s" repeatCount="indefinite" />
          </circle>

          <!-- 사용자 위치 및 목적지 노드 -->
          <g transform="translate(500, 850)">
            <circle r="40" fill="#00dbe9" opacity="0.1">
              <animate attributeName="r" values="40;60;40" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="16" fill="#00dbe9" stroke="#fff" stroke-width="4" />
          </g>

          <g :transform="opStore.isAccessibilityMode ? 'translate(200, 200)' : 'translate(800, 200)'">
            <circle r="24" fill="#d1bcff" />
            <circle r="10" fill="#fff" />
          </g>
        </svg>
      </div>

      <!-- 퀵 내비게이션 플로팅 메뉴 -->
      <div class="absolute bottom-12 right-12 z-40 flex flex-col items-end gap-md">
        <transition name="slide-up">
          <div v-if="showQuickNav" class="flex flex-col gap-sm mb-4">
            <button v-for="item in [
              { id: 'toilet-1', nameKey: 'spaces.toilet1.name', icon: 'wc', color: 'bg-blue-500' },
              { id: 'exit-west', nameKey: 'map.nearbyExit', icon: 'logout', color: 'bg-red-500' },
              { id: 'c-cu1', nameKey: 'spaces.cCu1.name', icon: 'help', color: 'bg-amber-500' }
            ]" :key="item.id" 
            @click="quickNav(item.id)"
            class="glass-panel px-6 py-4 rounded-[2rem] border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all shadow-2xl scale-in">
              <div :class="'w-10 h-10 rounded-xl ' + item.color + ' flex items-center justify-center text-white'">
                <span class="material-symbols-outlined">{{ item.icon }}</span>
              </div>
              <span class="font-bold">{{ resolveI18nText({ key: item.nameKey, t, te, context: `routeGuide:quickNav:${item.id}:name` }) }}</span>
            </button>
          </div>
        </transition>

        <button @click="showQuickNav = !showQuickNav" 
                :class="'w-20 h-20 rounded-[2.5rem] shadow-2xl flex items-center justify-center transition-all ' + (showQuickNav ? 'bg-on-surface text-surface-dark rotate-45' : 'bg-primary text-on-primary hover:scale-105')">
          <span class="material-symbols-outlined text-4xl">add</span>
        </button>
      </div>
    </main>

    <!-- 3. 우측 패널: Operational Intelligence (PC 전용) -->
    <aside v-if="hasDestination" class="hidden xl:flex w-[320px] bg-surface-container-high/50 backdrop-blur-2xl border-l border-white/10 flex-col z-30 order-3">
      <div class="p-lg border-b border-white/5">
        <h3 class="text-xl font-bold flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">insights</span>
          {{ t('homeV2.operationalIntelligence') }}
        </h3>
      </div>
      
      <div class="flex-1 p-lg space-y-lg overflow-y-auto no-scrollbar">
        <!-- 경로 혼잡도 분석 -->
        <div class="glass-panel p-6 rounded-3xl bg-white/5 border border-white/5">
          <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4 block">{{ t('map.routeCongestion') }}</span>
          <div class="flex items-end justify-between mb-4">
            <span class="text-4xl font-black text-status-low">{{ t('map.status.optimal') }}</span>
            <span class="text-xs font-bold text-on-surface-variant">{{ t('map.status.noCongestion') }}</span>
          </div>
          <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-status-low w-[15%]"></div>
          </div>
        </div>

        <!-- 주변 시설 탐지 -->
        <div class="space-y-md">
          <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block px-2">{{ t('homeV2.nearbyFacilities') }}</span>
          <div v-for="f in [
            { nameKey: 'spaces.toilet1.name', dist: '15m', icon: 'wc' },
            { nameKey: 'map.filters.info', dist: '25m', icon: 'height' },
            { nameKey: 'spaces.medical.name', dist: '40m', icon: 'water_drop' }
          ]" :key="f.nameKey" 
          class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-on-surface-variant">{{ f.icon }}</span>
              <span class="font-bold text-sm">{{ resolveI18nText({ key: f.nameKey, t, te, context: 'routeGuide:nearby:facility' }) }}</span>
            </div>
            <span class="text-xs font-bold text-primary">{{ f.dist }}</span>
          </div>
        </div>

        <!-- 안전 가이드 -->
        <div class="p-6 rounded-3xl bg-error/10 border border-error/20 flex flex-col gap-3">
          <div class="flex items-center gap-2 text-error">
            <span class="material-symbols-outlined">security</span>
            <span class="font-bold text-sm">{{ t('map.status.safetyGuide') }}</span>
          </div>
          <p class="text-xs leading-relaxed text-on-surface-variant font-medium">
            {{ t('map.status.safetyDesc', { name: 'Hall B' }) }}
          </p>
        </div>
      </div>
    </aside>

    <!-- 모바일 전용 상단 미니 배너 -->
    <div v-if="hasDestination" class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface-container-highest/80 backdrop-blur-xl border-b border-white/10 p-4 pt-10 flex items-center justify-between">
       <button @click="router.back()" class="p-2">
         <span class="material-symbols-outlined">arrow_back</span>
       </button>
       <div class="flex flex-col items-center">
         <span class="text-[10px] font-black text-primary uppercase tracking-widest">{{ t('map.navigatingTo') }}</span>
         <span class="font-bold text-sm">{{ resolveI18nText({ key: destination.nameKey, t, te, context: 'routeGuide:mobile:name' }) }}</span>
       </div>
       <div class="w-10"></div>
    </div>

  </div>
</template>

<style scoped>
.map-grid {
  background-image: 
    linear-gradient(to right, rgba(0, 219, 233, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 219, 233, 0.05) 1px, transparent 1px);
  background-size: 80px 80px;
}

.route-path-animation {
  stroke-dashoffset: 1000;
  animation: dash 40s linear infinite;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dash {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.glass-panel {
  backdrop-filter: blur(40px);
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.4);
}
</style>
