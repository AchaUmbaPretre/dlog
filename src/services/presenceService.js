import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getPresence = async () => {
  return axios.get(`${DOMAIN}/api/presence`);
};

export const getPresencePlanning = async (dateRange) => {
  return axios.get(`${DOMAIN}/api/presence/planning`, {
    params: dateRange ?? {}
  });
};


export const getPresenceRapport = async (dateRange) => {
  return axios.get(`${DOMAIN}/api/presence/month`, {
    params: dateRange ?? {}
  });
};

export const getPresenceRetardPonctualite = async (dateRange) => {
  if (!dateRange || dateRange.length !== 2) {
    return axios.get(`${DOMAIN}/api/presence/lateEarly`);
  }

  return axios.get(`${DOMAIN}/api/presence/lateEarly`, {
    params: {
      startDate: dateRange[0].format("YYYY-MM-DD"),
      endDate: dateRange[1].format("YYYY-MM-DD")
    }
  });
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