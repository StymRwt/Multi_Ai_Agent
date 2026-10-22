import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send the HTTP-only JWT cookie
  timeout: 60_000,
});

// In mock mode, every request is answered by an in-browser fake backend.
if (import.meta.env.VITE_USE_MOCK === "true") {
  api.defaults.adapter = (config) =>
    import("./mock.js").then((m) => m.mockAdapter(config));
}

// Central place to react to expired sessions (wired up in main.jsx).
let onUnauthorized = null;
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCall = url.includes("/api/auth/");
    if (error.response?.status === 401 && !isAuthCall) onUnauthorized?.();
    return Promise.reject(error);
  }
);

export default api;
