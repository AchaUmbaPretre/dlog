import axios from "axios";

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.accessToken;

const config = {
  REACT_APP_SERVER_DOMAIN : 'http://localhost:8080'
};

export default config;

export const userRequest = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { Authorization: `Bearer ${TOKEN}` },
});