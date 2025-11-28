// src/services/generateurService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getGenerateur = async (user) => {
    return axios.get(`${DOMAIN}/api/generateur`);
  };

export const getGenerateurOne= async (id) => {
    return axios.get(`${DOMAIN}/api/generateur/one?id_frequence=${id}`);
  };

export const postGenerateur = async (data) => {
  return axios.post(`${DOMAIN}/api/generateur`, data);
};