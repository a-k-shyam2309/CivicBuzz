import apiClient from './api';

export const adminService = {
  async getDashboardMetrics() {
    const response = await apiClient.get('/admin/dashboard');
    return response.data.data;
  },

  async getRoutingQueue() {
    const response = await apiClient.get('/admin/queue');
    return response.data.data;
  },

  async reassignDepartment(complaintId, newDepartmentCode, notes = '') {
    const response = await apiClient.post(
      `/admin/complaints/${complaintId}/reassign`,
      null,
      {
        params: {
          new_department_code: newDepartmentCode,
          notes,
        },
      }
    );
    return response.data;
  },

  async getAuditLogs(limit = 50) {
    const response = await apiClient.get('/admin/audit-logs', {
      params: { limit },
    });
    return response.data.data;
  },
};
