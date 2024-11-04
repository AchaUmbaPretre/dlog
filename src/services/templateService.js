import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getTemplate = async () => {
    return axios.get(`${DOMAIN}/api/template`);
  };





export const getTypeOccupation = async () => {
    return axios.get(`${DOMAIN}/api/template/type_occupation`);
  };