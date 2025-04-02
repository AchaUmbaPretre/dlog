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

//Categorie
export const getCatRapport = async () => {
    return axios.get(`${DOMAIN}/api/rapport/cat_rapport`);
  };

//Parametre
export const getParametre = async () => {
    return axios.get(`${DOMAIN}/api/rapport/contrat_parametre`);
  };

export const getParametreOne = async () => {
    return axios.get(`${DOMAIN}/api/rapport/contrat_parametre/one`);
  };

export const getParametreContratCat = async () => {
    return axios.get(`${DOMAIN}/api/rapport/contrat_parametreContratCat`);
  };

export const postParametre = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport/contrat_parametre`, data)
}

//Element contrat
export const getElementContrat = async () => {
    return axios.get(`${DOMAIN}/api/rapport/element_contrat`);
  };

export const postElementContrat  = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport/element_contrat`, data)
}

//Etiquette
export const getEtiquette = async () => {
    return axios.get(`${DOMAIN}/api/rapport/etiquette`);
  };

export const postEtiquette  = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport/etiquette`, data)
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

export const postClotureSimple = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport/cloture_simple`, data)
}