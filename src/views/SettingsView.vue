<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { logger } from '@/utils/logger'
import LanguageSelector from '@/components/settings/LanguageSelector.vue'

const scope = 'SettingsView'
const { t } = useI18n()
const themeStore = useThemeStore()

const settings = ref({
  fontSize: 'medium',
  highContrast: false,
  offlineMaps: true,
  biometricAuth: true,
  notifications: {
    system: true,
    marketing: false,
    congestion: true
  }
})

// Add computed for dynamic data like alert message
const cacheClearedMessage = computed(() => t('settings.data.cacheCleared'))

const toggleTheme = () => {
  themeStore.toggleTheme()
  logger.info(scope, `테마 변경: ${themeStore.theme}`)
}

const setFontSize = (size) => {
  themeStore.setFontSize(size)
  logger.info(scope, `텍스트 크기 변경: ${size}`)
}

const clearCache = () => {
  logger.warn(scope, '오프라인 캐시 삭제 시작')
  // 시뮬레이션
  setTimeout(() => {
    logger.info(scope, '오프라인 캐시 삭제 완료')
    alert(cacheClearedMessage.value)
  }, 1000)
}

onMounted(() => {
  logger.info(scope, '설정 화면 진입')
})

onUnmounted(() => {
  logger.info(scope, '설정 화면 이탈')
})
</script>

<template>
  <div class="min-h-screen bg-surface-light dark:bg-surface-dark text-surface-dark dark:text-on-surface p-safe-top pb-32 transition-colors duration-300">
    <div class="max-w-4xl mx-auto px-lg pt-xl">
      <header class="mb-xl px-lg">
        <h1 class="font-display-lg text-display-lg text-primary">{{ t('settings.title') }}</h1>
        <p class="font-body-lg text-on-surface-variant">{{ t('settings.subtitle') }}</p>
      </header>

      <div class="space-y-xl">
        <!-- 언어 설정 -->
        <LanguageSelector />

        <!-- 디스플레이 설정 -->
        <section class="px-lg">
          <div class="flex items-center gap-md mb-md">
            <span class="material-symbols-outlined text-primary">palette</span>
            <h2 class="font-headline-md text-headline-md">{{ t('settings.display.title') }}</h2>
          </div>
          
          <div class="glass-panel rounded-2xl overflow-hidden divide-y divide-black/5 dark:divide-white/5">
            <div @click="toggleTheme" class="flex items-center justify-between p-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <div>
                <p class="font-label-lg">{{ t('settings.display.darkMode') }}</p>
                <p class="text-sm text-on-surface-variant">{{ t('settings.display.darkModeDesc') }}</p>
              </div>
              <div class="w-12 h-6 rounded-full relative transition-colors" :class="themeStore.theme === 'dark' ? 'bg-primary' : 'bg-black/10'">
                <div class="absolute top-1 w-4 h-4 rounded-full transition-all" :class="themeStore.theme === 'dark' ? 'right-1 bg-on-primary' : 'left-1 bg-on-surface-variant'"></div>
              </div>
            </div>

            <div class="flex items-center justify-between p-lg">
              <div>
                <p class="font-label-lg">{{ t('settings.display.highContrast') }}</p>
                <p class="text-sm text-on-surface-variant">{{ t('settings.display.highContrastDesc') }}</p>
              </div>
              <div @click="settings.highContrast = !settings.highContrast" class="w-12 h-6 rounded-full relative transition-colors cursor-pointer" :class="settings.highContrast ? 'bg-primary' : 'bg-black/10 dark:bg-white/10'">
                <div class="absolute top-1 w-4 h-4 rounded-full transition-all" :class="settings.highContrast ? 'right-1 bg-on-primary' : 'left-1 bg-on-surface-variant'"></div>
              </div>
            </div>

            <div class="p-lg">
              <p class="font-label-lg mb-sm text-surface-dark dark:text-on-surface">{{ t('settings.display.fontSize') }}</p>
              <div class="flex gap-md">
                <button 
                  v-for="size in ['small', 'medium', 'large']" 
                  :key="size"
                  @click="setFontSize(size)"
                  class="flex-1 py-2 rounded-lg border transition-all text-label-sm uppercase"
                  :class="themeStore.fontSize === size ? 'bg-primary/20 border-primary text-primary' : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-on-surface-variant'"
                >
                  {{ size === 'small' ? t('settings.display.fontSizeSmall') : size === 'medium' ? t('settings.display.fontSizeMedium') : t('settings.display.fontSizeLarge') }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 시스템 및 보안 -->
        <section class="px-lg">
          <div class="flex items-center gap-md mb-md">
            <span class="material-symbols-outlined text-primary">security</span>
            <h2 class="font-headline-md text-headline-md">{{ t('settings.system.title') }}</h2>
          </div>

          <div class="glass-panel rounded-2xl overflow-hidden divide-y divide-black/5 dark:divide-white/5">
            <div class="flex items-center justify-between p-lg">
              <div>
                <p class="font-label-lg">{{ t('settings.system.offlineMaps') }}</p>
                <p class="text-sm text-on-surface-variant">{{ t('settings.system.offlineMapsDesc') }}</p>
              </div>
              <div @click="settings.offlineMaps = !settings.offlineMaps" class="w-12 h-6 rounded-full relative transition-colors cursor-pointer" :class="settings.offlineMaps ? 'bg-primary' : 'bg-black/10 dark:bg-white/10'">
                <div class="absolute top-1 w-4 h-4 rounded-full transition-all" :class="settings.offlineMaps ? 'right-1 bg-on-primary' : 'left-1 bg-on-surface-variant'"></div>
              </div>
            </div>

            <div class="flex items-center justify-between p-lg">
              <div>
                <p class="font-label-lg">{{ t('settings.system.biometricAuth') }}</p>
                <p class="text-sm text-on-surface-variant">{{ t('settings.system.biometricAuthDesc') }}</p>
              </div>
              <div @click="settings.biometricAuth = !settings.biometricAuth" class="w-12 h-6 rounded-full relative transition-colors cursor-pointer" :class="settings.biometricAuth ? 'bg-primary' : 'bg-black/10 dark:bg-white/10'">
                <div class="absolute top-1 w-4 h-4 rounded-full transition-all" :class="settings.biometricAuth ? 'right-1 bg-on-primary' : 'left-1 bg-on-surface-variant'"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 데이터 관리 -->
        <section class="px-lg">
          <div class="flex items-center gap-md mb-md">
            <span class="material-symbols-outlined text-status-high">delete_forever</span>
            <h2 class="font-headline-md text-headline-md">{{ t('settings.data.title') }}</h2>
          </div>
          
          <div class="glass-panel rounded-2xl p-lg">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
              <div>
                <p class="font-label-lg">{{ t('settings.data.cache') }}</p>
                <p class="text-sm text-on-surface-variant">{{ t('settings.data.cacheDesc') }}</p>
              </div>
              <button @click="clearCache" class="px-lg py-2 rounded-lg bg-status-high/20 text-status-high border border-status-high/30 hover:bg-status-high/30 transition-colors">
                {{ t('settings.data.clearCache') }}
              </button>
            </div>
          </div>
        </section>

        <!-- 정보 -->
        <div class="pt-xl text-center px-lg">
          <p class="text-on-surface-variant text-label-sm mb-xs">{{ t('settings.info.version') }}</p>
          <p class="text-on-surface-variant text-[10px] opacity-50 uppercase tracking-widest">{{ t('settings.info.copyright') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
