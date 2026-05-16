<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 실시간 이벤트 스케줄 - 라이브 (EventScheduleLive)
 * 공간 기반 타임라인, 내 일정(즐겨찾기), 실시간Focus 및 다중 패널 레이아웃을 제공합니다.
 * "국제대회 하루 흐름과 공간 이동을 연결하는 살아있는 Timeline"을 구현한 최종 진화형 일정 화면입니다.
 */
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { logger } from '@/utils/logger'
import { useEventsStore } from '@/stores/events'
import { useOperationalStore } from '@/stores/operational'
import { toMinutes, getNowMinutes } from '@/utils/date'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
const eventsStore = useEventsStore()
const opStore = useOperationalStore()
const scope = 'EventScheduleLive'

// 상태 관리
const activeDay = ref('friday')
const showOnlyFavorites = ref(false)
const timelineScrollRef = ref(null)
const timer = ref(null)
const notification = ref(null)

/**
 * 필터링된 이벤트 목록
 */
const filteredEvents = computed(() => {
  let list = eventsStore.processedEvents.filter(e => e.day === activeDay.value)
  if (showOnlyFavorites.value) {
    list = list.filter(e => e.isFavorite)
  }
  return list
})

/**
 * 다음 세션 카운트다운 텍스트
 */
/**
 * 현재 세션 자동 포커스 (스크롤)
 */
const autoFocusCurrent = () => {
  nextTick(() => {
    const currentEl = document.querySelector('.session-ongoing')
    if (currentEl) {
      currentEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      logger.info(scope, '현재 진행 중인 세션으로 화면이 자동 이동되었습니다.')
    }
  })
}

/**
 * 알림 생성 시뮬레이션
 */
const checkReminders = () => {
  const next = eventsStore.nextSession
  if (next && next.reminderEnabled) {
    const nowMin = getNowMinutes(new Date())
    const startMin = toMinutes(next.normalizedTime)
    if (startMin - nowMin === 10) {
      notification.value = {
        title: t('events.live.approaching'),
        message: t('events.live.approachingDesc', { period: t('common.morning'), min: 10, hall: next.hallId.toUpperCase() })
      }
      setTimeout(() => { notification.value = null }, 8000)
    }
  }
}

const navigateToHall = (hallId) => {
  logger.info(scope, '일정 확인 후 길찾기 시작: ' + hallId)
  router.push('/route-guide/' + hallId)
}

onMounted(() => {
  logger.info(scope, '라이브 타임라인 화면 진입')

  if (eventsStore.currentDay && ['friday', 'saturday', 'sunday'].includes(eventsStore.currentDay)) {
    activeDay.value = eventsStore.currentDay
  }

  setTimeout(autoFocusCurrent, 500)

  eventsStore.startTicker()
  timer.value = setInterval(() => {
    checkReminders()
  }, 30000)
})

onUnmounted(() => {
  eventsStore.stopTicker()
  if (timer.value) clearInterval(timer.value)
})

watch(activeDay, () => {
  setTimeout(autoFocusCurrent, 300)
})

const getCategoryBadgeClass = (cat) => {
  const map = {
    baptism: 'bg-secondary/20 text-secondary border-secondary/30',
    talk: 'bg-primary/20 text-primary border-primary/30',
    drama: 'bg-tertiary/20 text-tertiary border-tertiary/30',
    symposium: 'bg-status-moderate/20 text-status-moderate border-status-moderate/30'
  }
  return map[cat] || 'bg-white/5 text-on-surface-variant border-white/10'
}
</script>

