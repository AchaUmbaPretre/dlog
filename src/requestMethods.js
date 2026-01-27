import axios from "axios";
import config from "./config";

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const userRequest = axios.create({
  baseURL: DOMAIN,
  withCredentials: true, // pour envoyer le cookie refreshToken
});

userRequest.interceptors.request.use((reqConfig) => {
  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUser = user && JSON.parse(user).currentUser;
  const TOKEN = currentUser?.accessToken;

  if (TOKEN) {
    reqConfig.headers.Authorization = `Bearer ${TOKEN}`;
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
        const res = await axios.get(`${DOMAIN}/api/auth/refresh-token`, { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        // Mettre à jour le currentUser dans persist:root
        const persisted = JSON.parse(localStorage.getItem("persist:root"));
        if (persisted) {
          const user = JSON.parse(persisted.user);
          user.currentUser.accessToken = newAccessToken;
          persisted.user = JSON.stringify(user);
          localStorage.setItem("persist:root", JSON.stringify(persisted));
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);

      } catch (refreshError) {
        console.error("Impossible de rafraîchir le token", refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
