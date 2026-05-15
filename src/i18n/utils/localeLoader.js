import { nextTick } from 'vue'
import i18n from '@/i18n'
import { logger } from '@/utils/logger'

const scope = 'LocaleLoader'

export async function loadLocaleMessages(locale) {
  // 이미 로드된 언어인지 확인 (모든 도메인 파일이 로드되었다고 가정)
  const isLoaded = i18n.global.availableLocales.includes(locale) && 
                   Object.keys(i18n.global.getLocaleMessage(locale)).length > 10
                   
  if (isLoaded) {
    logger.debug(scope, `이미 로드된 언어입니다: ${locale}`)
    return setI18nLanguage(locale)
  }

  try {
    logger.info(scope, `새로운 언어 도메인 파일 로드 시작: ${locale}`)
    
    // 도메인별 파일 목록
    const domains = ['common', 'home', 'settings', 'map', 'ar', 'navigation', 'admin', 'events', 'directory', 'spaceDetail', 'notifications', 'booking', 'errors', 'viewer', 'modal', 'auth', 'session', 'spaces']
    const messages = {}
    
    // 병렬 로드로 성능 최적화
    await Promise.all(domains.map(async (domain) => {
      try {
        const module = await import(`../locales/${locale}/${domain}.json`)
        messages[domain] = module.default
      } catch (e) {
        logger.warn(scope, `${locale} 언어의 ${domain} 도메인 파일이 없거나 로드할 수 없습니다.`)
        messages[domain] = {}
      }
    }))
    
    // 메시지 추가 (merge)
    const existingMessages = i18n.global.getLocaleMessage(locale) || {}
    i18n.global.setLocaleMessage(locale, { ...existingMessages, ...messages })
    
    logger.info(scope, `${locale} 언어 팩 로드 완료 (${Object.keys(messages).length} 도메인)`)
    return setI18nLanguage(locale)
  } catch (error) {
    logger.error(scope, `언어 로드 중 치명적 실패: ${locale}`, error)
    // 실패 시 한국어로 폴백하되 무한 루프 방지
    if (locale !== 'ko') {
      return loadLocaleMessages('ko')
    }
    return setI18nLanguage('ko')
  }
}

function setI18nLanguage(locale) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    i18n.global.locale.value = locale
  }
  
  // HTML lang 속성 업데이트 및 방향성 처리 (RTL 지원 대비)
  const html = document.querySelector('html')
  if (html) {
    html.setAttribute('lang', locale)
    // 아랍어 등 RTL 언어 대응을 위한 확장성 확보
    html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
  }
  
  return nextTick()
}
