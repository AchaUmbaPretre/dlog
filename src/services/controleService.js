// src/services/authService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getControleCount = async () => {
  return axios.get(`${DOMAIN}/api/controle/count`);
};

export const getControle = async (user) => {
    return axios.get(`${DOMAIN}/api/controle`);
  };

export const getControleOne = async (id) => {
    return axios.get(`${DOMAIN}/api/controle/one?id_controle=${id}`);
  };

export const postControle = async (data) => {
  return axios.post(`${DOMAIN}/api/controle`, data);
};

export const deletePutControle = async (id) => {
  return axios.put(`${DOMAIN}/api/controle/est_supprime?id=${id}`);
};

export const putControle = async (id, data) => {
  return axios.put(`${DOMAIN}/api/controle?id_controle=${id}`, data);

}