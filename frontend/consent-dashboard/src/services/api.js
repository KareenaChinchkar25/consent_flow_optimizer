import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Basic error wrapper
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === "ECONNREFUSED") {
      throw new Error("ML backend offline. Start FastAPI server.");
    }
    if (err.response?.data?.detail) {
      throw new Error(err.response.data.detail);
    }
    throw err;
  }
);

export const consentService = {
  // ⭐ NEW — get REAL consents (already predicted)
  async getConsents() {
    const response = await api.get("/consents");
    return response.data; // already array of consents
  },

  // 🔧 Browser extension sends POST -> /add-consent
  async addConsent(consent) {
    const response = await api.post("/add-consent", consent);
    return response.data;
  },
};
