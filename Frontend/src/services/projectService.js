import apiClient from './api';

export const projectService = {
  async listProjects(params = {}) {
    const response = await apiClient.get('/projects', { params });
    return response.data.data;
  },

  async getRankings(wardId = null) {
    const params = wardId ? { ward_id: wardId } : {};
    const response = await apiClient.get('/projects/rankings', { params });
    return response.data.data;
  },

  async getProjectById(projectId) {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data.data;
  },

  async createProposal(data) {
    const response = await apiClient.post('/projects', data);
    return response.data.data;
  },

  async voteForProject(projectId) {
    const response = await apiClient.post(`/projects/${projectId}/vote`);
    return response.data;
  },
};
