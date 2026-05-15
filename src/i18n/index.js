import { createI18n } from 'vue-i18n'
import koCommon from './locales/ko/common.json'
import enCommon from './locales/en/common.json'

// 초기에는 ko, en의 common 도메인만 정적으로 로드
const messages = {
  ko: {
    common: koCommon
  },
  en: {
    common: enCommon
  }
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'ko',
  fallbackLocale: 'en',
  messages,
  globalInjection: true
})

export default i18n
