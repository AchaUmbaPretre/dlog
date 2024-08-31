import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getSuivi = async () => {
    return axios.get(`${DOMAIN}/api/suivi`);
  };

export const getSuiviOne = async (id) => {
    return axios.get(`${DOMAIN}/api/suivi/one?id_suivi=${id}`);
  };

export const getSuiviTacheOne = async (id) => {
    return axios.get(`${DOMAIN}/api/suivi/suiviTacheOne?id_tache=${id}`);
  };

export const postSuivi = async (data) => {
  return axios.post(`${DOMAIN}/api/suivi`, data);
};

export const postSuiviTache = async (data) => {
return axios.post(`${DOMAIN}/api/suivi/suiviTache`, data);
};

export const deleteSuivi = async (id) => {
    return axios.delete(`${DOMAIN}/api/suivi/${id}`,);
  };