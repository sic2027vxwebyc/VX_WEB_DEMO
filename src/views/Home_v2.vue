<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 실시간 공간 운영 홈 (V2)
 * 실시간 상태, 프로그램 일정, 대형 액션 버튼 중심의 UX를 제공합니다.
 * 고령층 접근성과 실시간 국제대회 운영 느낌을 극대화했습니다.
 */
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useSpacesStore } from '@/stores/spaces'
import { useOperationalStore } from '@/stores/operational'
import { useEventsStore } from '@/stores/events'
import { useConventionPhase } from '@/composables/useConventionPhase'
import { resolveI18nText } from '@/utils/i18nResolver'
import miniMapImg from '@/assets/스크린샷 2026-05-17 오전 12.46.11.png'

const scope = 'Home_v2'
const router = useRouter()
const route = useRoute()
const { t, te } = useI18n({ useScope: 'global' })
const spacesStore = useSpacesStore()
const opStore = useOperationalStore()
const eventsStore = useEventsStore()
const { heroMode, heroMessageKey, isSessionLive, countdownText, currentProgress } = useConventionPhase()

// 실시간 시뮬레이션 타이머
let updateTimer = null

// 공간 데이터 준비 상태 확인
const hasSpacesReady = computed(() => 
  spacesStore.isLoaded && spacesStore.spaces.length > 0
)

// 현재 위치 공간 정보 (안전한 접근)
const currentSpace = computed(() => {
  if (!hasSpacesReady.value) return null
  return spacesStore.getSpaceById(opStore.currentHallId) || null
})

// 현재 공간 이름 (번역 가드)
const currentSpaceName = computed(() => {
  if (!hasSpacesReady.value || !currentSpace.value?.nameKey) return ''
  return resolveI18nText({ 
    key: currentSpace.value.nameKey, 
    t, 
    te, 
    context: 'homeV2:currentSpace' 
  })
})

// 주변 공간 정보 (목업)
const nearbySpaces = computed(() => {
  if (!hasSpacesReady.value) return []
  // 현재 공간을 제외한 상위 3개 공간을 주변 공간으로 시뮬레이션
  return spacesStore.spaces
    .filter(s => s.id !== opStore.currentHallId)
    .slice(0, 3)
})

// 번역된 주변 공간 목록 (번역 가드)
const localizedNearbySpaces = computed(() => {
  if (!hasSpacesReady.value) return []
  return nearbySpaces.value
    .filter(s => Boolean(s?.nameKey))
    .map(s => ({
      ...s,
      name: resolveI18nText({
        key: s.nameKey,
        t,
        te,
        context: `homeV2:nearbySpaces:${s.id}`
      })
    }))
})

// 현재 혼잡도 수준 색상 및 텍스트
const congestionInfo = computed(() => {
  const hallId = eventsStore.currentSession?.hallId || opStore.currentHallId
  const data = opStore.congestionData[hallId] || { level: 'low' }
  const config = {
    low: { color: 'text-status-low', label: t('homeV2.status.low'), bg: 'bg-status-low/10' },
    moderate: { color: 'text-status-moderate', label: t('homeV2.status.moderate'), bg: 'bg-status-moderate/10' },
    high: { color: 'text-status-high', label: t('homeV2.status.high'), bg: 'bg-status-high/10' }
  }
  return config[data.level] || config.low
})

/**
 * 네비게이션 핸들러
 */
const navigateTo = (path) => {
  logger.info(scope, `페이지 이동: ${path}`)
  router.push(path)
}

/**
 * Harness Engineering: URL 쿼리 파라미터 기반 Mock 시간 설정
 */
const checkMockNow = () => {
  const mockTime = route.query.mockNow
  if (mockTime) {
    eventsStore.setMockNow(mockTime)
  } else {
    eventsStore.clearMockNow()
  }
}

watch(() => route.query.mockNow, checkMockNow)

onMounted(async () => {
  logger.info(scope, '실시간 운영 홈 V2 페이지가 마운트되었습니다.')
  await spacesStore.fetchSpaces()
  checkMockNow()
  opStore.clearNavigationState()
  eventsStore.startTicker()
  // 실시간 시뮬레이션 시작
  updateTimer = setInterval(() => {
    opStore.simulateUpdates()
  }, 10000)
})

