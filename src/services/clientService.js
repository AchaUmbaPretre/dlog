import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getClient = async () => {
    return axios.get(`${DOMAIN}/api/client`);
  };

export const getClientOne = async (id) => {
    return axios.get(`${DOMAIN}/api/client/one?id_client=${id}`);
  };

export const postClient = async (data) => {
  console.log(data)
  return axios.post(`${DOMAIN}/api/client`, data);
};

export const putClient = async (data) => {
    console.log(data)
    return axios.put(`${DOMAIN}/api/client`, data);
  };