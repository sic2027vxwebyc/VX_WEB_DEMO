/**
 * [Auth Service]
 * 사용자 인증 관련 API 호출
 */
import { api } from './api';

export const authService = {
  async login(credentials) { return await api.post('/auth/login', credentials); },
  async getMe() { return await api.get('/auth/me'); },
  async logout() { return await api.post('/auth/logout'); }
};
