import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { loadLocaleMessages } from './i18n/utils/localeLoader'
import './assets/main.css'
import { logger } from './utils/logger'

// 앱 인스턴스 생성
const app = createApp(App)

// 플러그인 등록
app.use(createPinia())
app.use(router)
app.use(i18n)

// 전역 에러 핸들러 설정
app.config.errorHandler = (err, instance, info) => {
  logger.error('App', '애플리케이션 전역 에러 발생', err)
}

// 초기 언어 설정 및 모든 도메인 메시지 로드
const savedLocale = localStorage.getItem('locale') || 'ko'
loadLocaleMessages(savedLocale).then(() => {
  app.mount('#app')
  logger.info('App', `VX Web 애플리케이션이 초기화되었습니다. (언어: ${savedLocale})`)
})
