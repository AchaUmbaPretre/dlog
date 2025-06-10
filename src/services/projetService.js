import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
export const getProjetCount = async () => {
  return axios.get(`${DOMAIN}/api/projet/count`);
};

export const getProjet = async (role, userId) => {
  return axios.get(`${DOMAIN}/api/projet?role${role}&userId=${userId}`);
};

export const getProjetOneF = async (id) => {
  return axios.get(`${DOMAIN}/api/projet/oneF?id_projet=${id}`);
};

export const getProjetOne = async (id) => {
  return axios.get(`${DOMAIN}/api/projet/one?id_projet=${id}`);
};

//Doc 
export const getProjetDoc = async () => {
    return axios.get(`${DOMAIN}/api/projet/projet_doc`);
  };

export const getProjetMoko = async (id) => {
    return axios.get(`${DOMAIN}/api/projet/projet_doc/one?id_document=${id}`);
  };

export const getProjetDocOne = async (id) => {
  return axios.get(`${DOMAIN}/api/projet/detail_projet_doc?id_projet=${id}`);
};

export const postProjetDoc = async (data) => {
  return axios.post(`${DOMAIN}/api/projet/projet_doc`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const putProjetDoc = async (id, data) => {
  return axios.put(`${DOMAIN}/api/projet/projet_doc?id_document=${id}`, data,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getProjetTacheOne = async (id) => {
    return axios.get(`${DOMAIN}/api/projet/projetTache?id_projet=${id}`);
  };

export const postProjet = async (data) => {
  return axios.post(`${DOMAIN}/api/projet`, data);
};

export const deletePutProjet = async (id) => {
    return axios.put(`${DOMAIN}/api/projet/est_supprime?id_projet=${id}`);
  };

export const putProjet = async (id, data) => {
    return axios.put(`${DOMAIN}/api/projet?id_projet=${id}`, data);
  };

export const putProjetBesoin = async (id, data) => {
    return axios.put(`${DOMAIN}/api/projet/projet_besoin?id_besoin=${id}`, data);
  };