import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getCarburantVehicule = async () => {
    return axios.get(`${DOMAIN}/api/carburant/vehicule_carburant`);
};

export const postCarburantVehicule = async (data) => {
  return axios.post(`${DOMAIN}/api/carburant/vehicule_carburant`, data);
};

export const putRelierCarburantVehicule = async (id, data) => {
    return axios.put(`${DOMAIN}/api/carburant/relier_vehiculeCarburant?id_vehicule=${id}`, data);
};

export const getTypeCarburant = async () => {
    return axios.get(`${DOMAIN}/api/carburant/type_carburant`);
  };
  
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

export const getCarburantPrice = async () => {
  return axios.get(`${DOMAIN}/api/carburant/carburant_prix`);
};

export const getCarburantPriceLimit = async () => {
  return axios.get(`${DOMAIN}/api/carburant/carburant_prix_limit`);
};

export const postCarburantPrice = async (data) => {
  return axios.post(`${DOMAIN}/api/carburant/carburant_prix`, data);
};

//Rapport
export const getRapportCarburant = async (date_debut, date_fin) => {
  return axios.get(`${DOMAIN}/api/carburant/rapport_carburant`, {
    params: {
      date_debut,
      date_fin
    }
  });
};

export const getRapportConsomGen = async (period) => {
  return axios.get(`${DOMAIN}/api/carburant/rapport_consom_gen`, {
    params: {
      period
    }
  });
};