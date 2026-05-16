import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { spaceService } from '@/services/spaceService'
import { logger } from '@/utils/logger'
import { resolveI18nText } from '@/utils/i18nResolver'
import { toI18nKeySegment } from '@/utils/spaceI18n'

export const useSpacesStore = defineStore('spaces', () => {
  const { t, tm, te } = useI18n({ useScope: 'global' })
  const scope = 'SpacesStore'
  
  const rawSpaces = ref([])
  const isLoading = ref(false)
  const isLoaded = ref(false)
  const error = ref(null)

  /**
   * 공간 데이터를 서비스로부터 로드합니다. (멱등성 보장)
   */
  const fetchSpaces = async () => {
    if (isLoaded.value || isLoading.value) return
    
    isLoading.value = true
    error.value = null
    try {
      const data = await spaceService.getSpaces()
      rawSpaces.value = data
      isLoaded.value = true
      logger.info(scope, '공간 데이터를 성공적으로 로드했습니다.')
    } catch (err) {
      error.value = err
      logger.error(scope, '공간 데이터 로드 중 오류 발생', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 번역된 데이터를 포함한 공간 목록
   * computed를 사용하여 언어 변경 시 자동으로 갱신됩니다.
   */
  const spaces = computed(() => {
    return rawSpaces.value.map(s => {
      // 명시적 키가 없는 경우에 대한 안전장치는 유지하되, 리졸버를 통해 해소
      const nid = toI18nKeySegment(s.id)
      
      return {
        ...s,
        name: resolveI18nText({ key: s.nameKey || `spaces.${nid}.name`, t, te, context: `space:${s.id}:name` }),
        zone: resolveI18nText({ key: s.zoneKey || `spaces.${nid}.zone`, t, te, context: `space:${s.id}:zone` }),
        description: resolveI18nText({ key: s.descriptionKey || `spaces.${nid}.description`, t, te, context: `space:${s.id}:description` }),
        shortName: resolveI18nText({ key: s.shortNameKey || `spaces.${nid}.shortName`, t, te, context: `space:${s.id}:shortName` }),
        location: resolveI18nText({ key: s.locationKey || `spaces.${nid}.location`, t, te, context: `space:${s.id}:location` }),
        tags: tm(s.tagsKey || `spaces.${nid}.tags`),
        congestion: resolveI18nText({ key: `spaces.congestion.${s.congestionType}`, t, te, context: `space:${s.id}:congestion` })
      }
    })
  })

  const categories = ['all', 'exhibition', 'dining', 'amenities', 'hotels']

  const getSpaceById = (id) => {
    return spaces.value.find(s => s.id === id)
  }

  // 초기화 시 데이터 로드
  onMounted(() => {
    if (rawSpaces.value.length === 0) {
      fetchSpaces()
    }
  })

  return {
    spaces,
    isLoading,
    isLoaded,
    error,
    categories,
    fetchSpaces,
    getSpaceById
  }
})
