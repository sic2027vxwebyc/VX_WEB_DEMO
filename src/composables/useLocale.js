import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '@/stores/locale'
import { loadLocaleMessages } from '@/i18n/utils/localeLoader'
import { logger } from '@/utils/logger'

export function useLocale() {
  const { t, locale } = useI18n()
  const localeStore = useLocaleStore()
  const scope = 'useLocale'

  const changeLocale = async (newLocale) => {
    logger.info(scope, `언어 변경 요청: ${newLocale}`)
    await loadLocaleMessages(newLocale)
    localeStore.setLocale(newLocale)
  }

  return {
    t,
    currentLocale: locale,
    changeLocale,
    availableLocales: localeStore.availableLocales
  }
}
