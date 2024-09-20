import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

//Equipement
export const getEquipement = async () => {
    return axios.get(`${DOMAIN}/api/batiment/equipement`);
  };

export const getEquipementOne = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/equipement/one?id_equipement=${id}`);
  };

export const postEquipement = async (data) => {
  return axios.post(`${DOMAIN}/api/batiment/equipement`, data);
};

//Batiment plan

export const getPlans = async () => {
    return axios.get(`${DOMAIN}/api/batiment/plans`);
  };

export const postPlans = async (data) => {
    return axios.post(`${DOMAIN}/api/batiment/plans`, data);
  };

//Batiment plan
export const getMaintenance = async () => {
    return axios.get(`${DOMAIN}/api/batiment/maintenance`);
  };

export const postMaintenance = async (data) => {
    return axios.post(`${DOMAIN}/api/batiment/maintenance`, data);
  };

//

export const getTypeEquipement = async () => {
    return axios.get(`${DOMAIN}/api/batiment/type_equipement`);
  };
  
export const getStatutEquipement = async () => {
    return axios.get(`${DOMAIN}/api/batiment/statut_equipement`);
  };
  