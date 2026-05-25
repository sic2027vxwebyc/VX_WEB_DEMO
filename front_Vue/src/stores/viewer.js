/**
 * [ 뷰어 스토어 ]
 * 360 공간 내의 Hotspot 위치(phi, theta), 유형 및 연결된 목적지 데이터를 관리합니다.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useViewerStore = defineStore('viewer', () => {
  // 공간별 Hotspot 데이터 (phi, theta는 구면 좌표계 기반)
  const hotspotsData = ref({
    'hall-1': [
      { id: 'link-hall-2', labelKey: 'spaces.hall2.name', type: 'hall', phi: 0, theta: 90, targetId: 'hall-2', walkingMinutes: 2 },
      { id: 'info-desk', labelKey: 'common.facilities.infoDesk', type: 'info', phi: 0.5, theta: 180, targetId: 'c-cu1', walkingMinutes: 1 },
      { id: 'exit-west', labelKey: 'spaces.exitWest.name', type: 'exit', phi: -0.2, theta: 270, targetId: 'exit-west', walkingMinutes: 3 }
    ],
    'hall-2': [
      { id: 'link-hall-1', labelKey: 'spaces.hall1.name', type: 'hall', phi: 0, theta: -90, targetId: 'hall-1', walkingMinutes: 2 },
      { id: 'food-zone', labelKey: 'spaces.fSodam.name', type: 'dining', phi: 0.3, theta: 45, targetId: 'f-sodam', walkingMinutes: 1 },
      { id: 'restroom', labelKey: 'common.facilities.restroom', type: 'restroom', phi: -0.1, theta: 135, targetId: 'toilet-1', walkingMinutes: 1 }
    ]
  })

  /**
   * 특정 공간의 Hotspot 목록을 반환합니다.
   */
  const getHotspotsBySpaceId = (spaceId) => {
    return hotspotsData.value[spaceId] || [
      // 데이터가 없는 경우 기본 인접 공간 자동 생성 시뮬레이션
      { id: 'default-link', labelKey: 'common.facilities.nearby', type: 'hall', phi: 0, theta: 90, targetId: 'hall-1', walkingMinutes: 3 }
    ]
  }

  return {
    hotspotsData,
    getHotspotsBySpaceId
  }
})
