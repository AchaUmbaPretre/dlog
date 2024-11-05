import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getTemplate = async () => {
    return axios.get(`${DOMAIN}/api/template`);
  };

export const getTemplateOne = async (id) => {
    return axios.get(`${DOMAIN}/api/template/one?id_template=${id}`);
  };

export const postTemplate = async (data) => {
    return axios.post(`${DOMAIN}/api/template`, data);
  };


export const getTypeOccupation = async () => {
    return axios.get(`${DOMAIN}/api/template/type_occupation`);
  };

export const getObjetFacture = async () => {
    return axios.get(`${DOMAIN}/api/template/objet_facture`);
  };