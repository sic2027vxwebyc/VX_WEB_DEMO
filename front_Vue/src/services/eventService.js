/**
 * [Event Service]
 * 이벤트 일정 및 즐겨찾기 API 호출
 */
import { api } from './api';

export const eventService = {
  async fetchEvents(params) { return await api.get(`/events?${new URLSearchParams(params)}`); },
  async fetchEventById(id) { return await api.get(`/events/${id}`); },
  async favoriteEvent(id) { return await api.post(`/events/${id}/favorite`); },
  async unfavoriteEvent(id) { return await api.delete(`/events/${id}/favorite`); }
};
