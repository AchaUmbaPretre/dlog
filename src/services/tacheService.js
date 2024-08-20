// src/services/authService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getTache = async (user) => {
    return axios.get(`${DOMAIN}/api/tache`);
  };

export const getTacheOne = async (id) => {
    return axios.get(`${DOMAIN}/api/tache/one?id_tache=${id}`);
  };

export const postTacha = async (data) => {
  console.log(data)
  return axios.post(`${DOMAIN}/api/tache`, data);
};