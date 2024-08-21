// src/services/authService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getFormat = async () => {
    return axios.get(`${DOMAIN}/api/format`);
  };

export const postFormat = async (data) => {
  return axios.post(`${DOMAIN}/api/format`, data);
};