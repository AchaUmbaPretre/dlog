import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getTypes = async () => {
    return axios.get(`${DOMAIN}/api/types`);
  };

export const getArticle = async () => {
    return axios.get(`${DOMAIN}/api/types/article`);
  };

export const getArticleOne = async (idArt, idFour) => {
    return axios.get(`${DOMAIN}/api/types/articleOne?id_article=${idArt}&id_fournisseur=${idFour}`);
  };


  export const getBatiment = async () => {
    return axios.get(`${DOMAIN}/api/types/batiment`);
  };

  export const getBatimentOne = async (id) => {
    return axios.get(`${DOMAIN}/api/types/batiment/one?id=${id}`);
  };

  export const postBatiment = async (data) => {
    return axios.post(`${DOMAIN}/api/types/batiment`, data);
  };

  //Categorie
  export const getCategorie = async () => {
    return axios.get(`${DOMAIN}/api/types/categorie`);
  };

  export const postCategorie = async (data) => {
    return axios.post(`${DOMAIN}/api/types/categorie`, data);
  };

  //Activité
  export const getActivite = async () => {
    return axios.get(`${DOMAIN}/api/types/activite`);
  };

  export const postActivite = async (data) => {
    return axios.post(`${DOMAIN}/api/types/activite`, data);
  };