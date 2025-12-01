// src/services/generateurService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

//type generateur
export const getTypeGenerateur = async () => {
  return axios.get(`${DOMAIN}/api/generateur/type_generateur`);
};

export const postTypeGenerateur = async (data) => {
  return axios.post(`${DOMAIN}/api/generateur/type_generateur`, data);
};

export const getMarqueGenerateur  = async () => {
  return axios.get(`${DOMAIN}/api/generateur/marque_generateur`);
};

export const postMarqueGenerateur = async (data) => {
  return axios.post(`${DOMAIN}/api/generateur/marque_generateur`, data);
};

export const getModeleGenerateur  = async () => {
  return axios.get(`${DOMAIN}/api/generateur/modele_generateur`);
};

export const getModeleGenerateurOne  = async (id) => {
  return axios.get(`${DOMAIN}/api/generateur/modele_generateur`,{
    params: {
      id_marque_generateur: id
    }
  });
};

export const postModeleGenerateur = async (data) => {
  return axios.post(`${DOMAIN}/api/generateur/modele_generateur`, data);
};

export const getRefroidissement  = async () => {
  return axios.get(`${DOMAIN}/api/generateur/refroidissement`);
};

export const getGenerateur = async (user) => {
    return axios.get(`${DOMAIN}/api/generateur`);
  };

export const getGenerateurOne= async (id) => {
    return axios.get(`${DOMAIN}/api/generateur/one?id_frequence=${id}`);
  };

export const postGenerateur = async (data) => {
  return axios.post(`${DOMAIN}/api/generateur`, data);
};