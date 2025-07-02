// src/services/authService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getUser = async (user) => {
    return axios.get(`${DOMAIN}/api/user`);
  };

export const getUserOne = async (id) => {
    return axios.get(`${DOMAIN}/api/user/one?id_user=${id}`);
  };


export const postUser = async (data) => {
  return axios.post(`${DOMAIN}/api/user`, data);
};

export const putUser = async (id, data) => {
  return axios.put(`${DOMAIN}/api/user?id=${id}`, data);
};

export const putUserOne = async (id, data) => {
  return axios.put(`${DOMAIN}/api/user/one?id=${id}`, data);
};

//Signature
export const getSignature = async (id) => {
    return axios.get(`${DOMAIN}/api/user/signature?userId=${id}`);
  };

export const postSignature = async (data) => {
  return axios.post(`${DOMAIN}/api/user/signature`, data);
};

//SOCIETE
export const getSociete = async (id) => {
  return axios.get(`${DOMAIN}/api/user/societe`);
};

export const postSociete = async (data) => {
  return axios.post(`${DOMAIN}/api/user/societe`, data);
};

//Personnel
export const getPersonne = async (user) => {
  return axios.get(`${DOMAIN}/api/user/personnel`);
};

export const postPersonnel = async (data) => {
  return axios.post(`${DOMAIN}/api/user/personnel`, data);
};

//Visiteur pieton
export const getPieton = async (user) => {
  return axios.get(`${DOMAIN}/api/user/pieton`);
};

export const postPieton = async (data) => {
  return axios.post(`${DOMAIN}/api/user/pieton`, data);
};