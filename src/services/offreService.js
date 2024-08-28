import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getOffre = async () => {
    return axios.get(`${DOMAIN}/api/offre`);
  };

export const getDetailDoc = async (id) => {
    return axios.get(`${DOMAIN}/api/offre/detailOffre?id_offre=${id}`);
  };

export const getOffreDetail = async (id) => {
    return axios.get(`${DOMAIN}/api/offre/detail?id_offre=${id}`);
  };

export const postOffre = async (data) => {
  return axios.post(`${DOMAIN}/api/offre`, data,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


export const postOffreDoc = async (data) => {
    return axios.post(`${DOMAIN}/api/offre/doc`, data);
  };
  

export const postOffreArticle = async (data) => {
    return axios.post(`${DOMAIN}/api/offre/article`, data);
  };


export const deleteOffre = async (id) => {
    return axios.delete(`${DOMAIN}/api/offre/${id}`);
  };