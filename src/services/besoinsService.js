import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getBesoinCount = async () => {
    return axios.get(`${DOMAIN}/api/besoin/count`);
  };

export const getBesoin = async () => {
    return axios.get(`${DOMAIN}/api/besoin`);
  };

export const getBesoinInactif = async () => {
    return axios.get(`${DOMAIN}/api/besoin/besoin-inactif`);
  };

export const getBesoinOne = async (id) => {
    return axios.get(`${DOMAIN}/api/besoin/one?id_besoin=${id}`);
  };

export const postBesoin = async (data) => {
  return axios.post(`${DOMAIN}/api/besoin`, data);
};

export const postBesoinClient = async (data) => {
  return axios.post(`${DOMAIN}/api/besoin/besoin_client`, data);
};

export const deleteBesoin = async (id) => {
    return axios.delete(`${DOMAIN}/api/besoin/${id}`);
  };