<template>
  <div class="min-h-screen bg-surface-dark text-on-surface p-safe-top pb-32 overflow-hidden flex flex-col">

    <!-- 1. 리얼타임 상단 안내 레이어 -->
    <header class="flex-shrink-0 pt-12 px-margin-mobile md:px-margin-desktop mb-12 relative z-10">
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div class="space-y-4">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 bg-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-[0.2em] border border-primary/30">{{ t('events.live.realTimeSchedule') }}</span>
              <span class="text-on-surface-variant font-bold text-sm">{{ t('events.subtitle') }}</span>
            </div>
            <h1 class="text-display-lg font-display-lg leading-none">{{ t('events.title') }}</h1>
          </div>
        </div>

        <!-- 실시간 카운트다운 카드 -->
        <div class="glass-panel p-6 rounded-[2rem] border border-white/10 bg-surface-container-high/40 flex items-center gap-6 min-w-[340px]">
          <div class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-[0_0_20px_rgba(0,219,233,0.4)]">
            <span class="material-symbols-outlined text-3xl">schedule</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] font-black text-primary uppercase tracking-widest">Next Event Flow</span>
            <span class="text-lg font-bold truncate max-w-[200px]">{{ eventsStore.nextSession?.title || t('events.live.completedMessage') }}</span>
            <span class="text-sm font-bold text-on-surface-variant">{{ eventsStore.countdownText }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 2. 메인 컨텐츠 영역 (PC 다중 패널 / 모바일 타임라인) -->
    <main class="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-margin-mobile md:px-margin-desktop gap-lg overflow-hidden">

      <!-- 좌측: 타임라인 메인 (Focus & Scroll) -->
      <section class="flex-1 flex flex-col gap-md h-full overflow-hidden">
        <!-- 필터 컨트롤러 -->
        <nav class="flex flex-shrink-0 items-center justify-between gap-4 p-2 bg-white/5 rounded-3xl border border-white/5 mb-4">
          <div class="flex items-center gap-1 p-1 bg-surface-dark/50 rounded-2xl">
            <button v-for="day in ['friday', 'saturday', 'sunday']" :key="day"
                    @click="activeDay = day"
                    :class="'px-6 py-3 rounded-xl font-bold text-sm transition-all ' + (activeDay === day ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:text-on-surface')">
              {{ t('events.days.' + day + '.label') }}
            </button>
          </div>
          <button @click="showOnlyFavorites = !showOnlyFavorites"
                  :class="'px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border transition-all ' + (showOnlyFavorites ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-white/5 border-white/10 text-on-surface-variant')">
            <span class="material-symbols-outlined text-[20px]">{{ showOnlyFavorites ? 'star' : 'star_outline' }}</span>
            {{ t('events.live.mySchedule') }}
          </button>
        </nav>

        <!-- 타임라인 스크롤 영역 -->
        <div ref="timelineScrollRef" class="flex-1 overflow-y-auto pr-4 no-scrollbar space-y-8 relative">
          <!-- 타임라인 수직 축 -->
          <div class="absolute left-[27px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary/30 via-white/10 to-transparent"></div>

          <div v-for="event in filteredEvents" :key="event.id"
               :class="['relative flex gap-8 transition-all duration-500', event.runtimeStatus === 'ongoing' ? 'session-ongoing' : '', event.runtimeStatus === 'completed' ? 'opacity-40' : '']">

            <!-- 시간 마커 -->
            <div class="relative flex flex-col items-center flex-shrink-0 pt-2">
              <div :class="'w-14 h-14 rounded-[1.2rem] flex flex-col items-center justify-center z-10 transition-all duration-500 ' + (event.runtimeStatus === 'ongoing' ? 'bg-primary text-on-primary ring-8 ring-primary/20 scale-110 shadow-2xl' : 'bg-surface-container border border-white/10')">
                <span class="text-xs font-black leading-none">{{ event.time.split(':')[0] }}</span>
                <span class="text-[10px] opacity-60">{{ event.time.split(':')[1] }}</span>
              </div>
            </div>

            <!-- 세션 카드 -->
            <div :class="'flex-1 glass-panel p-6 rounded-[2.5rem] border transition-all hover:translate-y-[-4px] group ' + (event.runtimeStatus === 'ongoing' ? 'bg-primary/5 border-primary/40' : 'bg-white/5 border-white/5')">
              <div class="flex justify-between items-start mb-4">
                <div class="flex flex-wrap gap-2">
                  <span :class="'px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ' + getCategoryBadgeClass(event.category)">
                    {{ t('events.filters.' + event.category) }}
                  </span>
                  <div v-if="event.runtimeStatus === 'ongoing'" class="flex items-center gap-1.5 px-3 py-1 bg-status-low/20 rounded-lg">
                    <span class="w-1.5 h-1.5 rounded-full bg-status-low animate-ping"></span>
                    <span class="text-[9px] font-black text-status-low uppercase">Live Now</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="eventsStore.toggleReminder(event.id)" 
                          :class="'p-2 rounded-xl transition-colors ' + (event.reminderEnabled ? 'text-primary' : 'text-on-surface-variant hover:bg-white/10')">
                    <span class="material-symbols-outlined text-[20px]">{{ event.reminderEnabled ? 'notifications_active' : 'notifications_none' }}</span>
                  </button>
                  <button @click="eventsStore.toggleFavorite(event.id)" 
                          :class="'p-2 rounded-xl transition-colors ' + (event.isFavorite ? 'text-secondary' : 'text-on-surface-variant hover:bg-white/10')">
                    <span class="material-symbols-outlined text-[20px]" :style="event.isFavorite ? 'font-variation-settings: \'FILL\' 1' : ''">{{ event.isFavorite ? 'star' : 'star_outline' }}</span>
                  </button>
                </div>
              </div>

              <h3 class="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">{{ event.title }}</h3>

              <div class="flex items-center justify-between mt-6">
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-1.5 text-on-surface-variant">
                    <span class="material-symbols-outlined text-sm">location_on</span>
                    <span class="text-xs font-bold">{{ event.hallId.replace('-', ' ').toUpperCase() }}</span>
                  </div>
                  <div class="w-1 h-1 rounded-full bg-white/10"></div>
                  <span class="text-[10px] font-medium text-on-surface-variant">{{ event.speaker || t('events.live.internationalDelegation') }}</span>
                </div>

                <button @click="navigateToHall(event.hallId)" 
                        class="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-black text-primary hover:bg-primary/20 transition-all flex items-center gap-2">
                  {{ t('common.routing') }} <span class="material-symbols-outlined text-sm">near_me</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 우측: 정보 패널 (PC 전용 Operational Console) -->
      <aside class="hidden xl:flex w-[380px] flex-col gap-lg h-full overflow-hidden">
        <!-- 현재 진행 요약 -->
        <div class="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-primary/5">
          <h3 class="text-xl font-bold flex items-center gap-3 mb-8">
            <span class="material-symbols-outlined text-primary">bolt</span>
            {{ t('events.live.operationalInfo') }}
          </h3>
          <div class="space-y-6">
            <div class="p-6 bg-white/5 rounded-3xl border border-white/5">
               <span class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-4">Current Status</span>
               <div class="flex items-center justify-between">
                 <span class="text-sm font-bold">{{ t('common.morning') }} {{ t('events.filters.all') }}</span>
                 <span class="px-3 py-1 bg-status-low/20 text-status-low text-[10px] font-black rounded-lg">ACTIVE</span>
               </div>
               <div class="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div class="h-full bg-primary w-[65%] shadow-[0_0_10px_#00f0ff]"></div>
               </div>
            </div>
            <div class="p-6 bg-white/5 rounded-3xl border border-white/5">
               <span class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-4">{{ t('events.live.expectedCrowd') }}</span>
               <div class="flex items-end justify-between">
                 <span class="text-3xl font-black">{{ t('events.live.moderate').toUpperCase() }}</span>
                 <span class="text-[10px] font-bold text-on-surface-variant">{{ t('events.live.occupied', { percent: 65 }) }}</span>
               </div>
            </div>
          </div>
        </div>

        <!-- 긴급 공지 패널 -->
        <div class="glass-panel p-8 rounded-[2.5rem] border border-white/10 flex-1 overflow-hidden flex flex-col">
           <div class="flex items-center justify-between mb-8 flex-shrink-0">
             <h3 class="text-xl font-bold">{{ t('notifications.title') }}</h3>
             <span class="w-2 h-2 rounded-full bg-error animate-pulse"></span>
           </div>
           <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
             <div v-for="n in opStore.emergencyNotices" :key="n.id" 
                  :class="['p-4 rounded-2xl border transition-all ', n.type === 'emergency' ? 'bg-error/10 border-error/20 text-error' : 'bg-white/5 border-white/5 text-on-surface-variant']">
               <p class="text-xs font-bold leading-relaxed">{{ n.message }}</p>
             </div>
           </div>
        </div>
      </aside>
    </main>

    <!-- 3. 실시간 알림 토스트 (Reminder) -->
    <Transition name="slide-up">
      <div v-if="notification" 
           class="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md glass-panel p-6 rounded-[2.5rem] bg-surface-container-high/95 backdrop-blur-3xl border border-primary/30 shadow-2xl flex items-center gap-6">
        <div class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on-primary shrink-0">
          <span class="material-symbols-outlined text-3xl">notifications_active</span>
        </div>
        <div>
          <h4 class="text-lg font-bold">{{ notification.title }}</h4>
          <p class="text-sm text-on-surface-variant font-medium mt-1">{{ notification.message }}</p>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.glass-panel {
  backdrop-filter: blur(50px);
  box-shadow: 0 20px 80px -20px rgba(0, 0, 0, 0.4);
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translate(-50%, -40px); opacity: 0; }

.session-ongoing {
  animation: sessionFocus 2s infinite ease-in-out;
}

@keyframes sessionFocus {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.1)); }
  50% { filter: drop-shadow(0 0 25px rgba(0, 240, 255, 0.3)); }
}
</style>

