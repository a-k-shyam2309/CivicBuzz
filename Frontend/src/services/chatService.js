import apiClient from './api';

export const chatService = {
  async sendMessage(message, sessionId = null, language = 'en') {
    const response = await apiClient.post('/chat/message', {
      message,
      session_id: sessionId,
      language,
    });
    return response.data.data;
  },
};
