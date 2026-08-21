import apiClient from './api';

export const tenderService = {
  async listTenders(params = {}) {
    const response = await apiClient.get('/tenders', { params });
    return response.data.data;
  },

  async getTenderById(tenderId) {
    const response = await apiClient.get(`/tenders/${tenderId}`);
    return response.data.data;
  },

  async createTender(data) {
    const response = await apiClient.post('/admin/tenders', data);
    return response.data.data;
  },

  async updateTender(tenderId, data) {
    const response = await apiClient.patch(`/admin/tenders/${tenderId}`, data);
    return response.data.data;
  },
};
