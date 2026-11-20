import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ems_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 session expiry
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto logout if it's the login endpoint failing
      if (!error.config.url.includes("/auth/login")) {
        localStorage.removeItem("ems_token");
        localStorage.removeItem("ems_user");
        window.location.href = "/login?expired=true";
      }
    }
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data === "string" ? error.response.data : null) ||
      error.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
