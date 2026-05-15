<script setup>
/**
 * [ 페이지 컴포넌트 상단 ]
 * 상단 앱 바 컴포넌트
 * 로고, 네비게이션 링크, 사용자 프로필 등을 포함합니다.
 */
import { useI18n } from 'vue-i18n'
import { logger } from '@/utils/logger'

const { t } = useI18n()
const emit = defineEmits(['navigate'])

// 알림 센터로 이동 요청
const handleNotificationClick = () => {
  logger.info('TopAppBar', '알림 센터로 이동합니다.')
  emit('navigate', { path: '/notifications', name: t('navigation.notifications') })
}

// 설정 페이지로 이동 요청
const handleSettingsClick = () => {
  logger.info('TopAppBar', '설정 페이지로 이동합니다.')
  emit('navigate', { path: '/settings', name: t('navigation.settings') })
}
</script>

<template>
  <header class="fixed top-0 w-full z-50 flex items-center justify-between px-margin-desktop h-16 bg-white/40 dark:bg-surface/40 backdrop-blur-[30px] border-b border-black/5 dark:border-white/10 shadow-sm transition-colors duration-300">
    <div class="flex items-center gap-md">
      <span class="font-headline-md text-headline-md font-bold text-primary dark:text-surface-tint tracking-tight">VX Web</span>
    </div>

    <!-- 데스크톱 네비게이션 및 유틸리티 -->
    <div class="hidden md:flex items-center gap-lg">
      <nav class="flex items-center gap-md">
        <router-link to="/" class="nav-link">{{ t('navigation.home') }}</router-link>
        <router-link to="/map" class="nav-link">{{ t('navigation.explore') }}</router-link>
        <router-link to="/events" class="nav-link">{{ t('navigation.events') }}</router-link>
        <router-link to="/admin" class="nav-link">{{ t('navigation.admin') }}</router-link>
      </nav>
      
      <div class="h-6 w-[1px] bg-black/5 dark:bg-outline-variant/30"></div>
      
      <div class="flex items-center gap-sm">
        <button 
          class="material-symbols-outlined icon-btn"
          @click="handleNotificationClick"
          :title="t('navigation.notifications')"
        >
          notifications
        </button>
        <button 
          class="material-symbols-outlined icon-btn"
          @click="handleSettingsClick"
          :title="t('navigation.settings')"
        >
          settings
        </button>
        <button class="material-symbols-outlined icon-btn" :title="t('navigation.help')">
          help
        </button>
        
        <div class="w-8 h-8 rounded-full overflow-hidden border border-primary/20 ml-2 cursor-pointer hover:border-primary transition-colors">
          <img 
            :alt="t('navigation.admin')" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxDMHW0xKEHh0_8m20pvwk6hx5Io35zkqSV60N_JnRPJqyhZVOJrHOa55kX95K8sSk-Fb07tPF8l_IQN0qS2haCOpOUrNrepe5HwsYBxDUbFxZGrfrhUd3SDJfSdYrydnoQ7nDrn3vlnsIn-7jbI5VHu52I159jbkSZUNQzSYeYQI8zsV7qb3FXsrTU3vL_d8pMvNTSN6afxtcj_nwiMaI4t8GR6WRpzUEnJV4ne7ywmnC_Z1P7XJg8SaiScYLnys2Md8g4buYpvWO"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-link {
  @apply text-surface-dark/60 dark:text-on-surface-variant font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors px-3 py-1 rounded-lg text-label-lg;
}

.router-link-active {
  @apply text-primary font-bold bg-primary/10 dark:bg-primary/5;
}

.icon-btn {
  @apply text-surface-dark/60 dark:text-on-surface-variant p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors;
}
</style>
