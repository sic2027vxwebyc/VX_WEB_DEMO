/**
 * [Route/AR Service]
 * 경로 및 AR 환경 관련 API 호출
 */
import { api } from './api';

export const routeArService = {
  async fetchPath(from, to) { return await api.get(`/route/path?from=${from}&to=${to}`); },
  async fetchArMarkers(lat, lng) { return await api.get(`/ar/markers?lat=${lat}&lng=${lng}`); },
  async checkEnvironment() { return await api.get('/ar/environment'); }
};
