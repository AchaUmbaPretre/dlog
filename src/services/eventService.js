import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getEvent = async () => {
    return axios.get(`${DOMAIN}/api/event`);
};

export const getEventRow = async (params) => {
  return axios.get(`${DOMAIN}/api/event/raw_report`, { params });
};

export const postEvent = async (data) => {
  return axios.post(`${DOMAIN}/api/event`, data);
};