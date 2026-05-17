<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 사이드 네비게이션 바 컴포넌트
 * 데스크톱 화면에서 주요 메뉴 이동을 담당합니다.
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'
import screenIcon from '@/assets/screen.png'

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })

const isAdminRoute = (path) => path === '/admin' || path.startsWith('/admin/')

// 메뉴 아이템 정의 (실시간 언어 변경을 위해 computed 사용)
const menuItems = computed(() => {
  const items = [
    { name: t('navigation.home'), path: '/', icon: 'home' },
    { name: t('navigation.map'), path: '/map', icon: 'map' },
    { name: t('navigation.events'), path: '/events', icon: 'calendar_today' },
    { name: t('navigation.notifications'), path: '/notifications', icon: 'notifications' },
  ]

  // V2 실험 영역 전용 메뉴
  if (route.path.includes('/v2/') || isAdminRoute(route.path)) {
    items.push({ name: t('navigation.stamp'), path: '/v2/stamp-event', icon: 'qr_code_scanner' })
  }

  // 관리자 섹션 (운영 관제, 리워드 관제, 공지 관리, 도시락 관리, 호텔 관리, 보안 관제)
  items.push({ name: t('navigation.admin'), path: '/admin', icon: 'dashboard' })
  
  if (isAdminRoute(route.path)) {
    items.push({ 
      name: t('navigation.adminOperations'), 
      path: '/admin/operations', 
      icon: 'monitoring',
      isSub: true 
    })
    items.push({ 
      name: t('navigation.adminGamification'), 
      path: '/admin/gamification', 
      icon: 'featured_seasonal_and_gifts',
      isSub: true 
    })
    items.push({ 
      name: t('navigation.adminNotifications'), 
      path: '/admin/notifications', 
      icon: 'notifications_active',
      isSub: true 
    })
    items.push({ 
      name: t('navigation.adminMeals'), 
      path: '/admin/meals', 
      icon: 'restaurant',
      isSub: true 
    })
    items.push({ 
      name: t('navigation.adminHotels'), 
      path: '/admin/hotels', 
      icon: 'hotel',
      isSub: true 
    })
    items.push({ 
      name: t('navigation.adminSecurity'), 
      path: '/admin/security', 
      icon: 'policy',
      isSub: true 
    })
  }

  return items
})

const emit = defineEmits(['navigate'])

/**
 * 메뉴 클릭 시 페이지 이동 요청 이벤트 발생 및 로그 기록
 */
const handleNavClick = (path, name) => {
  logger.info('SideNavBar', `${name} 메뉴로 이동합니다.`, { path })
  emit('navigate', { path, name })
}
</script>

<template>
  <aside class="fixed left-0 top-0 h-full flex flex-col pt-20 pb-8 bg-white/60 dark:bg-surface-dim/60 backdrop-blur-[40px] border-r border-black/5 dark:border-outline-variant/10 shadow-2xl w-64 hidden lg:flex z-40 transition-colors duration-300">
    <div class="px-6 mb-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-primary/10 overflow-hidden border border-primary/20">
          <img :src="screenIcon" alt="Logo" class="w-full h-full object-cover" />
        </div>
        <div>
          <p class="font-label-lg text-label-lg text-surface-dark dark:text-on-surface">{{ t('navigation.spatialIntelligence') }}</p>
          <p class="text-[10px] text-surface-dark/60 dark:text-on-surface-variant uppercase tracking-widest">{{ t('navigation.globalNav') }}</p>
        </div>
      </div>
      <button 
        class="w-full py-3 px-4 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,219,233,0.3)] hover:scale-[1.02] transition-transform active:scale-95"
        @click="handleNavClick('/map', t('navigation.newRoute'))"
      >
        <span class="material-symbols-outlined">add_location</span>
        {{ t('navigation.newRoute') }}
      </button>
    </div>

    <nav class="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
        :class="[
          route.path === item.path 
            ? 'bg-primary/10 text-primary border-r-4 border-primary shadow-[0_0_15px_rgba(0,219,233,0.1)]' 
            : 'text-surface-dark/60 dark:text-on-surface-variant hover:text-surface-dark dark:hover:text-on-surface hover:bg-black/5 dark:hover:bg-surface-container-highest/30',
          item.isSub ? 'ml-6 py-2 scale-95 opacity-80 hover:translate-x-1' : 'hover:translate-x-1'
        ]"
      >
        <span class="material-symbols-outlined">{{ item.icon }}</span>
        <span :class="item.isSub ? 'font-label-md' : 'font-label-lg'">{{ item.name }}</span>
      </router-link>
    </nav>

    <div class="px-4 mt-auto space-y-1">
      <router-link 
        to="/settings"
        class="flex items-center gap-3 px-4 py-2 rounded-xl text-surface-dark/60 dark:text-on-surface-variant hover:text-surface-dark dark:hover:text-on-surface hover:bg-black/5 dark:hover:bg-surface-container-highest/30 transition-all"
        :class="route.path === '/settings' ? 'text-primary' : ''"
      >
        <span class="material-symbols-outlined">settings</span>
        <span class="font-label-lg text-label-lg">{{ t('navigation.settings') }}</span>
      </router-link>
      <button 
        @click="handleNavClick('/help', t('navigation.help'))"
        class="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-surface-dark/60 dark:text-on-surface-variant hover:text-surface-dark dark:hover:text-on-surface hover:bg-black/5 dark:hover:bg-surface-container-highest/30 transition-all text-left"
        :class="route.path === '/help' ? 'text-primary bg-primary/5' : ''"
      >
        <span class="material-symbols-outlined">help</span>
        <span class="font-label-lg text-label-lg">{{ t('navigation.help') }}</span>
      </button>
      <button 
        @click="handleNavClick('#', t('navigation.logout'))"
        class="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-surface-dark/60 dark:text-on-surface-variant hover:text-surface-dark dark:hover:text-on-surface hover:bg-black/5 dark:hover:bg-surface-container-highest/30 transition-all text-left"
      >
        <span class="material-symbols-outlined text-error">logout</span>
        <span class="font-label-lg text-label-lg">{{ t('navigation.logout') }}</span>
      </button>
    </div>
  </aside>
</template>
