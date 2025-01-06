import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getTemplateCount = async () => {
  return axios.get(`${DOMAIN}/api/template/count`);
};

export const getTemplate = async () => {
    return axios.get(`${DOMAIN}/api/template`);
  };

export const getTemplate5derniers = async (id, periode, idProvince) => {
    return axios.get(`${DOMAIN}/api/template/5derniers?id_client=${id}&periode=${periode}&idProvince=${idProvince}`);
  };

export const getTemplateDeuxMoisPrecedent = async (id, idProvince) => {
    return axios.get(`${DOMAIN}/api/template/2mois_precedents?id_client=${id}&idProvince=${idProvince}`);
  };

export const putTemplateStatus = async (id, data) => {
    return axios.put(`${DOMAIN}/api/template/statut?id_template=${id}`, {
      status_template : data
    });
  };

export const getTemplateOne = async (id) => {
    return axios.get(`${DOMAIN}/api/template/one?id_template=${id}`);
  };

export const postTemplate = async (data) => {
    return axios.post(`${DOMAIN}/api/template`, data);
  };

export const deletePutTemplate = async (id) => {
    return axios.put(`${DOMAIN}/api/template/template_update_delete?id=${id}`);
  };

export const putTemplate = async (id,data) => {
    return axios.put(`${DOMAIN}/api/template/template_update?id_template=${id}`, data);
  };

export const getTypeOccupation = async () => {
    return axios.get(`${DOMAIN}/api/template/type_occupation`);
  };

export const getObjetFacture = async () => {
    return axios.get(`${DOMAIN}/api/template/objet_facture`);
  };

//Déclaration superficie
export const getDeclarationCount = async () => {
    return axios.get(`${DOMAIN}/api/template/declaration_count`);
  };

export const getDeclaration = async (data) => {
    return axios.post(`${DOMAIN}/api/template/declaration_superficies`, data);
  };

export const getDeclarationOne = async (id) => {
    return axios.get(`${DOMAIN}/api/template/declaration_superficie/one?id=${id}`);
  };

export const getDeclarationOneClient = async (id) => {
    return axios.get(`${DOMAIN}/api/template/declaration_superficie/oneClient?id_client=${id}`);
  };

export const postDeclaration = async (data) => {
    return axios.post(`${DOMAIN}/api/template/declaration_superficie`, data);
  };

export const putDeclaration = async (id,data) => {
    return axios.put(`${DOMAIN}/api/template/declaration_superficie?id_declaration=${id}`, data);
  };

export const deletePutDeclaration = async (id) => {
    return axios.put(`${DOMAIN}/api/template/declaration_superficie_delete?id=${id}`);
  };