<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 경로 안내(내비게이션) 뷰
 * 목적지까지의 단계별 경로, 실시간 위치 지도, 예상 소요 시간 및 내비게이션 옵션을 제공합니다.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'
import ArFallbackPanel from '@/components/map/ArFallbackPanel.vue'

const route = useRoute()
const router = useRouter()
const spacesStore = useSpacesStore()
const { t } = useI18n({ useScope: 'global' })
const scope = 'RouteGuide'

// AR 폴백 여부 확인
const showArFallback = computed(() => route.query.ar_fallback === 'true' || !!route.query.error)
const fallbackReason = computed(() => {
  if (route.query.error === 'camera') return 'denied'
  if (route.query.ar_fallback === 'true') return 'unsupported'
  return 'error'
})

// 목적지 정보 (스토어에서 가져옴)
const destination = computed(() => {
  return spacesStore.getSpaceById(route.params.id) || spacesStore.getSpaceById('hall-1')
})

// 경로 단계 생성
const routeSteps = computed(() => {
  const name = destination.value.name
  return [
    { id: 1, title: t('map.step1Title'), desc: t('map.step1Desc'), icon: 'straight', status: 'active', dist: t('map.current') },
    { id: 2, title: t('map.step2Title'), desc: t('map.step2Desc'), icon: 'turn_right', status: 'pending', dist: '15m' },
    { id: 3, title: t('map.step3Title', { name }), desc: t('map.step3Desc'), icon: 'meeting_room', status: 'pending', dist: '10m' }
  ]
})

// 현재 목적지 데이터
const currentRoute = computed(() => {
  return {
    ...destination.value,
    time: destination.value.category === 'exhibition' ? `3${t('common.minutes')}` : `1${t('common.minutes')}`,
    steps: routeSteps.value,
    alert: t('map.alert', { name: destination.value.name })
  }
})

// 내비게이션 설정 상태
const preferences = ref({
  avoidStairs: true,
  voiceGuidance: false
})

/**
 * 컴포넌트 마운트 시 로그 기록 및 내비게이션 서비스 시작
 */
onMounted(() => {
  logger.info(scope, `경로 안내(목적지: ${currentRoute.value.name})를 시작합니다.`)
  logger.info(scope, '최적의 경로가 계산되었습니다.')
})

/**
 * 컴포넌트 언마운트 시 로그 기록
 */
onUnmounted(() => {
  logger.info(scope, '경로 안내 서비스를 종료합니다.')
})

/**
 * 설정 토글 핸들러
 */
const togglePreference = (key) => {
  preferences.value[key] = !preferences.value[key]
  logger.debug(scope, `내비게이션 설정이 변경되었습니다: ${key}`, { status: preferences.value[key] })
}

/**
 * 도착 완료 처리
 */
const handleArrival = () => {
  logger.info(scope, `목적지(${currentRoute.value.name})에 도착했습니다.`)
  router.push('/arrival-success')
}
</script>

