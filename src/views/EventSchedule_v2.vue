<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 프리미엄 이벤트 스케줄 V2 (Timeline Premium)
 * 타임라인 중심의 세련된 디자인과 다음 세션 카운트다운 기능을 제공합니다.
 * 실시간 진행 상태와 카테고리별 컬러 코딩을 통해 직관적인 일정 확인이 가능합니다.
 */
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { logger } from '@/utils/logger'
import { useEventsStore } from '@/stores/events'
import { toMinutes, getNowMinutes } from '@/utils/date'

const { t, te } = useI18n({ useScope: 'global' })
const router = useRouter()
const eventsStore = useEventsStore()
import { resolveI18nText } from '@/utils/i18nResolver'
const scope = 'EventSchedule_v2'

// 상태 관리
const activeDay = ref('friday')

/**
 * 선택된 요일의 이벤트 목록
 */
const dayEvents = computed(() => {
  return eventsStore.processedEvents.filter(e => e.day === activeDay.value)
})

/**
 * 카테고리별 테마 컬러 매핑
 */
const getCategoryColor = (category) => {
  const colors = {
    keynote: 'text-secondary bg-secondary/10 border-secondary/20',
    exhibition: 'text-primary bg-primary/10 border-primary/20',
    networking: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    workshop: 'text-status-low bg-status-low/10 border-status-low/20'
  }
  return colors[category] || 'text-on-surface-variant bg-white/5 border-white/10'
}

onMounted(() => {
  logger.info(scope, '프리미엄 이벤트 스케줄 화면 진입')
  
  // 현재 요일로 자동 설정 (데이터가 있는 경우)
  if (eventsStore.currentDay && ['friday', 'saturday', 'sunday'].includes(eventsStore.currentDay)) {
    activeDay.value = eventsStore.currentDay
  }

  eventsStore.startTicker()
})

onUnmounted(() => {
  logger.info(scope, '화면 이탈')
  eventsStore.stopTicker()
})
</script>

<template>
  <div class="min-h-screen bg-surface-dark text-on-surface p-safe-top pb-32 overflow-x-hidden">
    <!-- 배경 장식 -->
    <div class="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
      <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full"></div>
    </div>

    <div class="max-w-5xl mx-auto px-margin-mobile sm:px-lg pt-12 relative z-10">
      <!-- 헤더 섹션 -->
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-[2px] bg-primary"></span>
            <span class="text-xs font-black text-primary uppercase tracking-[0.4em]">VX Event Protocol</span>
          </div>
          <h1 class="font-display-lg text-display-lg text-on-surface leading-none tracking-tight">{{ t('events.timeline.title') }}</h1>
          <p class="font-body-lg text-on-surface-variant max-w-md">{{ t('events.timeline.subtitle') }}</p>
        </div>

        <!-- 다음 세션 카운트다운 카드 -->
        <div v-if="eventsStore.nextSession" class="glass-panel p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-6 min-w-[320px]">
          <div class="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary animate-pulse">
            <span class="material-symbols-outlined text-[28px]">timer</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-primary uppercase tracking-widest">{{ t('homeV2.nextSchedule') }}</span>
            <span class="font-bold text-on-surface truncate max-w-[180px]">{{ eventsStore.nextSession.title }}</span>
            <span class="text-xs text-on-surface-variant mt-0.5">{{ eventsStore.countdownText }}</span>
          </div>
        </div>
      </header>

      <!-- 요일 탭 선택기 -->
      <nav class="flex items-center p-1 bg-surface-container-low/50 border border-white/5 rounded-2xl mb-12 w-full overflow-x-auto no-scrollbar">
        <button 
          v-for="day in ['friday', 'saturday', 'sunday']" 
          :key="day"
          @click="activeDay = day"
          class="flex-1 py-4 px-6 rounded-xl font-bold transition-all whitespace-nowrap"
          :class="activeDay === day ? 'bg-primary text-on-primary shadow-xl scale-[1.02]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'"
        >
          {{ t(`events.days.${day}.label`) }}
        </button>
      </nav>

      <!-- 타임라인 컨텐츠 -->
      <div class="relative">
        <!-- 타임라인 수직선 -->
        <div class="absolute left-0 sm:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/50 via-white/10 to-transparent sm:-translate-x-1/2 hidden sm:block"></div>

        <div class="space-y-12">
          <div 
            v-for="(event, index) in dayEvents" 
            :key="event.id"
            class="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12"
            :class="index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'"
          >
            <!-- 시간 표시 (중앙 정렬용) -->
            <div class="sm:absolute sm:left-1/2 sm:-translate-x-1/2 z-20 hidden sm:flex items-center justify-center">
              <div class="w-4 h-4 rounded-full bg-surface-dark border-2 border-primary shadow-[0_0_10px_rgba(0,240,255,0.5)]"></div>
            </div>

            <!-- 타임 스탬프 -->
            <div 
              class="w-full sm:w-[calc(50%-48px)] flex"
              :class="index % 2 === 0 ? 'sm:justify-end' : 'sm:justify-start'"
            >
              <div class="flex flex-col" :class="index % 2 === 0 ? 'sm:items-end' : 'sm:items-start'">
                <span class="text-3xl font-black text-primary/40 tracking-tighter">{{ event.time }}</span>
                <span :class="`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 border ${getCategoryColor(event.category)}`">
                  {{ t(`events.filters.${event.category}`) }}
                </span>
              </div>
            </div>

            <!-- 이벤트 카드 -->
            <div class="w-full sm:w-[calc(50%-48px)]">
              <div 
                class="glass-panel group p-6 rounded-[2rem] bg-surface-container-high/40 border border-white/5 hover:border-primary/30 transition-all cursor-pointer hover:translate-y-[-4px]"
                :class="{ 'border-primary/40 bg-primary/5': event.runtimeStatus === 'ongoing' }"
              >
                <div class="flex justify-between items-start mb-4">
                  <div class="flex items-center gap-2" v-if="event.runtimeStatus === 'ongoing'">
                    <span class="flex h-2 w-2 rounded-full bg-status-low animate-ping"></span>
                    <span class="text-[10px] font-bold text-status-low uppercase">{{ t('common.live') }}</span>
                  </div>
                  <span v-else class="text-[10px] font-bold text-on-surface-variant uppercase">{{ event.location }}</span>
                  <button class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-[20px]">bookmark</span>
                  </button>
                </div>

                <h3 class="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">{{ event.title }}</h3>
                <p class="text-on-surface-variant text-sm line-clamp-2 mb-6">{{ event.description }}</p>

                <div class="flex items-center justify-between">
                  <div class="flex -space-x-2">
                    <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full border-2 border-surface-dark bg-surface-container overflow-hidden">
                      <img src="/src/assets/IMG_2798.jpg" class="w-full h-full object-cover opacity-80" />
                    </div>
                  </div>
                  <button class="text-xs font-bold text-primary flex items-center gap-1 group/btn">
                    {{ t('events.timeline.details') }}
                    <span class="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-if="dayEvents.length === 0" class="flex flex-col items-center justify-center py-32 text-center">
        <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-4xl text-on-surface-variant/30">event_busy</span>
        </div>
        <p class="text-on-surface-variant font-body-lg">{{ t('events.timeline.noEvents') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.glass-panel {
  backdrop-filter: blur(40px);
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.4);
}
</style>
