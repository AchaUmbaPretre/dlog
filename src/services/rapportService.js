import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getRapport = async () => {
    return axios.get(`${DOMAIN}/api/rapport`);
  };

export const getRapportOne = async (id) => {
    return axios.get(`${DOMAIN}/api/rapport/one?rapport=${id}`);
  };

export const postRapport = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport`, data)
}

export const getContratRapport = async () => {
    return axios.get(`${DOMAIN}/api/rapport/contrat_rapport`);
  };

export const postContratRapport = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport/contrat_rapport`, data)
}

export const getDeclarationTemplate = async (id, idProvince) => {
    return axios.get(`${DOMAIN}/api/rapport/declarationTemplate?id_template=${id}&id_province=${idProvince}`);
  };

export const getCloture = async () => {
    return axios.get(`${DOMAIN}/api/rapport/cloture`);
  };

export const postCloture = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport/cloture`, data)
}