// src/services/authService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getDepartement = async () => {
    return axios.get(`${DOMAIN}/api/departement`);
  };

export const getDepartementOne = async (id) => {
    return axios.get(`${DOMAIN}/api/departement/one`);
  };

export const postDepartement = async (data) => {
  return axios.post(`${DOMAIN}/api/departement`, data);
};