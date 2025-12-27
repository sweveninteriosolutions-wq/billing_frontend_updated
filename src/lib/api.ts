// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 🔥 TOKEN EXPIRED
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
