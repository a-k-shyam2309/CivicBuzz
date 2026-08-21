import apiClient from './api';

export const authService = {
  async login(email, password, role = 'citizen') {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
      role,
    });
    return response.data.data;
  },

  async register(data) {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
  },

  async sendOTP(target, purpose = 'REGISTRATION') {
    const response = await apiClient.post('/auth/send-otp', {
      target,
      purpose,
    });
    return response.data;
  },

  async verifyOTP(target, otp_code) {
    const response = await apiClient.post('/auth/verify-otp', {
      target,
      otp_code,
    });
    return response.data;
  },

  async forgotPassword(email) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(email, otp_code, new_password) {
    const response = await apiClient.post('/auth/reset-password', {
      email,
      otp_code,
      new_password,
    });
    return response.data;
  },

  async initiateAadhaar(aadhaar_number) {
    const response = await apiClient.post('/auth/aadhaar/initiate', {
      aadhaar_number,
    });
    return response.data;
  },

  async verifyAadhaar(transaction_id, otp_code) {
    const response = await apiClient.post('/auth/aadhaar/verify', {
      transaction_id,
      otp_code,
    });
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('civicbuzz_token');
      localStorage.removeItem('civicbuzz_user');
    }
  },
};
