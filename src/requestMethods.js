import axios from "axios";
import config from "./config";

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const userRequest = axios.create({
  baseURL: DOMAIN,
  withCredentials: true,
});

/* ===================== REQUEST ===================== */
userRequest.interceptors.request.use((config) => {
  try {
    const persisted = JSON.parse(localStorage.getItem("persist:root"));
    const user = persisted?.user ? JSON.parse(persisted.user) : null;
    const token = user?.currentUser?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // silence volontaire
  }

  return config;
});

/* ===================== RESPONSE ===================== */
userRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const code = error.response?.data?.code;

    // 🔐 refresh uniquement si access token expiré
    if (
      status === 401 &&
      code === "TOKEN_EXPIRED" &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await userRequest.get("/api/auth/refresh-token");
        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) throw new Error("No token");

        const persisted = JSON.parse(localStorage.getItem("persist:root"));
        const user = JSON.parse(persisted.user);
        user.currentUser.accessToken = newAccessToken;
        persisted.user = JSON.stringify(user);
        localStorage.setItem("persist:root", JSON.stringify(persisted));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return userRequest(originalRequest);
      } catch (err) {
        // 🔥 refresh failed → logout
        localStorage.removeItem("persist:root");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
