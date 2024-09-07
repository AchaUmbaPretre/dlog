// src/services/authService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getDepartement = async () => {
    return axios.get(`${DOMAIN}/api/departement`);
  };

export const getDepartementOne = async (id) => {
  console.log(id)
    return axios.get(`${DOMAIN}/api/departement/one?id_departement=${id}`);
  };

export const postDepartement = async (data) => {
  return axios.post(`${DOMAIN}/api/departement`, data);
};

export const deletePutDepartement = async (id) => {
  return axios.put(`${DOMAIN}/api/departement/supprime_put?id=${id}`);
};


export const putDepartement = async (id, data) => {
  return axios.put(`${DOMAIN}/api/departement?id_departement=${id}`, data);
};

