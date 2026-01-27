import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN

export const loginUser = async (user) => {
  return axios.post(`${DOMAIN}/api/auth/login`, user);
};

export const registerUser = async (user) => {
  return axios.post(`${DOMAIN}/api/auth/register`, user);
};

export const logout = async () => {
  try {
    await axios.post(`${DOMAIN}/api/auth/logout`, {}, { withCredentials: true });

    localStorage.removeItem('persist:root');
    window.location.href = '/login';
  } catch (err) {
    console.error('Erreur logout:', err);
  }
};

/* export const detailForgot  = async (user) => {
    return axios.post(`${DOMAIN}/api/auth/detail_forgot`, user);
  }; */

export const getPasswordForgot = async (email) => {

    return axios.get(`${DOMAIN}/api/auth/password_forgot?email=${email}`);
  };

export const passwordReset  = async (id,user) => {
    return axios.put(`${DOMAIN}/api/auth/password_reset?id=${id}`, user);
  };