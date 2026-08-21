import apiClient from './api';

export const locationService = {
  async resolveCoordinates(lat, lng) {
    const response = await apiClient.get('/locations/resolve', {
      params: { lat, lng },
    });
    return response.data.data;
  },

  async listWards() {
    const response = await apiClient.get('/locations/wards');
    return response.data.data;
  },
};
