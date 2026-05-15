import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { logger } from '@/utils/logger'

export const useLocaleStore = defineStore('locale', () => {
  const scope = 'LocaleStore'
  const currentLocale = ref(localStorage.getItem('locale') || 'ko')
  const availableLocales = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'es', name: 'Español' },
    { code: 'ru', name: 'Русский' }
  ]

  const setLocale = (locale) => {
    if (availableLocales.find(l => l.code === locale)) {
      currentLocale.value = locale
      localStorage.setItem('locale', locale)
      logger.info(scope, `언어 변경됨: ${locale}`)
    } else {
      logger.warn(scope, `지원하지 않는 언어 코드: ${locale}`)
    }
  }

  return {
    currentLocale,
    availableLocales,
    setLocale
  }
})
