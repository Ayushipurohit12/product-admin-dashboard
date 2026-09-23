import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 15000,
});

const TOKEN_KEY = "pad_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong. Please try again.";
    let status = null;

    if (axios.isCancel(error)) {
      return Promise.reject({ cancelled: true, message: "cancelled", status });
    }

    if (error.response) {
      status = error.response.status;
      message = error.response.data?.message || message;

      if (status === 401) {
        setToken(null);
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        message = "Your session has expired. Please log in again.";
      }
    } else if (error.request) {
      message = "Could not reach the server. Check your connection and try again.";
    }

    return Promise.reject({ message, status, original: error });
  }
);

export default api;
