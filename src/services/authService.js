// src/services/authService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN

export const loginUser = async (user) => {
  return axios.post(`${DOMAIN}/api/auth/login`, user);
};

export const registerUser = async (user) => {
  return axios.post(`${DOMAIN}/api/auth/register`, user);
};

export const logout = async (user) => {
    return axios.post(`${DOMAIN}/api/auth/logout`, user);
  };

/* export const detailForgot  = async (user) => {
    return axios.post(`${DOMAIN}/api/auth/detail_forgot`, user);
  }; */

export const getPasswordForgot = async (email) => {

    return axios.get(`${DOMAIN}/api/auth/password_forgot?email=${email}`);
  };

export const passwordReset  = async (id,user) => {
  console.log(id, user)
    return axios.put(`${DOMAIN}/api/auth/password_reset?id=${id}`, user);
  };