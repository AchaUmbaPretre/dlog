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
    return axios.get(`${DOMAIN}/api/user/signature?id_user=${id}`);
  };


export const postSignature = async (data) => {
  return axios.post(`${DOMAIN}/api/user/signature`, data);
};