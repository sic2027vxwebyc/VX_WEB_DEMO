/**
 * [Gamification Service]
 * 퀘스트, 스탬프, 배지 API 호출
 */
import { api } from './api';

export const gamificationService = {
  async fetchQuests() { return await api.get('/quests'); },
  async claimStamp(spotId) { return await api.post('/user/stamps', { spot_id: spotId }); },
  async fetchPassport() { return await api.get('/user/passport'); },
  async fetchBadges() { return await api.get('/user/badges'); }
};
