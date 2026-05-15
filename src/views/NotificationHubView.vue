<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const { t } = useI18n()
const scope = 'NotificationHub'

const notificationsData = ref([
  {
    id: 1,
    type: 'security',
    isRead: false
  },
  {
    id: 2,
    type: 'congestion',
    isRead: false
  },
  {
    id: 3,
    type: 'event',
    isRead: true
  },
  {
    id: 4,
    type: 'system',
    isRead: true
  }
])

/**
 * 번역된 알림 목록
 */
const notifications = computed(() => {
  return notificationsData.value.map(noti => ({
    ...noti,
    title: t(`notifications.items.${noti.id}.title`),
    content: t(`notifications.items.${noti.id}.content`),
    time: t(`notifications.items.${noti.id}.time`)
  }))
})

const markAsRead = (id) => {
  const notification = notificationsData.value.find(n => n.id === id)
  if (notification && !notification.isRead) {
    notification.isRead = true
    logger.debug(scope, `알림 읽음 처리: ${id}`)
  }
}

const clearAll = () => {
  notificationsData.value = []
  logger.info(scope, '모든 알림 삭제')
}

onMounted(() => {
  logger.info(scope, '알림 센터 진입')
})

onUnmounted(() => {
  logger.info(scope, '알림 센터 이탈')
})
</script>

<template>
  <div class="min-h-screen bg-surface-dark text-on-surface p-safe-top pb-32">
    <div class="max-w-3xl mx-auto px-lg pt-xl">
      <header class="flex justify-between items-end mb-xl">
        <div>
          <h1 class="font-display-lg text-display-lg text-primary">{{ t('notifications.title') }}</h1>
          <p class="font-body-lg text-on-surface-variant">{{ t('notifications.subtitle') }}</p>
        </div>
        <button @click="clearAll" class="text-label-lg text-on-surface-variant hover:text-primary transition-colors mb-2">
          {{ t('notifications.clearAll') }}
        </button>
      </header>

      <div v-if="notifications.length > 0" class="space-y-md">
        <div 
          v-for="noti in notifications" 
          :key="noti.id"
          @click="markAsRead(noti.id)"
          class="glass-panel p-lg rounded-2xl flex gap-lg relative transition-all active:scale-[0.98] cursor-pointer"
          :class="!noti.isRead ? 'border-l-4 border-l-primary bg-primary/5' : 'opacity-60'"
        >
          <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-white/5">
            <span class="material-symbols-outlined" :class="{
              'text-security-alert': noti.type === 'security',
              'text-status-high': noti.type === 'congestion',
              'text-primary': noti.type === 'event',
              'text-on-surface-variant': noti.type === 'system'
            }">
              {{ 
                noti.type === 'security' ? 'security' : 
                noti.type === 'congestion' ? 'warning' : 
                noti.type === 'event' ? 'event_note' : 'info' 
              }}
            </span>
          </div>
          
          <div class="flex-grow">
            <div class="flex justify-between items-start mb-xs">
              <h3 class="font-label-lg" :class="!noti.isRead ? 'text-on-surface' : 'text-on-surface-variant'">{{ noti.title }}</h3>
              <span class="text-[10px] text-on-surface-variant uppercase tracking-tighter">{{ noti.time }}</span>
            </div>
            <p class="text-sm text-on-surface-variant leading-relaxed">{{ noti.content }}</p>
          </div>

          <div v-if="!noti.isRead" class="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#00dbe9]"></div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-32 opacity-30">
        <span class="material-symbols-outlined text-6xl mb-md">notifications_off</span>
        <p class="font-label-lg">{{ t('notifications.empty') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
