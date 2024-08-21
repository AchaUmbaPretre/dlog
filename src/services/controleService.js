// src/services/authService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getControle = async (user) => {
    return axios.get(`${DOMAIN}/api/controle`);
  };

export const getControleOne = async (id) => {
    return axios.get(`${DOMAIN}/api/controle/one?id_tache=${id}`);
  };

export const postControle = async (data) => {
  return axios.post(`${DOMAIN}/api/controle`, data);
};