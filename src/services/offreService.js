import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getOffre = async () => {
    return axios.get(`${DOMAIN}/api/offre`);
  };

  export const getOffreDoc = async () => {
    return axios.get(`${DOMAIN}/api/offre/offre_doc`);
  };

  export const getOffreArticleOne = async (id) => {
    return axios.get(`${DOMAIN}/api/offre/one_offre?id_offre=${id}`);
  };

export const getDetailDoc = async (id) => {
    return axios.get(`${DOMAIN}/api/offre/detailOffre?id_offre=${id}`);
  };

export const getOffreDetail = async (id) => {
    return axios.get(`${DOMAIN}/api/offre/detail?id_offre=${id}`);
  };

export const postOffre = async (data) => {
  return axios.post(`${DOMAIN}/api/offre`, data);
};


export const postOffreDoc = async (data) => {
    return axios.post(`${DOMAIN}/api/offre/doc`, data);
  };
  
export const postArticle = async (data) => {
    return axios.post(`${DOMAIN}/api/offre/articles`, data);
  };

  export const postArticleExcel = async (data) => {
    console.log(data)
    return axios.post(`${DOMAIN}/api/offre/article_excel`, data,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

export const postOffreArticle = async (data) => {
    return axios.post(`${DOMAIN}/api/offre/article`, data);
  };

export const estSupprimeOffre = async (id) => {
    return axios.put(`${DOMAIN}/api/offre/est_supprime?id=${id}`);
  };

export const deleteOffre = async (id) => {
    return axios.delete(`${DOMAIN}/api/offre/${id}`);
  };