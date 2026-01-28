import axios from "axios";
import config from "./config";

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const userRequest = axios.create({
  baseURL: DOMAIN,
  withCredentials: true,
});

// Instance spéciale pour refresh token
const refreshClient = axios.create({
  baseURL: DOMAIN,
  withCredentials: true,
});

// Flag pour éviter les refresh simultanés
let isRefreshing = false;
let refreshSubscribers = [];

// Ajouter des callbacks à exécuter après refresh
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// ===================== REQUEST INTERCEPTOR =====================
userRequest.interceptors.request.use((config) => {
  try {
    const persisted = JSON.parse(localStorage.getItem("persist:root"));
    const user = persisted?.user ? JSON.parse(persisted.user) : null;
    const token = user?.currentUser?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// ===================== RESPONSE INTERCEPTOR =====================
userRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // 401 → access token expiré
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Si un refresh est déjà en cours, on attend qu’il se termine
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(userRequest(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await refreshClient.get("/api/auth/refresh-token");
        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) throw new Error("No token");

        // Mettre à jour le localStorage
        const persisted = JSON.parse(localStorage.getItem("persist:root"));
        const user = JSON.parse(persisted.user);
        user.currentUser.accessToken = newAccessToken;
        persisted.user = JSON.stringify(user);
        localStorage.setItem("persist:root", JSON.stringify(persisted));

        // Notifier toutes les requêtes en attente
        onRefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return userRequest(originalRequest);
      } catch {
        // refresh échoué → logout
        localStorage.removeItem("persist:root");
        window.location.href = "/login";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);