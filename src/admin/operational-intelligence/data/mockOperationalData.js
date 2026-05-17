export const mockSpaces = [
  {
    id: 'hall-1',
    nameKey: 'spaces.hall1.name',
    type: 'hall',
    density: 42,
    congestionLevel: 'moderate',
    accessStatus: 'open',
    trend: 'up',
    capacity: 5000,
    currentCount: 2100,
    coords: { x: 25, y: 30 } // Heatmap 시뮬레이션용 좌표 (0-100)
  },
  {
    id: 'hall-2',
    nameKey: 'spaces.hall2.name',
    type: 'hall',
    density: 15,
    congestionLevel: 'low',
    accessStatus: 'open',
    trend: 'stable',
    capacity: 3000,
    currentCount: 450,
    coords: { x: 65, y: 25 }
  },
  {
    id: 'hall-3',
    nameKey: 'spaces.hall3.name',
    type: 'hall',
    density: 85,
    congestionLevel: 'critical',
    accessStatus: 'limited',
    trend: 'up',
    capacity: 4000,
    currentCount: 3400,
    coords: { x: 45, y: 60 }
  },
  {
    id: 'f-sodam',
    nameKey: 'spaces.sodam.name',
    type: 'f&b',
    density: 92,
    congestionLevel: 'high',
    accessStatus: 'open',
    trend: 'up',
    capacity: 200,
    currentCount: 184,
    coords: { x: 80, y: 70 }
  },
  {
    id: 'gate-4',
    nameKey: 'spaces.gate4.name',
    type: 'exit',
    density: 65,
    congestionLevel: 'moderate',
    accessStatus: 'open',
    trend: 'down',
    capacity: 1000,
    currentCount: 650,
    coords: { x: 15, y: 80 }
  },
  {
    id: 'exit-west',
    nameKey: 'spaces.exitWest.name',
    type: 'exit',
    density: 78,
    congestionLevel: 'high',
    accessStatus: 'restricted',
    trend: 'down',
    capacity: 1200,
    currentCount: 940,
    coords: { x: 10, y: 50 }
  }
]

export const mockRecommendedActions = [
  {
    id: 'action-1',
    type: 'diversion',
    priority: 'high',
    targetZoneId: 'hall-3',
    messageKey: 'admin.operations.recommendations.diversionHall3'
  }
]
