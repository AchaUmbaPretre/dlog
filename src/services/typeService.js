import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getTypes = async () => {
    return axios.get(`${DOMAIN}/api/types`);
  };

export const getCategorie = async () => {
    return axios.get(`${DOMAIN}/api/types/categorie`);
  };

export const getArticle = async () => {
    return axios.get(`${DOMAIN}/api/types/article`);
  };
