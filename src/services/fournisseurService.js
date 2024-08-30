import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getFournisseurCount = async () => {
    return axios.get(`${DOMAIN}/api/fournisseur/count`);
  };
  
export const getFournisseur = async () => {
    return axios.get(`${DOMAIN}/api/fournisseur`);
  };

export const postFournisseur = async (data) => {
  return axios.post(`${DOMAIN}/api/fournisseur`, data);
};