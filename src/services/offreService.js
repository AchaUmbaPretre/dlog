import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getOffre = async () => {
    return axios.get(`${DOMAIN}/api/offre`);
  };


export const postOffre = async (data) => {
  return axios.post(`${DOMAIN}/api/offre`, data);
};


export const deleteOffre = async (id) => {
    return axios.delete(`${DOMAIN}/api/offre/${id}`);
  };