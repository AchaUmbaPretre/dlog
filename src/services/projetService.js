import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getProjet = async () => {
    return axios.get(`${DOMAIN}/api/projet`);
  };

export const postProjet = async (data) => {
  return axios.post(`${DOMAIN}/api/projet`, data);
};