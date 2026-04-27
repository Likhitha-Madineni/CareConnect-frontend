import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("careconnect_token");

    // 🔥 attach token safely
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 handle unauthorized properly
    if (error.response?.status === 401) {
      console.warn("Unauthorized → clearing token");

      localStorage.removeItem("careconnect_token");

      // optional: redirect to login (safe UX)
      if (!window.location.hash.includes("/login")) {
        const baseUrl = import.meta.env.BASE_URL || "/";
        window.location.href = `${baseUrl}#/login`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL };
