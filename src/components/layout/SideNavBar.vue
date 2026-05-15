<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 사이드 네비게이션 바 컴포넌트
 * 데스크톱 화면에서 주요 메뉴 이동을 담당합니다.
 */
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// 메뉴 아이템 정의 (실시간 언어 변경을 위해 computed 사용)
const menuItems = computed(() => [
  { name: t('navigation.home'), path: '/', icon: 'home' },
  { name: t('navigation.map'), path: '/map', icon: 'map' },
  { name: t('navigation.events'), path: '/events', icon: 'calendar_today' },
  { name: t('navigation.notifications'), path: '/notifications', icon: 'notifications' },
  { name: t('navigation.admin'), path: '/admin', icon: 'dashboard' },
])

/**
 * 메뉴 클릭 시 페이지 이동 및 로그 기록
 */
const navigateTo = (path, name) => {
  logger.info('SideNavBar', `${name} 메뉴로 이동합니다.`, { path })
  router.push(path)
}
</script>

<template>
  <aside class="fixed left-0 top-0 h-full flex flex-col pt-20 pb-8 bg-white/60 dark:bg-surface-dim/60 backdrop-blur-[40px] border-r border-black/5 dark:border-outline-variant/10 shadow-2xl w-64 hidden lg:flex z-40 transition-colors duration-300">
    <div class="px-6 mb-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <span class="material-symbols-outlined text-primary">hub</span>
        </div>
        <div>
          <p class="font-label-lg text-label-lg text-surface-dark dark:text-on-surface">{{ t('navigation.spatialIntelligence') }}</p>
          <p class="text-[10px] text-surface-dark/60 dark:text-on-surface-variant uppercase tracking-widest">{{ t('navigation.globalNav') }}</p>
        </div>
      </div>
      <button 
        class="w-full py-3 px-4 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,219,233,0.3)] hover:scale-[1.02] transition-transform active:scale-95"
        @click="navigateTo('/map', t('navigation.newRoute'))"
      >
        <span class="material-symbols-outlined">add_location</span>
        {{ t('navigation.newRoute') }}
      </button>
    </div>

    <nav class="flex-1 px-4 space-y-2">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:translate-x-1"
        :class="route.path === item.path ? 'bg-primary/10 text-primary border-r-4 border-primary shadow-[0_0_15px_rgba(0,219,233,0.1)]' : 'text-surface-dark/60 dark:text-on-surface-variant hover:text-surface-dark dark:hover:text-on-surface hover:bg-black/5 dark:hover:bg-surface-container-highest/30'"
      >
        <span class="material-symbols-outlined">{{ item.icon }}</span>
        <span class="font-label-lg">{{ item.name }}</span>
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
      <a class="flex items-center gap-3 px-4 py-2 rounded-xl text-surface-dark/60 dark:text-on-surface-variant hover:text-surface-dark dark:hover:text-on-surface hover:bg-black/5 dark:hover:bg-surface-container-highest/30 transition-all" href="#">
        <span class="material-symbols-outlined">help</span>
        <span class="font-label-lg text-label-lg">{{ t('navigation.help') }}</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-2 rounded-xl text-surface-dark/60 dark:text-on-surface-variant hover:text-surface-dark dark:hover:text-on-surface hover:bg-black/5 dark:hover:bg-surface-container-highest/30 transition-all" href="#">
        <span class="material-symbols-outlined text-error">logout</span>
        <span class="font-label-lg text-label-lg">{{ t('navigation.logout') }}</span>
      </a>
    </div>
  </aside>
</template>
