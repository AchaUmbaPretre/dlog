// src/services/authService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getFrequence = async (user) => {
    return axios.get(`${DOMAIN}/api/frequence`);
  };

export const getFrequenceOne= async (id) => {
    return axios.get(`${DOMAIN}/api/frequence/one?id_frequence=${id}`);
  };

export const postFrequence = async (data) => {
  return axios.post(`${DOMAIN}/api/frequence`, data);
};

export const deleteFrequence = async (id) => {
    return axios.delete(`${DOMAIN}/api/frequence/${id}`,);
  };
  
export const putFrequence = async (id, data) => {
    return axios.put(`${DOMAIN}/api/frequence?id_frequence=${id}`, data);
  };
  

