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

export const postTache = async (data) => {
  return axios.post(`${DOMAIN}/api/tache`, data);
};

export const deleteTache = async (id) => {
  return axios.delete(`${DOMAIN}/api/tache/${id}`);
};


//Tache personne
export const getTachePersonne = async (user) => {
  return axios.get(`${DOMAIN}/api/tache/tache_personne`);
};

export const getTachePersonneOne = async (id) => {
  return axios.get(`${DOMAIN}/api/tache/tache_personne?id_tache=${id}`);
};

export const postTachePersonne = async (data) => {
return axios.post(`${DOMAIN}/api/tache/tache_personne`, data);
};
