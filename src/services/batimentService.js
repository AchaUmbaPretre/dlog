import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getEquipement = async () => {
    return axios.get(`${DOMAIN}/api/batiment/equipement`);
  };

export const getEquipementOne = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/one?id_equipement=${id}`);
  };

export const postEquipement = async (data) => {
  return axios.post(`${DOMAIN}/api/batiment`, data);
};