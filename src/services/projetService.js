import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getProjet = async () => {
    return axios.get(`${DOMAIN}/api/projet`);
  };

export const getProjetOneF = async (id) => {
    return axios.get(`${DOMAIN}/api/projet/oneF?id_projet=${id}`);
  };

export const getProjetOne = async (id) => {
    return axios.get(`${DOMAIN}/api/projet/one?id_projet=${id}`);
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