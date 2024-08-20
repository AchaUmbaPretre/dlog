// src/services/authService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getConsultation = async (user) => {
    return axios.get(`${DOMAIN}/api/consultant`);
  };

export const getConsultationType = async (user) => {
    return axios.get(`${DOMAIN}/api/consultant/consult_type`);
  };

export const postConsultation = async (data) => {
  console.log(data)
  return axios.post(`${DOMAIN}/api/consultant`, data);
};