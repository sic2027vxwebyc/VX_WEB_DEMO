/**
 * [ 알림 스토어 ]
 * 긴급 공지(Red Alert), 운영 안내, 분실물, 날씨, 교통 정보를 통합 관리합니다.
 * 알림의 우선순위(Critical, Warning, Info)에 따른 필터링과 상태 관리를 지원합니다.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useNotificationStore = defineStore('notification', () => {
  const { t } = useI18n({ useScope: 'global' })

  // 알림 데이터 (시뮬레이션용)
  const notificationsData = ref([
    {
      id: 'alert-1',
      type: 'evacuation',
      priority: 'critical',
      targetId: 'exit-west',
      avoidZoneIds: ['north-gate'],
      isRead: false
    },
    {
      id: 'alert-2',
      type: 'emergency',
      priority: 'critical',
      targetId: 'hall-2',
      isRead: false
    },
    {
      id: 'alert-3',
      type: 'traffic',
      priority: 'warning',
      isRead: false
    },
    {
      id: 'alert-4',
      type: 'lost-found',
      priority: 'info',
      targetId: 'c-cu1',
      isRead: true
    },
    {
      id: 'alert-5',
      type: 'weather',
      priority: 'warning',
      isRead: true
    },
    {
      id: 'alert-6',
      type: 'operational',
      priority: 'info',
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

  // 현재 활성화된 필터 탭
  const activeTab = ref('all')

  const filteredNotifications = computed(() => {
    if (activeTab.value === 'all') return notifications.value
    if (activeTab.value === 'emergency') return notifications.value.filter(n => n.priority === 'critical')
    return notifications.value.filter(n => n.type === activeTab.value)
  })

  // 최우선 긴급 알림 (Red Alert 용)
  const criticalAlerts = computed(() => {
    return notifications.value.filter(n => n.priority === 'critical' && !n.isRead)
  })

  const markAsRead = (id) => {
    const noti = notificationsData.value.find(n => n.id === id)
    if (noti) noti.isRead = true
  }

  const clearAll = () => {
    notificationsData.value = notificationsData.value.filter(n => n.priority === 'critical')
  }

  return {
    notificationsData,
    notifications,
    activeTab,
    filteredNotifications,
    criticalAlerts,
    markAsRead,
    clearAll
  }
})
