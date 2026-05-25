/**
 * [Map Service]
 * 지도 및 공간 정보 API 호출
 */
import { api } from './api';

export const mapService = {
  async fetchFloors() { return await api.get('/map/floors'); },
  async fetchSpaces(floorId) { return await api.get(`/map/spaces?floor_id=${floorId}`); },
  async fetchCongestion() { return await api.get('/map/congestion'); }
};
