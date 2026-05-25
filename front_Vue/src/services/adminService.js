/**
 * [Admin Service]
 * 관리자 운영 기능 API 호출
 */
import { api } from './api';

export const adminService = {
  async fetchLogs(scope, level) { return await api.get(`/admin/logs?scope=${scope}&level=${level}`); },
  async sendAnnouncement(title, content) { return await api.post('/admin/announcements', { title_key: title, content_key: content }); },
  async fetchMetrics() { return await api.get('/admin/metrics'); }
};