onUnmounted(() => {
  if (updateTimer) clearInterval(updateTimer)
  eventsStore.stopTicker()
  logger.info(scope, '실시간 운영 홈 V2 페이지가 언마운트되었습니다.')
})
</script>

<template>
  <div class="px-margin-mobile md:px-margin-desktop pb-xl pt-4">
    <!-- 1. 실시간 운영 헤더 (공지 티커) -->
    <div v-if="opStore.emergencyNotices.length > 0" class="mb-lg overflow-hidden bg-error-container/20 border border-error-container/30 rounded-2xl p-1 backdrop-blur-md">
      <div class="flex items-center gap-md px-4 py-2 animate-pulse-slow">
        <span class="material-symbols-outlined text-error shrink-0">campaign</span>
        <div class="flex-1 overflow-hidden">
          <p class="text-on-error-container font-bold truncate">
            {{ resolveI18nText({ key: opStore.emergencyNotices[0].messageKey, t, te, context: 'homeV2:ticker' }) }}
          </p>
        </div>
        <button @click="navigateTo('/notifications')" class="text-xs text-error font-bold uppercase tracking-widest shrink-0 border-l border-error-container/30 pl-3">
          {{ t('homeV2.viewAll') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-lg">
      <!-- 2. 실시간 상태 Hero 카드 (핵심 정보) -->
      <section class="lg:col-span-7 relative group">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div class="relative flex flex-col justify-between bg-surface-container-high rounded-[2.5rem] p-xl lg:p-12 min-h-[420px] overflow-hidden border border-white/10">
          <!-- 배경 공간감 -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          <div class="relative z-10 h-full flex flex-col">
            <div class="flex items-center gap-3 mb-8">
              <div class="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-status-low animate-pulse"></span>
                <span class="text-primary font-bold text-sm tracking-tight">{{ t('homeV2.liveOperating') }}</span>
              </div>
              <div v-if="heroMode === 'liveEvent'" :class="`px-4 py-1.5 ${congestionInfo.bg} border border-white/5 rounded-full backdrop-blur-xl flex items-center gap-2`">
                <span :class="`text-sm font-bold ${congestionInfo.color}`">{{ t('homeV2.congestion') }}: {{ congestionInfo.label }}</span>
              </div>
            </div>

            <div class="flex-1">
              <div v-if="spacesStore.isLoading" class="h-16 w-64 bg-white/5 animate-pulse rounded-xl mb-4"></div>
              <h2 v-else class="text-display-lg font-display-lg text-on-surface mb-2 tracking-tight">
                {{ currentSpaceName || 'KINTEX' }}
              </h2>
              
              <!-- 1. 회기 진행 중 모드 (Live Schedule) -->
              <template v-if="heroMode === 'liveEvent' && eventsStore.currentSession">
                <p class="text-headline-md text-on-surface-variant font-medium mb-12">
                  {{ t('homeV2.currentlyIn') }}
                </p>
                <div class="flex items-end gap-6 mb-8">
                  <div class="flex flex-col">
                    <span class="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">{{ t('events.status.ongoing') }}</span>
                    <div class="flex items-baseline gap-2">
                      <span class="text-6xl font-display-lg text-primary tabular-nums">{{ currentProgress }}</span>
                      <span class="text-2xl font-bold text-on-surface-variant">%</span>
                    </div>
                  </div>
                  <div class="h-16 w-[1px] bg-white/10 mx-2 mb-2"></div>
                  <div class="flex flex-col max-w-[320px]">
                    <span class="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">{{ t('homeV2.currentlyIn') }}</span>
                    <span class="text-xl font-bold text-on-surface line-clamp-2">{{ eventsStore.currentSession.title }}</span>
                  </div>
                </div>
                <div v-if="eventsStore.nextSession" class="flex items-center gap-4 py-4 px-6 bg-white/5 rounded-2xl border border-white/5 max-w-fit">
                  <span class="text-label-sm text-on-surface-variant font-bold uppercase tracking-widest">{{ t('homeV2.nextProgram') }}</span>
                  <span class="text-on-surface font-medium">{{ eventsStore.nextSession.title }}</span>
                </div>
              </template>

              <!-- 2. 회기 사이 휴식/대기 모드 (Between Sessions) -->
              <template v-else-if="heroMode === 'betweenSessions' && eventsStore.nextSession">
                <p class="text-headline-sm text-on-surface-variant font-medium mb-8 whitespace-pre-line leading-relaxed">
                  {{ t(heroMessageKey) }}
                </p>
                <div class="flex items-end gap-6 mb-8">
                  <div class="flex flex-col">
                    <span class="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">{{ t('homeV2.nextSchedule') }}</span>
                    <div class="flex items-baseline gap-2">
                      <span class="text-3xl font-display-lg text-primary tabular-nums">{{ countdownText }}</span>
                    </div>
                  </div>
                  <div class="h-16 w-[1px] bg-white/10 mx-2 mb-2"></div>
                  <div class="flex flex-col max-w-[320px]">
                    <span class="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">{{ t('homeV2.nextProgram') }}</span>
                    <span class="text-xl font-bold text-on-surface line-clamp-2">{{ eventsStore.nextSession.title }}</span>
                  </div>
                </div>
              </template>

              <!-- 3. 시작 전 / 종료 후 메시지 모드 (Phase Message) -->
              <template v-else>
                <p class="text-headline-sm text-on-surface-variant font-medium mb-8 whitespace-pre-line leading-relaxed">
                  {{ t(heroMessageKey) }}
                </p>
                <div v-if="eventsStore.nextSession" class="flex items-end gap-6 mb-8">
                   <div class="flex flex-col">
                    <span class="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">{{ t('homeV2.nextSchedule') }}</span>
                    <div class="flex items-baseline gap-2">
                      <span class="text-3xl font-display-lg text-primary tabular-nums">{{ countdownText }}</span>
                    </div>
                  </div>
                  <div class="h-16 w-[1px] bg-white/10 mx-2 mb-2"></div>
                  <div class="flex flex-col max-w-[320px]">
                    <span class="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">{{ t('homeV2.nextProgram') }}</span>
                    <span class="text-xl font-bold text-on-surface line-clamp-2">{{ eventsStore.nextSession.title }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="relative z-10 flex gap-md mt-auto">
            <button 
              @click="navigateTo(`/route-guide/${opStore.currentHallId}`)"
              class="flex-1 bg-primary text-on-primary py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(0,219,233,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span class="material-symbols-outlined text-3xl">directions_run</span>
              {{ t('homeV2.startRouting') }}
            </button>
            <button 
              @click="navigateTo('/events')"
              class="flex-1 bg-white/5 border border-white/10 text-on-surface py-5 rounded-2xl font-bold text-xl backdrop-blur-xl hover:bg-white/10 active:scale-95 transition-all"
            >
              {{ t('homeV2.todaySchedule') }}
            </button>
          </div>
        </div>
      </section>

      <!-- 3. 실시간 혼잡도 및 미니맵 (사이드) -->
      <aside class="lg:col-span-5 grid grid-cols-1 gap-lg">
        <!-- 인터랙티브 미니맵 카드 -->
        <div class="bg-surface-container rounded-[2.5rem] p-lg border border-white/5 overflow-hidden flex flex-col group cursor-pointer" @click="navigateTo('/map')">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-headline-md font-bold">{{ t('homeV2.nearbySpaces') }}</h3>
            <span class="material-symbols-outlined text-primary group-hover:rotate-45 transition-transform">north_east</span>
          </div>
          <div class="relative flex-1 rounded-3xl overflow-hidden bg-surface-dark/50 min-h-[180px]">
            <img 
              class="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
              :src="miniMapImg"
            />
            <!-- 현재 위치 표시 -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div class="relative flex items-center justify-center h-12 w-12">
                <div class="absolute animate-ping h-full w-full rounded-full bg-primary opacity-30"></div>
                <div class="relative h-6 w-6 bg-primary rounded-full border-4 border-surface-container shadow-2xl"></div>
              </div>
            </div>
          </div>
          <p class="mt-4 text-on-surface-variant text-label-lg">
            <template v-if="spacesStore.isLoading">
              <span class="inline-block w-32 h-4 bg-white/5 animate-pulse rounded"></span>
            </template>
            <template v-else>
              {{ currentSpaceName || 'KINTEX' }}
            </template>
            • {{ t('map.optimalFlow') }} 0.5m
          </p>
        </div>

        <!-- 스탬프 투어 및 대형 퀵 액션 그리드 -->
        <div class="grid grid-cols-1 gap-lg">
          <!-- 스탬프 투어 배너 -->
          <button @click="navigateTo('/v2/stamp-event')" 
                  class="bg-gradient-to-br from-secondary/20 to-tertiary/20 rounded-[2.5rem] p-8 border border-secondary/30 flex items-center justify-between group hover:scale-[1.02] transition-all overflow-hidden relative">
            <!-- 배경 데코레이션 -->
            <div class="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <span class="material-symbols-outlined text-[10rem]">military_tech</span>
            </div>
            
            <div class="flex items-center gap-6 relative z-10 text-left">
              <div class="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary shadow-lg">
                <span class="material-symbols-outlined text-4xl font-black">qr_code_scanner</span>
              </div>
              <div>
                <h3 class="text-2xl font-black text-on-surface">{{ t('gamification.stampTour') }}</h3>
                <p class="text-sm text-on-surface-variant font-medium mt-1">{{ t('gamification.challengeDesc') }}</p>
              </div>
            </div>
            <div class="h-12 w-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center relative z-10 shadow-xl group-hover:rotate-45 transition-transform">
              <span class="material-symbols-outlined font-black">arrow_forward</span>
            </div>
          </button>

          <div class="grid grid-cols-2 gap-md">
            <button @click="navigateTo('/settings')" class="bg-surface-container-high rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-surface-container-highest transition-all">
              <span class="material-symbols-outlined text-primary text-4xl">language</span>
              <span class="font-bold text-lg">{{ t('common.language') }}</span>
            </button>
            <button @click="navigateTo('/directory')" class="bg-surface-container-high rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-surface-container-highest transition-all">
              <span class="material-symbols-outlined text-primary text-4xl">chair</span>
              <span class="font-bold text-lg">{{ t('homeV2.findSeat') }}</span>
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- 4. PC 전용: 하단 실시간 타임라인 및 상태 (데스크톱 전용 레이아웃 확장) -->
    <section class="mt-xl hidden lg:block">
      <div class="flex items-center justify-between mb-lg">
        <h3 class="text-headline-md font-bold flex items-center gap-3">
          <span class="w-2 h-8 bg-primary rounded-full"></span>
          {{ t('homeV2.operationalIntelligence') }}
        </h3>
        <div class="flex items-center gap-md">
          <span class="text-on-surface-variant text-sm">{{ t('common.lastUpdated') }}: {{ opStore.lastUpdated.toLocaleTimeString() }}</span>
          <button class="px-4 py-2 bg-white/5 rounded-xl text-sm font-bold border border-white/10 hover:bg-white/10 transition-all">{{ t('common.refresh') }}</button>
        </div>
      </div>

      <div class="bg-surface-container rounded-[2.5rem] p-lg border border-white/5">
        <div class="grid grid-cols-4 gap-lg">
          <div v-for="event in eventsStore.processedEvents.slice(0, 4)" :key="event.id" 
               class="relative p-6 rounded-3xl bg-surface-dark/50 border border-white/5 group hover:bg-surface-dark transition-all">
            <div class="flex justify-between items-start mb-4">
              <span class="text-sm font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">{{ event.time }}</span>
              <span v-if="event.runtimeStatus === 'ongoing'" class="flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-low opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-status-low"></span>
              </span>
            </div>
            <h4 class="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{{ event.title }}</h4>
            <p class="text-on-surface-variant text-sm">{{ event.zone }}</p>
            <div class="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div v-if="event.runtimeStatus === 'ongoing'" class="h-full bg-primary w-1/2 animate-shimmer"></div>
              <div v-else-if="event.runtimeStatus === 'completed'" class="h-full bg-on-surface-variant/30 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgba(219, 252, 255, 0.1) 0%,
    rgba(219, 252, 255, 0.6) 50%,
    rgba(219, 252, 255, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.glass-card {
  @apply bg-white/5 backdrop-blur-[40px] border border-white/10;
}
</style>
