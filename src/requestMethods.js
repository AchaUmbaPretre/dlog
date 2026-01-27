import axios from "axios";
import config from "./config";

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const userRequest = axios.create({
  baseURL: DOMAIN,
  withCredentials: true,
});

userRequest.interceptors.request.use((reqConfig) => {
  try {
    const persisted = JSON.parse(localStorage.getItem("persist:root"));
    const user = persisted?.user ? JSON.parse(persisted.user) : null;
    const TOKEN = user?.currentUser?.accessToken;

    if (TOKEN) {
      reqConfig.headers.Authorization = `Bearer ${TOKEN}`;
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du token depuis localStorage", err);
  }

  return reqConfig;
});

userRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Appel pour rafraîchir le token via le refreshToken cookie
        const res = await axios.get(`${DOMAIN}/api/auth/refresh-token`, { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) {
          throw new Error("Pas de nouvel accessToken reçu");
        }

        const persisted = JSON.parse(localStorage.getItem("persist:root")) || {};
        const user = persisted.user ? JSON.parse(persisted.user) : {};
        user.currentUser = user.currentUser || {};
        user.currentUser.accessToken = newAccessToken;
        persisted.user = JSON.stringify(user);
        localStorage.setItem("persist:root", JSON.stringify(persisted));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Impossible de rafraîchir le token", refreshError);

        localStorage.removeItem("persist:root");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
