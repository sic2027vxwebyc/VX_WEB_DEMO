import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useMapStore = defineStore('map', () => {
  const { t } = useI18n()

  // 층 정보 정의
  const floors = ['hall1', 'hall2']
  
  // 층별 공간 구조 데이터
  const floorDataRaw = {
    'hall1': [
      { id: 'hall-1', type: 'exhibition', x: 50, y: 50, w: 120, h: 200, status: 'low' },
      { id: 'hall-2', type: 'exhibition', x: 180, y: 50, w: 120, h: 200, status: 'moderate' },
      { id: 'hall-3', type: 'exhibition', x: 310, y: 50, w: 120, h: 200, status: 'high' },
      { id: 'hall-4', type: 'exhibition', x: 440, y: 50, w: 120, h: 200, status: 'low' },
      { id: 'hall-5', type: 'exhibition', x: 570, y: 50, w: 120, h: 200, status: 'moderate' },
      { id: 'lobby-1', type: 'info', x: 50, y: 300, w: 640, h: 100, status: 'moderate' },
      { id: 'cafe-1', type: 'dining', x: 50, y: 420, w: 200, h: 100, status: 'high' }
    ],
    'hall2': [
      { id: 'hall-6', type: 'exhibition', x: 100, y: 100, w: 150, h: 150, status: 'moderate' },
      { id: 'hall-7', type: 'exhibition', x: 260, y: 100, w: 150, h: 150, status: 'low' },
      { id: 'hall-8', type: 'exhibition', x: 420, y: 100, w: 150, h: 150, status: 'high' },
      { id: 'hall-9', type: 'exhibition', x: 100, y: 260, w: 230, h: 150, status: 'moderate' },
      { id: 'hall-10', type: 'exhibition', x: 340, y: 260, w: 230, h: 150, status: 'low' }
    ]
  }

  /**
   * 번역 및 상태가 포함된 층별 데이터
   */
  const floorData = computed(() => {
    const processed = {}
    floors.forEach(floor => {
      processed[floor] = floorDataRaw[floor].map(space => ({
        ...space,
        name: space.type === 'exhibition' ? t(`map.floors.halls.${space.id.split('-')[1]}`) : t(`map.filters.${space.type}`)
      }))
    })
    return processed
  })

  // 현재 지도 상태
  const currentFloorKey = ref('hall1')
  const mapScale = ref(1)
  const activeFilters = ref({
    exhibition: true,
    dining: true,
    info: true
  })

  const setFloor = (key) => {
    currentFloorKey.value = key
  }

  const setScale = (scale) => {
    mapScale.value = scale
  }

  const toggleFilter = (type) => {
    activeFilters.value[type] = !activeFilters.value[type]
  }

  return {
    floors,
    floorData,
    currentFloorKey,
    mapScale,
    activeFilters,
    setFloor,
    setScale,
    toggleFilter
  }
})
