import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getProjet = async () => {
    return axios.get(`${DOMAIN}/api/fournisseur`);
  };

export const post = async (data) => {
  return axios.post(`${DOMAIN}/api/fournisseur`, data);
};