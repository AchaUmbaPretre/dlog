import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getFournisseurCount = async () => {
    return axios.get(`${DOMAIN}/api/fournisseur/count`);
  };
  
export const getFournisseur = async () => {
    return axios.get(`${DOMAIN}/api/fournisseur`);
  };

export const getFournisseur_activite = async () => {
    return axios.get(`${DOMAIN}/api/fournisseur/fournisseur_activite`);
  };

export const getFournisseur_activiteOne = async (id) => {
    return axios.get(`${DOMAIN}/api/fournisseur/fournisseur_activite/one?id_activite=${id}`);
  };

export const postFournisseur = async (data) => {
  return axios.post(`${DOMAIN}/api/fournisseur`, data);
};