import apiClient from './api';

export const notificationService = {
  async getNotifications() {
    const response = await apiClient.get('/notifications');
    return response.data.data;
  },

  async markAsRead(notificationId) {
    const response = await apiClient.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },
};