<template>
  <div class="pt-8 pb-12 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto min-h-[calc(100vh-64px)]">
    <!-- AR 폴백 안내 (필요 시 표시) -->
    <div v-if="showArFallback" class="mb-lg">
      <ArFallbackPanel 
        :reason="fallbackReason" 
        @use-map="router.replace({ query: {} })"
        @use-qr="logger.info(scope, 'QR 인식 시작 요청')"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-lg h-full">
      <!-- 왼쪽 열: 안내 정보 및 설정 -->
      <div class="col-span-12 lg:col-span-4 flex flex-col gap-md">
        <!-- 목적지 미리보기 -->
        <div class="glass-panel p-md rounded-xl flex items-center gap-md shadow-lg border-primary/20">
          <div class="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-outline-variant/30">
            <img 
              :alt="currentRoute.name" 
              class="w-full h-full object-cover" 
              :src="currentRoute.image"
            />
          </div>
          <div class="flex-grow">
            <span class="font-label-sm text-label-sm text-surface-tint uppercase tracking-widest">{{ t('map.destination') }}</span>
            <h2 class="font-headline-md text-headline-md text-surface-dark dark:text-on-surface">{{ currentRoute.name }}</h2>
            <div class="flex items-center text-on-surface-variant">
              <span class="material-symbols-outlined text-sm mr-xs">near_me</span>
              <span class="font-label-lg text-label-lg">{{ t('map.remaining', { dist: currentRoute.distance }) }}</span>
            </div>
          </div>
        </div>

        <!-- 도착 예정 시간 및 상태 -->
        <div class="glass-panel p-lg rounded-xl flex justify-between items-center bg-primary/5 border-l-4 border-l-surface-tint shadow-md">
          <div>
            <span class="font-label-sm text-on-surface-variant">{{ t('map.eta') }}</span>
            <div class="flex items-baseline gap-sm">
              <span class="font-display-lg text-display-lg text-surface-tint">{{ currentRoute.time }}</span>
              <span class="font-label-lg text-on-surface-variant">{{ t('map.walking') }}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="flex items-center justify-end text-status-low mb-xs">
              <span class="material-symbols-outlined text-sm mr-xs" style="font-variation-settings: 'FILL' 1;">check_circle</span>
              <span class="font-label-lg font-bold">{{ t('map.optimalFlow') }}</span>
            </div>
            <span class="font-label-sm text-on-surface-variant">{{ t('map.congestion') }}: {{ currentRoute.congestion }}</span>
          </div>
        </div>

        <!-- 경로 환경 설정 -->
        <div class="glass-panel p-md rounded-xl space-y-md shadow-md border-black/5 dark:border-white/5">
          <h3 class="font-label-lg text-on-surface-variant uppercase tracking-wider">{{ t('map.guideSettings') }}</h3>
          <div class="space-y-sm">
            <div 
              @click="togglePreference('avoidStairs')"
              class="flex items-center justify-between p-sm hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer border border-transparent"
            >
              <div class="flex items-center gap-sm">
                <span class="material-symbols-outlined text-surface-tint">accessible_forward</span>
                <span class="font-body-md text-surface-dark dark:text-on-surface">{{ t('map.avoidStairs') }}</span>
              </div>
              <div class="w-10 h-5 rounded-full relative transition-colors" :class="preferences.avoidStairs ? 'bg-surface-tint' : 'bg-black/10 dark:bg-surface-container-highest'">
                <div class="absolute top-0.5 w-4 h-4 rounded-full transition-all" :class="preferences.avoidStairs ? 'right-0.5 bg-on-primary' : 'left-0.5 bg-outline'"></div>
              </div>
            </div>
            <div 
              @click="togglePreference('voiceGuidance')"
              class="flex items-center justify-between p-sm hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer border border-transparent"
            >
              <div class="flex items-center gap-sm">
                <span class="material-symbols-outlined text-on-surface-variant">record_voice_over</span>
                <span class="font-body-md text-surface-dark dark:text-on-surface">{{ t('map.voiceGuidance') }}</span>
              </div>
              <div class="w-10 h-5 rounded-full relative transition-colors" :class="preferences.voiceGuidance ? 'bg-surface-tint' : 'bg-black/10 dark:bg-surface-container-highest'">
                <div class="absolute top-0.5 w-4 h-4 rounded-full transition-all" :class="preferences.voiceGuidance ? 'right-0.5 bg-on-primary' : 'left-0.5 bg-outline'"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 액션 버튼 -->
        <div class="mt-auto grid grid-cols-2 gap-sm">
          <button class="glass-panel py-md flex flex-col items-center justify-center gap-base rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm">
            <span class="material-symbols-outlined text-surface-dark dark:text-on-surface">pause_circle</span>
            <span class="font-label-sm uppercase tracking-tighter text-on-surface-variant">{{ t('map.pause') }}</span>
          </button>
          <button class="glass-panel py-md flex flex-col items-center justify-center gap-base rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm">
            <span class="material-symbols-outlined text-security-alert">report_problem</span>
            <span class="font-label-sm uppercase tracking-tighter text-on-surface-variant">{{ t('map.reportObstacle') }}</span>
          </button>
          <button 
            @click="handleArrival"
            class="col-span-2 bg-primary text-on-primary py-lg rounded-xl font-headline-md font-bold shadow-[0_0_20px_rgba(0,219,233,0.4)] active:scale-95 transition-all"
          >
            {{ t('map.arrival') }}
          </button>
        </div>
      </div>

      <!-- 중간 열: 인터랙티브 실시간 지도 -->
      <div class="col-span-12 lg:col-span-5 h-[400px] lg:h-full relative">
        <div class="glass-panel rounded-[24px] overflow-hidden h-full border border-black/5 dark:border-white/10 relative shadow-2xl">
          <!-- 지도 배경 -->
          <div class="absolute inset-0 bg-surface-light dark:bg-surface-container-lowest">
            <div class="absolute inset-0 opacity-10 map-grid"></div>
            <div class="absolute inset-0 p-lg">
              <div class="w-full h-full border-2 border-outline-variant/20 rounded-lg relative overflow-hidden">
                <!-- 경로 라인 -->
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 400 600">
                  <path class="route-glow" d="M 200 550 Q 250 400 150 300 T 200 50" fill="none" stroke="#00dbe9" stroke-dasharray="12 8" stroke-width="4"></path>
                  <!-- 사용자 위치 -->
                  <circle cx="200" cy="550" fill="#00dbe9" r="10"></circle>
                  <circle cx="200" cy="550" fill="#00dbe9" fill-opacity="0.2" r="20">
                    <animate attributeName="r" dur="2s" repeatCount="indefinite" values="20;30;20"></animate>
                  </circle>
                  <!-- 목적지 -->
                  <circle cx="200" cy="50" fill="#00dbe9" r="12"></circle>
                </svg>
              </div>
            </div>
          </div>
          <!-- 지도 오버레이 -->
          <div class="absolute top-md left-md">
            <div class="glass-panel px-md py-sm rounded-full flex items-center gap-sm shadow-lg border-primary/20">
              <span class="material-symbols-outlined text-surface-tint" style="font-size: 20px;">layers</span>
              <span class="font-label-lg text-label-lg text-surface-dark dark:text-on-surface">{{ t('map.currentFloor', { floor: 1, name: t('map.mainLobby') }) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽 열: 단계별 가이드 -->
      <div class="col-span-12 lg:col-span-3 flex flex-col gap-md">
        <div class="glass-panel p-md rounded-xl flex items-center justify-between shadow-md">
          <h3 class="font-headline-md text-headline-md text-surface-dark dark:text-on-surface">{{ t('map.steps') }}</h3>
          <span class="font-label-lg text-on-surface-variant">{{ t('map.stepsRemaining', { count: currentRoute.steps.length }) }}</span>
        </div>
        
        <div class="flex flex-col gap-sm relative overflow-y-auto no-scrollbar">
          <!-- 수직 연결선 -->
          <div class="absolute left-[27px] top-10 bottom-10 w-0.5 bg-black/5 dark:bg-outline-variant/30"></div>
          
          <!-- 단계별 카드 -->
          <div 
            v-for="step in currentRoute.steps" 
            :key="step.id"
            class="glass-panel p-md rounded-xl relative z-10 transition-all duration-300 shadow-sm"
            :class="step.status === 'active' ? 'border-l-4 border-l-surface-tint bg-primary/10 dark:bg-primary/5 shadow-lg' : 'opacity-60'"
          >
            <div class="flex items-start gap-md">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                :class="step.status === 'active' ? 'bg-surface-tint shadow-[0_0_12px_rgba(0,219,233,0.5)]' : 'bg-black/5 dark:bg-surface-container-highest border border-outline-variant'"
              >
                <span class="material-symbols-outlined" :class="step.status === 'active' ? 'text-on-primary' : 'text-on-surface-variant'" style="font-size: 20px;">{{ step.icon }}</span>
              </div>
              <div class="flex-grow">
                <div class="flex justify-between items-start">
                  <p class="font-body-lg font-bold" :class="step.status === 'active' ? 'text-surface-dark dark:text-on-surface' : 'text-on-surface-variant'">{{ step.title }}</p>
                  <span class="font-label-lg" :class="step.status === 'active' ? 'text-surface-tint' : 'text-on-surface-variant'">{{ step.dist }}</span>
                </div>
                <p class="font-body-md text-on-surface-variant">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 환경 지능 알림 카드 -->
        <div class="glass-panel p-md rounded-xl mt-md border border-tertiary-fixed/30 bg-tertiary-fixed/5 shadow-md">
          <div class="flex items-center gap-sm mb-sm">
            <span class="material-symbols-outlined text-tertiary-fixed">info</span>
            <h4 class="font-label-lg text-tertiary-fixed font-bold">{{ t('map.spaceAlert') }}</h4>
          </div>
          <p class="font-body-md text-on-surface-variant leading-relaxed">
            {{ currentRoute.alert }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-grid {
  background-image: 
    linear-gradient(to right, rgba(219, 252, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(219, 252, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}
.route-glow {
  filter: drop-shadow(0 0 8px #00dbe9);
}
</style>
