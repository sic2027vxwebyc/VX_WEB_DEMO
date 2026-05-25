<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 실시간 알림 허브 - 라이브 (NotificationHubLive)
 * Red Alert 긴급 모드, 카테고리별 공지(대피, 교통 등), 고대비 접근성 UI를 제공합니다.
 * "혼란을 줄이고 즉각적인 안전 행동을 유도하는 플랫폼"을 구현한 최종 진화형 공지 화면입니다.
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const notiStore = useNotificationStore()
const { t } = useI18n({ useScope: 'global' })
const scope = 'NotificationHubLive'

// 탭 정의
const tabs = computed(() => [
  { id: 'all', label: t('common.viewAll'), icon: 'apps' },
  { id: 'emergency', label: t('homeV2.emergencyNotice'), icon: 'emergency_home' },
  { id: 'evacuation', label: t('notifications.evacuation'), icon: 'exit_to_app' },
  { id: 'lost-found', label: t('notifications.lost-found'), icon: 'search_check' },
  { id: 'weather', label: t('notifications.weather'), icon: 'wb_sunny' },
  { id: 'traffic', label: t('notifications.traffic'), icon: 'directions_bus' }
])

// 아이콘 매핑 데이터
const tabIcons = {
  evacuation: 'exit_to_app',
  emergency: 'emergency_home',
  'lost-found': 'search_check',
  weather: 'wb_sunny',
  traffic: 'directions_bus',
  operational: 'settings_input_component'
}

const navigateToRoute = (targetId) => {
  logger.info(scope, '긴급 공지 기반 길찾기 시작: ' + targetId)
  router.push('/route-guide/' + targetId)
}

const navigateToMap = () => {
  router.push('/map')
}

onMounted(() => {
  logger.info(scope, '라이브 알림 센터 활성화')
})

const getPriorityClass = (priority) => {
  if (priority === 'critical') return 'bg-error/20 border-error/40 text-error'
  if (priority === 'warning') return 'bg-status-moderate/20 border-status-moderate/40 text-status-moderate'
  return 'bg-white/5 border-white/10 text-on-surface-variant'
}
</script>

