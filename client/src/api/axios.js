import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("task_manager_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("task_manager_token");

      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  return error.response?.data?.message || error.message || fallback;
};

export const getApiFieldErrors = (error) => {
  return error.response?.data?.errors || {};
};

export default api;
