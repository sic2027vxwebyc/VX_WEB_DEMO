/**
 * [ 로케일 변경 Composable ]
 * i18n 인스턴스와 로케일 스토어를 연동하여 앱의 언어를 동적으로 변경합니다.
 */
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '@/stores/locale'
import { loadLocaleMessages } from '@/i18n/utils/localeLoader'
import { logger } from '@/utils/logger'

export function useLocale() {
  const { locale } = useI18n({ useScope: 'global' })
  const localeStore = useLocaleStore()

  const changeLocale = async (newLocale) => {
    try {
      await loadLocaleMessages(newLocale)
      locale.value = newLocale
      localeStore.setLocale(newLocale)
      document.documentElement.setAttribute('lang', newLocale)
      logger.info('useLocale', `언어가 성공적으로 변경되었습니다: ${newLocale}`)
    } catch (error) {
      logger.error('useLocale', `언어 로드 중 오류 발생: ${newLocale}`, error)
      throw error
    }
  }

  return {
    currentLocale: locale,
    availableLocales: localeStore.availableLocales,
    changeLocale
  }
}
