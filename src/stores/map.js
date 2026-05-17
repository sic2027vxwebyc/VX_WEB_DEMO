/**
 * [ 지도 스토어 ]
 * 층별 정보, 현재 선택된 층, 줌 레벨 등 인터랙티브 지도의 상태를 관리합니다.
 * 실시간 혼잡도 점수, 흐름 방향 및 추천 우회 경로 데이터를 포함합니다.
 */
import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { useOperationalStore } from './operational'
import { useOperationalIntelligenceStore } from '../admin/operational-intelligence/stores/operationalIntelligenceStore'

export const useMapStore = defineStore('map', () => {
  const opStore = useOperationalStore()
  const adminOpStore = useOperationalIntelligenceStore()
  const currentFloor = ref('hall1')
  const mapScale = ref(1)
  
  const floors = [
    { id: 'hall1', labelKey: 'map.floors.hall1' },
    { id: 'hall2', labelKey: 'map.floors.hall2' }
  ]

  const currentFloorKey = computed(() => currentFloor.value)

  // 각 층별 공간 데이터 (시각화 및 혼잡도 지능 포함)
  const floorData = reactive({
    'hall1': [
      { id: 'hall-1', x: 50, y: 50, w: 120, h: 180, nameKey: 'spaces.hall1.name', type: 'exhibition', recommended: true },
      { id: 'hall-2', x: 180, y: 50, w: 120, h: 180, nameKey: 'spaces.hall2.name', type: 'exhibition', recommended: true },
      { id: 'hall-3', x: 310, y: 50, w: 120, h: 180, nameKey: 'spaces.hall3.name', type: 'exhibition', recommended: false, alternativeId: 'hall-1' },
      { id: 'hall-4', x: 440, y: 50, w: 120, h: 180, nameKey: 'spaces.hall4.name', type: 'exhibition', recommended: true },
      { id: 'hall-5', x: 570, y: 50, w: 120, h: 180, nameKey: 'spaces.hall5.name', type: 'exhibition', recommended: true },
      { id: 'f-sodam', x: 50, y: 250, w: 100, h: 80, nameKey: 'spaces.fSodam.name', type: 'dining', recommended: false, alternativeId: 'f-benvenuto' },
      { id: 'c-cu1', x: 180, y: 250, w: 100, h: 60, nameKey: 'spaces.cCu1.name', type: 'info', recommended: true },
      { id: 'medical', x: 310, y: 250, w: 100, h: 60, nameKey: 'spaces.medical.name', type: 'info', recommended: false }
    ],
    'hall2': [
      { id: 'hall-6', x: 50, y: 50, w: 120, h: 180, nameKey: 'spaces.hall6.name', type: 'exhibition', recommended: true },
      { id: 'hall-7', x: 180, y: 50, w: 120, h: 180, nameKey: 'spaces.hall7.name', type: 'exhibition', recommended: true },
      { id: 'hall-8', x: 310, y: 50, w: 120, h: 180, nameKey: 'spaces.hall8.name', type: 'exhibition', recommended: false, alternativeId: 'hall-6' },
      { id: 'hall-9', x: 440, y: 50, w: 120, h: 180, nameKey: 'spaces.hall9.name', type: 'exhibition', recommended: true },
      { id: 'hall-10', x: 570, y: 50, w: 120, h: 180, nameKey: 'spaces.hall10.name', type: 'exhibition', recommended: true },
      { id: 'f-myeongdong', x: 50, y: 250, w: 150, h: 100, nameKey: 'spaces.fMyeongdong.name', type: 'dining', recommended: false, alternativeId: 'f-sodam' }
    ]
  })

  // 혼잡도 데이터 실시간 병합 (operationalStore 연동)
  const liveFloorData = computed(() => {
    const data = JSON.parse(JSON.stringify(floorData))
    const adminZones = adminOpStore.effectiveZones

    Object.keys(data).forEach(floor => {
      data[floor] = data[floor].map(item => {
        const live = opStore.congestionData[item.id] || { level: 'low', percent: 10 }
        const adminZone = adminZones.find(z => z.id === item.id)

        let finalLevel = live.level
        let finalPercent = live.percent
        let isRestricted = false

        // 관리자 override 우선 순위
        if (adminZone) {
          finalLevel = adminZone.congestionLevel
          finalPercent = adminZone.density
          isRestricted = adminZone.isRestricted
        }

        return {
          ...item,
          status: finalLevel,
          congestionScore: finalPercent,
          isRestricted,
          flowDirection: finalPercent > 70 ? 'outward' : 'inward'
        }
      })
    })
    return data
  })

  const activeFilters = reactive({
    exhibition: true,
    dining: true,
    info: true
  })

  const setFloor = (floorId) => {
    currentFloor.value = floorId
  }

  const setScale = (level) => {
    mapScale.value = level
  }

  const toggleFilter = (type) => {
    if (activeFilters[type] !== undefined) {
      activeFilters[type] = !activeFilters[type]
    }
  }

  return {
    currentFloor,
    mapScale,
    currentFloorKey,
    floors,
    floorData,
    liveFloorData,
    activeFilters,
    setFloor,
    setScale,
    toggleFilter
  }
})
