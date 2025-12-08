import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getCarburantVehicule = async () => {
  return axios.get(`${DOMAIN}/api/carburant/vehicule_carburant`);
};

export const getCarburantVehiculeOne = async (id_vehicule_carburant) => {
  return axios.get(`${DOMAIN}/api/carburant/vehicule_carburantOne`, {
    params:{
      id_vehicule_carburant
    }
  });
};

export const postCarburantVehicule = async (data) => {
  return axios.post(`${DOMAIN}/api/carburant/vehicule_carburant`, data);
};

export const putCarburantVehicule = async (id_vehicule_carburant, data) => {
    return axios.put(`${DOMAIN}/api/carburant/vehicule_carburant?id_vehicule_carburant=${id_vehicule_carburant}`, data);
};

export const putRelierCarburantVehicule = async (id, data) => {
    return axios.put(`${DOMAIN}/api/carburant/relier_vehiculeCarburant?id_vehicule=${id}`, data);
};
  
export const getCarburant = async (data) => {
  return axios.post(`${DOMAIN}/api/carburant`, data);
};

export const getCarburantLimitThree = async (id_vehicule) => {
    return axios.get(`${DOMAIN}/api/carburant/limit_three?id_vehicule=${id_vehicule}`);
  };

export const getCarburantLimitTen = async (id_vehicule) => {
    return axios.get(`${DOMAIN}/api/carburant/limit_ten?id_vehicule=${id_vehicule}`);
  };

export const getCarburantOne = async (id_vehicule, id_carburant) => {
    return axios.get(`${DOMAIN}/api/carburant/one`, {
      params:{
      id_vehicule, 
      id_carburant
    }});
  };

export const postCarburant = async (data) => {
  return axios.post(`${DOMAIN}/api/carburant/post_carburant`, data);
};

export const putCarburant = async (data) => {
  return axios.put(`${DOMAIN}/api/carburant`, data);
};

export const deleteCarburant = async (id) => {
  return axios.put(`${DOMAIN}/api/carburant/delete?id_carburant=${id}`);
};

//Prix carburant
export const getCarburantPrice = async () => {
  return axios.get(`${DOMAIN}/api/carburant/carburant_prix`);
};

export const getCarburantPriceLimit = async (id) => {
  return axios.get(`${DOMAIN}/api/carburant/carburant_prix_limit`, {
    params: {
      id_type_carburant: id
    }
  });
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

export const getRapportCatPeriode = async (
  month,
  id_vehicule,
  id_site,
  cat,
  date_start,
  date_end
) => {
  return axios.get(`${DOMAIN}/api/carburant/rapport_periode_cat`, {
    params: {
      month,
      id_vehicule,
      id_site,
      cat,
      date_start,
      date_end,
    },
  });
};

export const getRapportVehiculePeriode = async (filter) => {
  return axios.post(`${DOMAIN}/api/carburant/rapport_periode_vehicule`, filter);
};

export const getMoisCarburant = async (annee) => {
  return axios.get(`${DOMAIN}/api/carburant/mois?annee=${annee}`);
};

export const getAnneeCarburant = async () => {
  return axios.get(`${DOMAIN}/api/carburant/annee`);
};

export const getRapportCarbMonth = async (filter) => {
  return axios.post(`${DOMAIN}/api/carburant/rapport_Carburant_Month`, filter);
};