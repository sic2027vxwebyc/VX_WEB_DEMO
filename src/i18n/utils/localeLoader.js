/**
 * [ 동적 로케일 로더 유틸리티 ]
 * 사용자의 언어 선택에 따라 필요한 JSON 번역 파일을 비동기적으로 로드합니다.
 * 도메인별(common, map, spaces 등)로 분리된 파일을 하나로 병합하여 적용합니다.
 */
import { nextTick } from 'vue'
import i18n from '@/i18n'
import { logger } from '@/utils/logger'

const scope = 'LocaleLoader'

/**
 * 특정 언어의 모든 도메인 메시지를 로드합니다.
 * @param {string} locale - 로드할 언어 코드 (ko, en, ja 등)
 */
export async function loadLocaleMessages(locale) {
  try {
    // 모든 도메인 파일을 병렬로 로드
    const domains = [
      'admin', 'ar', 'auth', 'booking', 'common', 'directory', 
      'errors', 'events', 'home', 'map', 'modal', 'navigation', 
      'notifications', 'session', 'settings', 'spaceDetail', 'spaces', 'viewer',
      'gamification', 'passport', 'quests', 'badges', 'reward', 'qrScanner', 'homeV2', 'help'
    ]

    const messages = {}
    
    // Vite의 glob import 기능을 사용하여 메시지 로드 (실제 구현 예시)
    // 여기서는 개념 증명을 위해 개별 import를 시뮬레이션합니다.
    const messagePromises = domains.map(async (domain) => {
      try {
        const module = await import(`../locales/${locale}/${domain}.json`)
        messages[domain] = module.default
      } catch (e) {
        logger.warn(scope, `${locale} 언어의 ${domain} 도메인을 로드할 수 없습니다.`)
      }
    })

    await Promise.all(messagePromises)

    // i18n 인스턴스에 메시지 설정
    i18n.global.setLocaleMessage(locale, messages)

    return nextTick()
  } catch (error) {
    logger.error(scope, `로케일 로드 실패: ${locale}`, error)
  }
}
