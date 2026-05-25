import { defineStore } from 'pinia';
import { logger } from '@/utils/logger';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    isConnected: false,
    eventSource: null,
  }),
  actions: {
    connect() {
      if (this.isConnected) return;
      this.eventSource = new EventSource(import.meta.env.VITE_SSE_URL || '/api/notifications');
      
      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.notifications.push(data);
        logger.info('SSE', 'New notification received', data);
      };

      this.eventSource.onerror = (error) => {
        logger.error('SSE', 'SSE connection error', error);
        this.disconnect();
      };

      this.isConnected = true;
      logger.info('SSE', 'Connection established');
    },
    disconnect() {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
      this.isConnected = false;
      logger.info('SSE', 'Connection closed');
    }
  }
});
