import axios from 'axios';
import config from '../config';
const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getEvent = async () => {
  return axios.get(`${DOMAIN}/api/event`);
};

export const getEventRapportDay = async (params) => {
  return axios.get(`${DOMAIN}/api/event/rapport_day`);
};

export const getEventRow = async (params) => {
  return axios.get(`${DOMAIN}/api/event/raw_report`, { params });
};

export const postEvent = async (data) => {
  return axios.post(`${DOMAIN}/api/event`, data);
};

export const getDevices = async(params) => {
  return axios.get(`${DOMAIN}/api/event/device`, { params });
}