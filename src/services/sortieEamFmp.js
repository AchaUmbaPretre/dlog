import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getSortieEam = async () => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/eam`);
  };
