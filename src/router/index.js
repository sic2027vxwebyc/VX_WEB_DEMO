import { createRouter, createWebHashHistory } from 'vue-router'
import { logger } from '../utils/logger'
import i18n from '../i18n'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home_v2.vue'),
      meta: { titleKey: 'navigation.home' }
    },
    {
      path: '/v2',
      name: 'home-v2',
      component: () => import('../views/Home_v2.vue'),
      meta: { titleKey: 'navigation.home' }
    },
    {
      path: '/directory',
      name: 'directory',
      component: () => import('../views/SpaceDirectoryView.vue'),
      meta: { titleKey: 'navigation.explore' }
    },
    {
      path: '/space/:id',
      name: 'space-detail',
      component: () => import('../views/SpaceDetailView.vue'),
      meta: { titleKey: 'common.details' }
    },
    {
      path: '/viewer-360/:id',
      name: 'viewer-360',
      component: () => import('../views/Viewer360Live.vue'),
      meta: { titleKey: 'navigation.spatialIntelligence' }
    },
    {
      path: '/route-guide/:id',
      name: 'route-guide',
      component: () => import('../views/RouteGuideLive.vue'),
      meta: { titleKey: 'navigation.newRoute' }
    },
    {
      path: '/ar-navigation/:id',
      name: 'ar-navigation',
      component: () => import('../views/ArNavigationView.vue'),
      meta: { titleKey: 'navigation.map' }
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/views/InteractiveMapLive.vue'),
      meta: { titleKey: 'navigation.map' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminDashboardView.vue'),
      meta: { titleKey: 'navigation.admin' }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { titleKey: 'navigation.settings' }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpQaView.vue'),
      meta: { titleKey: 'navigation.help' }
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationHubLive.vue'),
      meta: { titleKey: 'navigation.notifications' }
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventScheduleLive.vue'),
      meta: { titleKey: 'navigation.events' }
    },
    {
      path: '/events-v2',
      name: 'events-v2',
      component: () => import('../views/EventSchedule_v2.vue'),
      meta: { titleKey: 'navigation.events' }
    },
    {
      path: '/arrival-success',
      name: 'arrival-success',
      component: () => import('../views/ArrivalSuccessView.vue'),
      meta: { titleKey: 'map.arrival' }
    },
    {
      path: '/booking-confirmed',
      name: 'booking-confirmed',
      component: () => import('../views/BookingConfirmedView.vue'),
      meta: { titleKey: 'booking.confirmed' }
    },
    {
      path: '/access-restricted',
      name: 'access-restricted',
      component: () => import('../views/AccessRestrictedView.vue'),
      meta: { titleKey: 'errors.restricted.title' }
    },
    {
      path: '/connection-error',
      name: 'connection-error',
      component: () => import('../views/ConnectionErrorView.vue'),
      meta: { titleKey: 'errors.connection.title' }
    },
    // V2 가상화/게임화 라우트
    {
      path: '/v2/stamp-event',
      name: 'stamp-event-v2',
      component: () => import('../views/v2/stamp/StampEvent_v2.vue'),
      meta: { titleKey: 'navigation.stamp' }
    },
    {
      path: '/v2/stamp-event/scan',
      name: 'qr-scanner-v2',
      component: () => import('../views/v2/stamp/QrScannerMock_v2.vue'),
      meta: { titleKey: 'navigation.stamp' }
    },
    {
      path: '/v2/passport',
      name: 'passport-v2',
      component: () => import('../views/v2/stamp/ConventionPassport_v2.vue'),
      meta: { titleKey: 'navigation.passport' }
    },
    {
      path: '/v2/quests',
      name: 'quests-v2',
      component: () => import('../views/v2/stamp/QuestHub_v2.vue'),
      meta: { titleKey: 'navigation.quests' }
    },
    {
      path: '/v2/badges',
      name: 'badges-v2',
      component: () => import('../views/v2/stamp/BadgeCollection_v2.vue'),
      meta: { titleKey: 'navigation.badges' }
    },
    {
      path: '/v2/reward',
      name: 'reward-v2',
      component: () => import('../views/v2/stamp/RewardClaim_v2.vue'),
      meta: { titleKey: 'navigation.reward' }
    }
  ]
})

// 라우트 진입 및 타이틀 업데이트 로직
router.afterEach((to) => {
  const titleKey = to.meta.titleKey
  if (titleKey) {
    const title = i18n.global.t(titleKey)
    document.title = `${title} | VX Web Demo`
  }
  logger.info('Router', `페이지 이동 완료: ${to.path}`)
})

router.beforeEach((to, from, next) => {
  logger.debug('Router', `페이지 이동 시작: ${from.path} -> ${to.path}`)
  next()
})

router.onError((error, to) => {
  logger.error('Router', '라우트 컴포넌트 로딩 실패', {
    path: to.fullPath,
    message: error.message
  })
})

export default router
