import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getRapport = async () => {
    return axios.get(`${DOMAIN}/api/rapport`);
  };

export const getRapportOne = async (id) => {
    return axios.get(`${DOMAIN}/api/rapport/one?rapport=${id}`);
  };

export const postRapport = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport`, data)
}