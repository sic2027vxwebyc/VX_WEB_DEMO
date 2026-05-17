<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 하단 네비게이션 바 컴포넌트 (모바일 전용)
 * 주요 메뉴에 대한 빠른 접근을 제공합니다.
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })

// 메뉴 아이템 정의 (실시간 언어 변경을 위해 computed 사용)
const navItems = computed(() => {
  const items = [
    { name: t('navigation.home'), path: '/', icon: 'home' },
    { name: t('navigation.explore'), path: '/map', icon: 'map' },
    { name: t('navigation.events'), path: '/events', icon: 'calendar_today' },
    { name: t('navigation.notifications'), path: '/notifications', icon: 'notifications' },
  ]

  // V2 실험 영역 및 관리자 영역 분기
  if (route.path.startsWith('/admin')) {
    // 관리자 하위에서는 관리자 대시보드 아이콘 유지
    items.push({ name: t('navigation.admin'), path: '/admin', icon: 'dashboard' })
  } else if (route.path.includes('/v2/')) {
    items.push({ name: t('navigation.stamp'), path: '/v2/stamp-event', icon: 'qr_code_scanner' })
  } else {
    items.push({ name: t('navigation.settings'), path: '/settings', icon: 'settings' })
  }

  return items
})

const emit = defineEmits(['navigate'])

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

/**
 * 페이지 이동 요청 이벤트 발생 및 로그 기록
 */
const handleNavClick = (path, name) => {
  logger.info('BottomNavBar', `모바일 메뉴 클릭: ${name}`, { path })
  emit('navigate', { path, name })
}
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 flex items-center justify-around px-margin-mobile z-50 transition-colors duration-300">
    <button 
      v-for="item in navItems"
      :key="item.path"
      class="flex flex-col items-center gap-1 transition-colors"
      :class="isActive(item.path) ? 'text-primary' : 'text-surface-dark/60 dark:text-on-surface-variant'"
      @click="handleNavClick(item.path, item.name)"
    >
      <span class="material-symbols-outlined" :style="isActive(item.path) ? 'font-variation-settings: \'FILL\' 1;' : ''">{{ item.icon }}</span>
      <span class="text-[10px] font-bold">{{ item.name }}</span>
    </button>
  </nav>
</template>
