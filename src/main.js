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

// 초기 언어 설정 및 필요한 도메인 메시지 로드
const savedLocale = localStorage.getItem('locale') || 'ko'

// 'ko'는 소스 오브 트루스이자 폴백이므로 항상 로드
const localesToLoad = ['ko']
if (savedLocale !== 'ko') {
  localesToLoad.push(savedLocale)
}

const loadPromises = localesToLoad.map(locale => loadLocaleMessages(locale))

Promise.all(loadPromises).then(() => {
  // i18n 인스턴스의 로케일 설정
  i18n.global.locale.value = savedLocale
  
  // HTML lang 속성 설정
  document.documentElement.setAttribute('lang', savedLocale)
  
  app.mount('#app')
  logger.info('App', `VX Web 애플리케이션이 초기화되었습니다. (언어: ${savedLocale})`)
})
