<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 하단 네비게이션 바 컴포넌트 (모바일 전용)
 * 주요 메뉴에 대한 빠른 접근을 제공합니다.
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// 메뉴 아이템 정의 (실시간 언어 변경을 위해 computed 사용)
const navItems = computed(() => [
  { name: t('navigation.home'), path: '/', icon: 'home' },
  { name: t('navigation.explore'), path: '/map', icon: 'map' },
  { name: t('navigation.events'), path: '/events', icon: 'calendar_today' },
  { name: t('navigation.notifications'), path: '/notifications', icon: 'notifications' },
  { name: t('navigation.settings'), path: '/settings', icon: 'settings' },
])

/**
 * 페이지 이동 및 로그 기록
 */
const navigateTo = (path, name) => {
  logger.info('BottomNavBar', `모바일 메뉴 클릭: ${name}`, { path })
  router.push(path)
}
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 flex items-center justify-around px-margin-mobile z-50 transition-colors duration-300">
    <button 
      v-for="item in navItems"
      :key="item.path"
      class="flex flex-col items-center gap-1 transition-colors"
      :class="route.path === item.path ? 'text-primary' : 'text-surface-dark/60 dark:text-on-surface-variant'"
      @click="navigateTo(item.path, item.name)"
    >
      <span class="material-symbols-outlined" :style="route.path === item.path ? 'font-variation-settings: \'FILL\' 1;' : ''">{{ item.icon }}</span>
      <span class="text-[10px] font-bold">{{ item.name }}</span>
    </button>
  </nav>
</template>
