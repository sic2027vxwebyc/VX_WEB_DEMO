/**
 * [ 스탬프 스팟 데이터 ]
 * 20개 이상의 스탬프 스팟 정보를 정의합니다.
 */
export const stampSpots = [
  { id: 'hall-1', qrCode: 'hall-1-qr', nameKey: 'spaces.hall1.name', type: 'hall', descriptionKey: 'spaces.hall1.description', locationLabelKey: 'common.locations.1fEast', routeDestinationId: 'hall-1', viewerSpaceId: 'hall-1', mapHighlightId: 'hall-1', stampIcon: '🏛️', isRequired: true },
  { id: 'hall-2', qrCode: 'hall-2-qr', nameKey: 'spaces.hall2.name', type: 'hall', descriptionKey: 'spaces.hall2.description', locationLabelKey: 'common.locations.1fCentral', routeDestinationId: 'hall-2', viewerSpaceId: 'hall-2', mapHighlightId: 'hall-2', stampIcon: '🏢', isRequired: true },
  { id: 'hall-3', qrCode: 'hall-3-qr', nameKey: 'spaces.hall3.name', type: 'hall', descriptionKey: 'spaces.hall3.description', locationLabelKey: 'common.locations.1fWest', routeDestinationId: 'hall-3', viewerSpaceId: 'hall-3', mapHighlightId: 'hall-3', stampIcon: '🎪', isRequired: true },
  { id: 'hall-4', qrCode: 'hall-4-qr', nameKey: 'spaces.hall4.name', type: 'hall', descriptionKey: 'spaces.hall4.description', locationLabelKey: 'common.locations.1fNorth', routeDestinationId: 'hall-4', viewerSpaceId: 'hall-4', mapHighlightId: 'hall-4', stampIcon: '💻', isRequired: true },
  { id: 'hall-5', qrCode: 'hall-5-qr', nameKey: 'spaces.hall5.name', type: 'hall', descriptionKey: 'spaces.hall5.description', locationLabelKey: 'common.locations.1fSouth', routeDestinationId: 'hall-5', viewerSpaceId: 'hall-5', mapHighlightId: 'hall-5', stampIcon: '🌍', isRequired: true },
  { id: 'f-sodam', qrCode: 'f-sodam-qr', nameKey: 'spaces.fSodam.name', type: 'dining', descriptionKey: 'spaces.fSodam.description', locationLabelKey: 'common.locations.1fPlaza', routeDestinationId: 'f-sodam', viewerSpaceId: 'f-sodam', mapHighlightId: 'f-sodam', stampIcon: '🍱', isRequired: true },
  { id: 'c-cu1', qrCode: 'c-cu1-qr', nameKey: 'spaces.cCu1.name', type: 'info', descriptionKey: 'spaces.cCu1.description', locationLabelKey: 'common.locations.1fCenter', routeDestinationId: 'c-cu1', viewerSpaceId: 'c-cu1', mapHighlightId: 'c-cu1', stampIcon: 'ℹ️', isRequired: true },
  { id: 'hall-6', qrCode: 'hall-6-qr', nameKey: 'spaces.hall6.name', type: 'hall', descriptionKey: 'spaces.hall6.description', locationLabelKey: 'common.locations.2fNorth', routeDestinationId: 'hall-6', viewerSpaceId: 'hall-6', mapHighlightId: 'hall-6', stampIcon: '🎤', isRequired: true },
  { id: 'hall-7', qrCode: 'hall-7-qr', nameKey: 'spaces.hall7.name', type: 'hall', descriptionKey: 'spaces.hall7.description', locationLabelKey: 'common.locations.2fEast', routeDestinationId: 'hall-7', viewerSpaceId: 'hall-7', mapHighlightId: 'hall-7', stampIcon: '🕹️', isRequired: true },
  { id: 'hall-8', qrCode: 'hall-8-qr', nameKey: 'spaces.hall8.name', type: 'hall', descriptionKey: 'spaces.hall8.description', locationLabelKey: 'common.locations.2fSouth', routeDestinationId: 'hall-8', viewerSpaceId: 'hall-8', mapHighlightId: 'hall-8', stampIcon: '🎨', isRequired: true },
  { id: 'hall-9', qrCode: 'hall-9-qr', nameKey: 'spaces.hall9.name', type: 'hall', descriptionKey: 'spaces.hall9.description', locationLabelKey: 'common.locations.2fWest', routeDestinationId: 'hall-9', viewerSpaceId: 'hall-9', mapHighlightId: 'hall-9', stampIcon: '🎭', isRequired: true },
  { id: 'hall-10', qrCode: 'hall-10-qr', nameKey: 'spaces.hall10.name', type: 'hall', descriptionKey: 'spaces.hall10.description', locationLabelKey: 'common.locations.2fCentral', routeDestinationId: 'hall-10', viewerSpaceId: 'hall-10', mapHighlightId: 'hall-10', stampIcon: '🏁', isRequired: true },
  { id: 'f-myeongdong', qrCode: 'f-myeongdong-qr', nameKey: 'spaces.fMyeongdong.name', type: 'dining', descriptionKey: 'spaces.fMyeongdong.description', locationLabelKey: 'common.locations.2fPlaza', routeDestinationId: 'f-myeongdong', viewerSpaceId: 'f-myeongdong', mapHighlightId: 'f-myeongdong', stampIcon: '🍜', isRequired: true },
  { id: 'exit-west', qrCode: 'exit-west-qr', nameKey: 'spaces.exitWest.name', type: 'exit', descriptionKey: 'spaces.exitWest.description', locationLabelKey: 'common.locations.1fOuter', routeDestinationId: 'exit-west', viewerSpaceId: 'hall-1', mapHighlightId: 'exit-west', stampIcon: '🚪', isRequired: true },
  { id: 'toilet-1', qrCode: 'toilet-1-qr', nameKey: 'spaces.toilet1.name', type: 'restroom', descriptionKey: 'spaces.toilet1.description', locationLabelKey: 'common.locations.1fCenter', routeDestinationId: 'toilet-1', viewerSpaceId: 'hall-1', mapHighlightId: 'toilet-1', stampIcon: '🚻', isRequired: false },
  { id: 'medical', qrCode: 'medical-qr', nameKey: 'gamification.items.medical.name', type: 'medical', descriptionKey: 'gamification.items.medical.description', locationLabelKey: 'common.locations.1fEast', routeDestinationId: 'medical', viewerSpaceId: 'hall-1', mapHighlightId: 'medical', stampIcon: '🏥', isRequired: false },
  { id: 'gift-zone', qrCode: 'gift-zone-qr', nameKey: 'spaces.giftZone.name', type: 'reward', descriptionKey: 'spaces.giftZone.description', locationLabelKey: 'common.locations.1fLobby', routeDestinationId: 'gift-zone', viewerSpaceId: 'hall-1', mapHighlightId: 'gift-zone', stampIcon: '🎁', isRequired: false },
  { id: 'translation-center', qrCode: 'translation-qr', nameKey: 'spaces.translationCenter.name', type: 'info', descriptionKey: 'spaces.translationCenter.description', locationLabelKey: 'common.locations.1fCentral', routeDestinationId: 'translation-center', viewerSpaceId: 'hall-1', mapHighlightId: 'translation-center', stampIcon: '🎧', isRequired: true },
  { id: 'welcome-zone', qrCode: 'welcome-qr', nameKey: 'spaces.welcomeZone.name', type: 'info', descriptionKey: 'spaces.welcomeZone.description', locationLabelKey: 'common.locations.1fEntry', routeDestinationId: 'welcome-zone', viewerSpaceId: 'hall-1', mapHighlightId: 'welcome-zone', stampIcon: '👋', isRequired: true },
  { id: 'experience-zone', qrCode: 'experience-qr', nameKey: 'gamification.items.experienceZone.name', type: 'hall', descriptionKey: 'gamification.items.experienceZone.description', locationLabelKey: 'common.locations.2fLobby', routeDestinationId: 'experience-zone', viewerSpaceId: 'hall-6', mapHighlightId: 'experience-zone', stampIcon: '✨', isRequired: true }
];

