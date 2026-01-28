import axios from "axios";
import config from "./config";

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const userRequest = axios.create({
  baseURL: DOMAIN,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: DOMAIN,
  withCredentials: true,
});

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

userRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await refreshClient.get("/api/auth/refresh-token");
        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) throw new Error("No token");

        const persisted = JSON.parse(localStorage.getItem("persist:root"));
        const user = JSON.parse(persisted.user);
        user.currentUser.accessToken = newAccessToken;
        persisted.user = JSON.stringify(user);
        localStorage.setItem("persist:root", JSON.stringify(persisted));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return userRequest(originalRequest);
      } catch {
        localStorage.removeItem("persist:root");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
