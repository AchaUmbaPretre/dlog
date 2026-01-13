import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getPresence = async () => {
  return axios.get(`${DOMAIN}/api/presence`);
};

export const getPresencePlanning = async () => {
  return axios.get(`${DOMAIN}/api/presence/planning?mois=2026-01`);
};

export const getPresenceById = async () => {
  return axios.get(`${DOMAIN}/api/presence/presenceById`);
};

export const postPresence = async (data) => {
  return axios.post(`${DOMAIN}/api/presence`, data);
};


//Congé
export const getConge = async () => {
  return axios.get(`${DOMAIN}/api/presence/conge`);
};

export const postConge = async (data) => {
  return axios.post(`${DOMAIN}/api/presence/conge`, data);
};