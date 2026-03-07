import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage on every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth helpers
export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    apiClient.post("/auth/signup", data),
  login: (data: { email: string; password: string }) =>
    apiClient.post("/auth/login", data),
  logout: () => apiClient.get("/auth/logout"),
};

// Freshdesk helpers
export const freshdeskApi = {
  connect: (data: { apiKey: string; domain: string }) =>
    apiClient.post("/freshdesk/connect", data),
  status: () => apiClient.get("/freshdesk/status"),
  tickets: () => apiClient.get("/freshdesk/tickets"),
  ticket: (id: string) => apiClient.get(`/freshdesk/tickets/${id}`),
  conversations: (id: string) =>
    apiClient.get(`/freshdesk/tickets/${id}/conversations`),
};

// HubSpot helpers
export const hubspotApi = {
  getAuthUrl: () => apiClient.get("/hubspot/connect"),
  contact: (email: string) => apiClient.get(`/hubspot/contact?email=${email}`),
};

// Webhook helpers
export const webhookApi = {
  logs: (limit = 100) => apiClient.get(`/webhook/logs?limit=${limit}`),
  // ✅ Added: trigger a test webhook event
  trigger: () =>
    apiClient.post("/webhook/freshdesk"),
};