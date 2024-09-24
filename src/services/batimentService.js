import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

//Equipement
export const getEquipement = async () => {
    return axios.get(`${DOMAIN}/api/batiment/equipement`);
  };

export const getEquipementOne = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/equipement/one?id=${id}`);
  };

export const postEquipement = async (data) => {
  return axios.post(`${DOMAIN}/api/batiment/equipement`, data);
};

//Batiment plan
export const getPlans = async () => {
    return axios.get(`${DOMAIN}/api/batiment/plans`);
  };

export const getPlansOne = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/plans/one?id_batiment=${id}`);
  };

export const postPlans = async (data) => {
    return axios.post(`${DOMAIN}/api/batiment/plans`, data);
  };

//Batiment plan
export const getMaintenance = async () => {
    return axios.get(`${DOMAIN}/api/batiment/maintenance`);
  };

export const getMaintenanceOne = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/maintenance/one?id=${id}`);
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

  export const getStatutMaintenance = async () => {
    return axios.get(`${DOMAIN}/api/batiment/statut_maintenance`);
  };
  

  //Stock
export const getStock = async () => {
    return axios.get(`${DOMAIN}/api/batiment/stock`);
  };

export const getStockOne = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/stock/one?id=${id}`);
  };

export const postStock = async (data) => {
  return axios.post(`${DOMAIN}/api/batiment/stock`, data);
};

export const putStock = async (id,data) => {
  return axios.put(`${DOMAIN}/api/batiment/stock?id=${id}`, data);
};