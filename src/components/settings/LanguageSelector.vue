<script setup>
/**
 * [ 컴포넌트 상단 ]
 * 언어 선택기 컴포넌트
 * 애플리케이션의 전역 언어 설정을 변경하며 실시간으로 UI 언어를 갱신합니다.
 */
import { useLocale } from '@/composables/useLocale'
import { logger } from '@/utils/logger'

const scope = 'LanguageSelector'
const { currentLocale, availableLocales, changeLocale } = useLocale()

const handleLocaleChange = async (localeCode) => {
  try {
    await changeLocale(localeCode)
    logger.info(scope, `사용자가 언어를 변경했습니다: ${localeCode}`)
  } catch (error) {
    logger.error(scope, `언어 변경 중 오류 발생: ${localeCode}`, error)
  }
}
</script>

<template>
  <div class="p-lg">
    <div class="flex items-center gap-md mb-md">
      <span class="material-symbols-outlined text-primary">language</span>
      <h2 class="font-headline-md text-headline-md">{{ $t('settings.language.title') }}</h2>
    </div>

    <div class="glass-panel rounded-2xl overflow-hidden border border-black/5 dark:border-white/5">
      <div class="p-lg bg-primary/5 border-b border-black/5 dark:border-white/5">
        <p class="text-sm text-on-surface-variant">{{ $t('settings.language.desc') }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/5 dark:bg-white/5">
        <button 
          v-for="lang in availableLocales" 
          :key="lang.code"
          @click="handleLocaleChange(lang.code)"
          class="flex items-center justify-between p-lg bg-surface-light dark:bg-surface-dark hover:bg-primary/10 transition-colors group"
          :class="{ 'bg-primary/5': currentLocale === lang.code }"
        >
          <div class="flex items-center gap-md">
            <span 
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors"
              :class="currentLocale === lang.code ? 'bg-primary border-primary text-on-primary' : 'bg-black/5 dark:bg-white/10 border-transparent text-on-surface-variant'"
            >
              {{ lang.code.toUpperCase() }}
            </span>
            <span 
              class="font-label-lg transition-colors"
              :class="currentLocale === lang.code ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-surface-dark dark:group-hover:text-on-surface'"
            >
              {{ lang.name }}
            </span>
          </div>
          <span v-if="currentLocale === lang.code" class="material-symbols-outlined text-primary">check_circle</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
