import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { spaceService } from '@/services/spaceService'
import { logger } from '@/utils/logger'

export const useSpacesStore = defineStore('spaces', () => {
  const { t } = useI18n()
  const scope = 'SpacesStore'

  const rawSpaces = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * 공간 데이터를 서비스로부터 로드합니다.
   */
  const fetchSpaces = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await spaceService.getSpaces()
      rawSpaces.value = data
      logger.info(scope, '공간 데이터를 성공적으로 로드했습니다.')
    } catch (err) {
      error.value = err
      logger.error(scope, '공간 데이터 로드 중 오류 발생', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 번역된 데이터를 포함한 공간 목록
   * computed를 사용하여 언어 변경 시 자동으로 갱신됩니다.
   */
  const spaces = computed(() => {
    return rawSpaces.value.map(s => ({
      ...s,
      name: t(`spaces.${s.id}.name`),
      zone: t(`spaces.${s.id}.zone`),
      description: t(`spaces.${s.id}.description`),
      tags: t(`spaces.${s.id}.tags`, { defaultValue: [] }),
      congestion: t(`spaces.congestion.${s.congestionType}`)
    }))
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
    loading,
    error,
    categories,
    fetchSpaces,
    getSpaceById
  }
})
