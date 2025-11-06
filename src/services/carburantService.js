import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getCarburant = async () => {
    return axios.get(`${DOMAIN}/api/carburant`);
  };
  
export const getCarburantLimitTen = async () => {
    return axios.get(`${DOMAIN}/api/carburant/limit_ten`);
  };

export const getCarburantOne = async (id) => {
    return axios.get(`${DOMAIN}/api/carburant/one?id_vehicule=${id}`);
  };

export const postCarburant = async (data) => {
  return axios.post(`${DOMAIN}/api/carburant`, data);
};