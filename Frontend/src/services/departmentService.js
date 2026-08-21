import apiClient from './api';

export const departmentService = {
  async getDepartmentStats() {
    const response = await apiClient.get('/department/stats');
    return response.data.data;
  },

  async getDepartmentComplaints(params = {}) {
    const response = await apiClient.get('/department/complaints', { params });
    return response.data.data;
  },

  async startWork(complaintId, notes = '') {
    const response = await apiClient.post(
      `/department/complaints/${complaintId}/start-work`,
      null,
      {
        params: { notes },
      }
    );
    return response.data;
  },
};
