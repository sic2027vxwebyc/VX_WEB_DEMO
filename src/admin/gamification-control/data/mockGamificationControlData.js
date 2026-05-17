/**
 * [ 관리자 게이미피케이션 데이터 로더 ]
 * JSON 파일들로부터 초기 Mock 데이터를 불러와 익스포트합니다.
 */
import rewardsConfig from './configs/rewards.json'
import questsConfig from './configs/quests.json'
import statsConfig from './configs/stats.json'

export const mockGamificationStats = statsConfig
export const mockRewardStocks = rewardsConfig
export const mockDynamicQuests = questsConfig
