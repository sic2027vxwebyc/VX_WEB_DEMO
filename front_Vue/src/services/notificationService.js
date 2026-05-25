/**
 * [Notification Service]
 * 알림 목록 및 상태 관리 API 호출
 */
import { api } from './api';

export const notificationService = {
  async fetchNotifications() { return await api.get('/notifications'); },
  async fetchNotificationById(id) { return await api.get(`/notifications/${id}`); },
  async markAsRead(id) { return await api.patch(`/notifications/${id}/read`); },
  async markAllAsRead() { return await api.patch('/notifications/read-all'); }
  // SSE 스트림은 별도 처리
};
