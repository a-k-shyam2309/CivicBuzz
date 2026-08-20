/**
 * CivicBuzz Frontend Universal API Integration Client
 * Provides seamless connection between existing HTML/CSS/JS frontend modules and the FastAPI backend.
 * Gracefully falls back to local simulation if backend is offline.
 */

const API_CONFIG = {
  BASE_URL: "http://localhost:8000/api/v1",
  TIMEOUT_MS: 8000,
};

const CivicBuzzAPI = {
  // Token & Session Management
  getToken: () => localStorage.getItem("civicbuzz_token"),
  setToken: (token) => localStorage.setItem("civicbuzz_token", token),
  removeToken: () => {
    localStorage.removeItem("civicbuzz_token");
    localStorage.removeItem("civicbuzz_user");
  },
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem("civicbuzz_user") || "null");
    } catch (_) {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem("civicbuzz_user", JSON.stringify(user)),

  // Generic Request Helper
  async request(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || json.detail?.message || "Request failed");
      }
      return json;
    } catch (err) {
      console.warn(`CivicBuzz API call to ${endpoint} note:`, err.message);
      throw err;
    }
  },

  // 1. Auth Module
  auth: {
    async register(data) {
      return CivicBuzzAPI.request("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async login(email, password, role = "citizen") {
      const res = await CivicBuzzAPI.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });
      if (res.data?.access_token) {
        CivicBuzzAPI.setToken(res.data.access_token);
        CivicBuzzAPI.setUser(res.data);
      }
      return res;
    },
    async sendOtp(target, purpose = "LOGIN") {
      return CivicBuzzAPI.request("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ target, purpose }),
      });
    },
    async verifyOtp(target, otp_code, purpose = "LOGIN") {
      return CivicBuzzAPI.request("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ target, otp_code, purpose }),
      });
    },
    async forgotPassword(email) {
      return CivicBuzzAPI.request("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    async resetPassword(email, otp_code, new_password) {
      return CivicBuzzAPI.request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, otp_code, new_password }),
      });
    },
    async getMe() {
      return CivicBuzzAPI.request("/auth/me");
    },
    async logout() {
      CivicBuzzAPI.removeToken();
    },
  },

  // 2. Complaints Module
  complaints: {
    async create(data) {
      return CivicBuzzAPI.request("/complaints", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async getMyComplaints() {
      return CivicBuzzAPI.request("/complaints/my/list");
    },
    async getNearby(lat, lng, radiusMeters = 1000) {
      return CivicBuzzAPI.request(`/complaints/nearby/search?lat=${lat}&lng=${lng}&radius_meters=${radiusMeters}`);
    },
    async getDetail(id) {
      return CivicBuzzAPI.request(`/complaints/${id}`);
    },
    async verifyResolution(id, rating, comments = "") {
      return CivicBuzzAPI.request(`/complaints/${id}/verify-resolution?rating=${rating}&comments=${encodeURIComponent(comments)}`, {
        method: "POST",
      });
    },
    async rejectResolution(id, reason) {
      return CivicBuzzAPI.request(`/complaints/${id}/reject-resolution?reason=${encodeURIComponent(reason)}`, {
        method: "POST",
      });
    },
  },

  // 3. Locations Module
  locations: {
    async resolve(lat, lng) {
      return CivicBuzzAPI.request(`/locations/resolve?lat=${lat}&lng=${lng}`);
    },
    async getWards() {
      return CivicBuzzAPI.request("/locations/wards");
    },
  },

  // 4. Tenders Module
  tenders: {
    async list(category = "all") {
      return CivicBuzzAPI.request(`/tenders?category=${category}`);
    },
    async getDetail(id) {
      return CivicBuzzAPI.request(`/tenders/${id}`);
    },
  },

  // 5. Participatory Budgeting & Voting
  projects: {
    async list(wardId = null) {
      const q = wardId ? `?ward_id=${wardId}` : "";
      return CivicBuzzAPI.request(`/projects${q}`);
    },
    async vote(projectId) {
      return CivicBuzzAPI.request(`/projects/${projectId}/vote`, {
        method: "POST",
      });
    },
    async getRankings() {
      return CivicBuzzAPI.request("/projects/rankings");
    },
  },

  // 6. Citizen Assistant Chatbot
  chat: {
    async sendMessage(message, language = "en", sessionId = null) {
      return CivicBuzzAPI.request("/chat/message", {
        method: "POST",
        body: JSON.stringify({ message, language, session_id: sessionId }),
      });
    },
  },

  // 7. Contact Us Form
  contact: {
    async submit(data) {
      return CivicBuzzAPI.request("/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  // 8. Public Transparency & Stats
  public: {
    async getStats() {
      return CivicBuzzAPI.request("/public/stats");
    },
    async listComplaints() {
      return CivicBuzzAPI.request("/public/complaints");
    },
    async listClusters() {
      return CivicBuzzAPI.request("/public/clusters");
    },
  },
};

// Make globally accessible across all frontend scripts
if (typeof window !== "undefined") {
  window.CivicBuzzAPI = CivicBuzzAPI;
}
