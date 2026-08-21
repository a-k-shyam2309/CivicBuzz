import apiClient from './api';

export const complaintService = {
  async createComplaint(data) {
    const response = await apiClient.post('/complaints', data);
    return response.data.data;
  },

  async listComplaints(params = {}) {
    const response = await apiClient.get('/complaints', { params });
    return response.data.data;
  },

  async getMyComplaints() {
    const response = await apiClient.get('/complaints/my/list');
    return response.data.data;
  },

  async getComplaintById(complaintId) {
    const response = await apiClient.get(`/complaints/${complaintId}`);
    return response.data.data;
  },

  async getNearbyComplaints(lat, lng, radiusMeters = 1000, category = null) {
    const params = { lat, lng, radius_meters: radiusMeters };
    if (category) params.category = category;
    const response = await apiClient.get('/complaints/nearby/search', { params });
    return response.data.data;
  },

  async getPublicComplaints(params = {}) {
    const response = await apiClient.get('/public/complaints', { params });
    return response.data.data;
  },

  async getPublicStats() {
    const response = await apiClient.get('/public/stats');
    return response.data.data;
  },

  async getIssueClusters() {
    const response = await apiClient.get('/public/clusters');
    return response.data.data;
  },

  async submitResolutionEvidence(complaintId, workDescription, afterImageUrl) {
    const response = await apiClient.post(
      `/complaints/${complaintId}/submit-resolution`,
      null,
      {
        params: {
          work_description: workDescription,
          after_image_url: afterImageUrl,
        },
      }
    );
    return response.data;
  },

  async verifyCitizenResolution(complaintId, rating, comments = '') {
    const response = await apiClient.post(
      `/complaints/${complaintId}/verify-resolution`,
      null,
      {
        params: {
          rating,
          comments,
        },
      }
    );
    return response.data;
  },

  async rejectCitizenResolution(complaintId, reason) {
    const response = await apiClient.post(
      `/complaints/${complaintId}/reject-resolution`,
      null,
      {
        params: {
          reason,
        },
      }
    );
    return response.data;
  },

  async getVerificationStatus(complaintId) {
    const response = await apiClient.get(`/complaints/${complaintId}/verification-status`);
    return response.data.data;
  },

  async getResolutionHistory(complaintId) {
    const response = await apiClient.get(`/complaints/${complaintId}/resolution-history`);
    return response.data.data;
  },

  async uploadEvidence(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/evidence/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
