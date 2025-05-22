import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getClientId = async () => {
  return axios.get(`${DOMAIN}/api/client/clientId`);
}

export const getClientCount = async () => {
  return axios.get(`${DOMAIN}/api/client/count`);
}

export const getClient = async () => {
    return axios.get(`${DOMAIN}/api/client`);
  };

export const getClientPermission = async (userId) => {
    return axios.get(`${DOMAIN}/api/client/client_permission?userId=${userId}`);
  };

export const getClientResume = async () => {
    return axios.get(`${DOMAIN}/api/client/client_resume`);
  };

export const getProvince = async () => {
    return axios.get(`${DOMAIN}/api/client/province`);
  };

export const getProvinceOne = async (id) => {
    return axios.get(`${DOMAIN}/api/client/provinceOne?id=${id}`);
  };

export const getProvinceClientOne = async (id) => {
    return axios.get(`${DOMAIN}/api/client/provinceClientOne?id_client=${id}`);
  };

export const getProvinceClient = async () => {
    return axios.get(`${DOMAIN}/api/client/provinceClient`);
  };

export const postProvince = async (data) => {
    return axios.post(`${DOMAIN}/api/client/province`, data);
  };

export const getClient_type = async () => {
  return axios.get(`${DOMAIN}/api/client/type_client`);
};

export const getClientOne = async (id) => {
  return axios.get(`${DOMAIN}/api/client/clientOne?id_client=${id}`);
};

export const postClient = async (data) => {
  return axios.post(`${DOMAIN}/api/client`, data);
};

export const putClient = async (id,data) => {
  return axios.put(`${DOMAIN}/api/client?id_client=${id}`, data);
};

export const estSupprimeClient = async (id) => {
  return axios.put(`${DOMAIN}/api/client/est_supprime?id=${id}`);
};
