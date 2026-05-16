/**
 * [ i18n 초기화 ]
 * Vue-i18n 인스턴스를 생성하고 기본 설정을 구성합니다.
 * 초기 로딩 성능을 위해 최소한의 메시지만 정적으로 로드합니다.
 */
import { createI18n } from 'vue-i18n'
import koCommon from './locales/ko/common.json'
import enCommon from './locales/en/common.json'

// 초기에는 ko, en의 common 도메인만 정적으로 로드
const i18n = createI18n({
  legacy: false,
  locale: 'ko',
  fallbackLocale: 'ko',
  messages: {
    ko: { common: koCommon },
    en: { common: enCommon }
  }
})

export default i18n
