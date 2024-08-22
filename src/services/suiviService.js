import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getSuivi = async () => {
    return axios.get(`${DOMAIN}/api/suivi`);
  };


export const getSuiviOne = async (id) => {
    return axios.get(`${DOMAIN}/api/suivi?id_suivi=${id}`);
  };

export const postSuivi = async (data) => {
    console.log(data)
  return axios.post(`${DOMAIN}/api/suivi`, data);
};

export const deleteSuivi = async (id) => {
    return axios.delete(`${DOMAIN}/api/suivi/${id}`,);
  };