/**
 * [ 퀘스트 데이터 ]
 */
export const quests = [
  { id: 'quest-welcome-tour', titleKey: 'quests.items.questWelcomeTour.title', type: 'exploration', requiredSpotIds: ['welcome-zone', 'hall-1', 'translation-center'], rewardBadgeId: 'badge-welcome-explorer', descriptionKey: 'quests.items.questWelcomeTour.description', isCompleted: false },
  { id: 'quest-hall-master', titleKey: 'quests.items.questHallMaster.title', type: 'exploration', requiredSpotIds: ['hall-1', 'hall-2', 'hall-3', 'hall-4', 'hall-5'], rewardBadgeId: 'badge-hall-explorer', descriptionKey: 'quests.items.questHallMaster.description', isCompleted: false },
  { id: 'quest-foodie', titleKey: 'quests.items.questFoodie.title', type: 'exploration', requiredSpotIds: ['f-sodam', 'f-myeongdong'], rewardBadgeId: 'badge-gourmet', descriptionKey: 'quests.items.questFoodie.description', isCompleted: false }
];

/**
 * [ 배지 데이터 ]
 */
export const badges = [
  { id: 'badge-welcome-explorer', nameKey: 'badges.items.badgeWelcomeExplorer.name', descriptionKey: 'badges.items.badgeWelcomeExplorer.description', icon: '🏅', unlockConditionKey: 'badges.items.badgeWelcomeExplorer.unlockCondition', rarity: 'common' },
  { id: 'badge-hall-explorer', nameKey: 'badges.items.badgeHallExplorer.name', descriptionKey: 'badges.items.badgeHallExplorer.description', icon: '🏛️', unlockConditionKey: 'badges.items.badgeHallExplorer.unlockCondition', rarity: 'rare' },
  { id: 'badge-gourmet', nameKey: 'badges.items.badgeGourmet.name', descriptionKey: 'badges.items.badgeGourmet.description', icon: '🍲', unlockConditionKey: 'badges.items.badgeGourmet.unlockCondition', rarity: 'common' },
  { id: 'badge-master', nameKey: 'badges.items.badgeMaster.name', descriptionKey: 'badges.items.badgeMaster.description', icon: '👑', unlockConditionKey: 'badges.items.badgeMaster.unlockCondition', rarity: 'epic' }
];

/**
 * [ 패스포트 초기 데이터 ]
 */
export const initialPassport = {
  userId: 'mock-user-2026',
  totalStampCount: 20,
  collectedStampIds: [],
  completedQuestIds: [],
  unlockedBadgeIds: [],
  rewardClaimed: false,
  lastVisitedSpotId: null,
  updatedAt: null
};
