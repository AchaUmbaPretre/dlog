import axios from "axios";

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.accessToken;

const config = {
  REACT_APP_SERVER_DOMAIN : 'http://localhost:8080'
};

export default config;

export const userRequest = axios.create({
  baseURL: 'https://apidlog.loginsmart-cd.com',
  headers: { Authorization: `Bearer ${TOKEN}` },
});