<template>
  <div class="min-h-screen bg-surface-dark text-on-surface p-safe-top pb-32 flex flex-col">
    
    <!-- 1. Red Alert 상단 고정 안내 (최우선 긴급 상황 시 노출) -->
    <Transition name="slide-down">
      <div v-if="notiStore.criticalAlerts.length > 0" 
           class="bg-error p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(244,67,54,0.3)] z-50">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
            <span class="material-symbols-outlined text-4xl text-white">emergency</span>
          </div>
          <div class="flex flex-col">
            <h2 class="text-2xl md:text-3xl font-black text-white leading-none tracking-tight">
              {{ notiStore.criticalAlerts[0].title }}
            </h2>
            <p class="text-white/90 font-bold mt-2 text-lg">{{ notiStore.criticalAlerts[0].content }}</p>
          </div>
        </div>
        <div class="flex gap-4 w-full md:w-auto">
          <button @click="navigateToRoute(notiStore.criticalAlerts[0].targetId)"
                  class="flex-1 md:flex-none px-10 py-4 bg-white text-error rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl">
            {{ t('notifications.viewEvacuationRoute') }}
          </button>
          <button @click="notiStore.markAsRead(notiStore.criticalAlerts[0].id)"
                  class="px-6 py-4 border-2 border-white/30 text-white rounded-2xl font-bold">{{ t('common.confirm') }}</button>
        </div>
      </div>
    </Transition>

    <!-- 2. 메인 컨텐츠 영역 -->
    <div class="max-w-5xl mx-auto w-full px-margin-mobile md:px-lg pt-12 flex-1 flex flex-col overflow-hidden">
      
      <header class="mb-12 flex justify-between items-end">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-[0.2em] border border-primary/30">{{ t('homeV2.situationalAwareness') }}</span>
          </div>
          <h1 class="text-5xl font-display-lg leading-none tracking-tight">{{ t('homeV2.situationalAwareness') }}</h1>
        </div>
        <button @click="notiStore.clearAll" class="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors pb-2 underline">
          {{ t('notifications.clearAll') }}
        </button>
      </header>

      <!-- 3. 카테고리 탭 네비게이션 -->
      <nav class="flex items-center gap-3 overflow-x-auto no-scrollbar pb-8 flex-shrink-0">
        <button v-for="tab in tabs" :key="tab.id"
                @click="notiStore.activeTab = tab.id"
                :class="['px-6 py-4 rounded-[1.5rem] font-bold text-sm flex items-center gap-3 transition-all border shrink-0 ', 
                         notiStore.activeTab === tab.id ? 'bg-primary text-on-primary border-primary shadow-2xl scale-105' : 'bg-white/5 border-white/5 text-on-surface-variant hover:bg-white/10']">
          <span class="material-symbols-outlined text-[20px]">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>

      <!-- 4. 알림 리스트 영역 -->
      <div class="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-lg">
        <TransitionGroup name="list">
          <div v-for="noti in notiStore.filteredNotifications" :key="noti.id"
               class="glass-panel p-8 rounded-[2.5rem] border transition-all relative overflow-hidden group"
               :class="[!noti.isRead ? 'bg-white/5 border-white/20 shadow-2xl' : 'bg-transparent border-white/5 opacity-50']">
            
            <!-- 우선순위 인디케이터 -->
            <div class="flex justify-between items-start mb-6">
              <div :class="['px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ', getPriorityClass(noti.priority)]">
                {{ noti.priority.toUpperCase() }}
              </div>
              <span class="text-[11px] font-bold text-on-surface-variant uppercase opacity-60">{{ noti.time }}</span>
            </div>

            <div class="flex gap-8">
              <!-- 아이콘 -->
              <div :class="['w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-2xl ', 
                            noti.priority === 'critical' ? 'bg-error/20 text-error' : 'bg-white/5 text-on-surface-variant']">
                <span class="material-symbols-outlined text-4xl">
                  {{ tabIcons[noti.type] || 'info' }}
                </span>
              </div>

              <!-- 내용 -->
              <div class="flex-1">
                <h3 class="text-2xl font-bold mb-3">{{ noti.title }}</h3>
                <p class="text-lg text-on-surface-variant font-medium leading-relaxed mb-8">{{ noti.content }}</p>
                
                <!-- 하단 액션 버튼 -->
                <div class="flex flex-wrap gap-4">
                  <button v-if="noti.targetId" 
                          @click="navigateToRoute(noti.targetId)"
                          class="px-8 py-4 bg-primary text-on-primary rounded-2xl font-black text-sm flex items-center gap-3 shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                    <span class="material-symbols-outlined text-[20px]">near_me</span>
                    {{ t('homeV2.startRouting') }}
                  </button>
                  <button v-if="noti.type === 'evacuation' || noti.type === 'emergency'"
                          @click="navigateToMap"
                          class="px-8 py-4 bg-white/5 border border-white/10 text-on-surface rounded-2xl font-bold text-sm flex items-center gap-3 hover:bg-white/10 transition-all">
                    <span class="material-symbols-outlined text-[20px]">map</span>
                    {{ t('common.mapView') }}
                  </button>
                  <button v-if="!noti.isRead" 
                          @click="notiStore.markAsRead(noti.id)"
                          class="px-8 py-4 text-on-surface-variant font-bold text-sm hover:text-primary transition-colors">
                    {{ t('notifications.markAsRead') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 배경 데코레이션 (유형별) -->
            <div class="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
               <span class="material-symbols-outlined text-[12rem]">{{ tabIcons[noti.type] || 'info' }}</span>
            </div>
          </div>
        </TransitionGroup>

        <!-- 빈 상태 -->
        <div v-if="notiStore.filteredNotifications.length === 0" 
             class="flex flex-col items-center justify-center py-32 opacity-20">
          <span class="material-symbols-outlined text-8xl mb-8">notifications_off</span>
          <p class="text-2xl font-bold tracking-tight">{{ t('notifications.empty') }}</p>
        </div>
      </div>

    </div>

    <!-- 하단 상태 바 (Offline 지원) -->
    <footer class="fixed bottom-0 left-0 right-0 p-4 bg-surface-dark/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-center gap-4 z-40 hidden md:flex">
       <div class="flex items-center gap-2">
         <span class="w-2 h-2 rounded-full bg-status-low shadow-[0_0_10px_#4caf50]"></span>
         <span class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{{ t('homeV2.connectionSecure') }}</span>
       </div>
       <div class="w-[1px] h-3 bg-white/10"></div>
       <span class="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-tighter">{{ t('homeV2.lastSync', { time: t('common.justNow') }) }}</span>
    </footer>

  </div>
</template>

<style scoped>
.glass-panel {
  backdrop-filter: blur(50px);
  box-shadow: 0 20px 80px -20px rgba(0, 0, 0, 0.4);
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-down-enter-from, .slide-down-leave-to { transform: translateY(-100%); opacity: 0; }

.list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-30px); }
</style>
