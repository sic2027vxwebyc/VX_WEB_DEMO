import { createRouter, createWebHistory } from 'vue-router'
import { logger } from '../utils/logger'
import i18n from '../i18n'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
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
      component: () => import('../views/Viewer360View.vue'),
      meta: { titleKey: 'navigation.spatialIntelligence' }
    },
    {
      path: '/route-guide/:id',
      name: 'route-guide',
      component: () => import('../views/RouteGuideView.vue'),
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
      component: () => import('../views/InteractiveMapView.vue'),
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
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationHubView.vue'),
      meta: { titleKey: 'navigation.notifications' }
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventScheduleView.vue'),
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

export default router
