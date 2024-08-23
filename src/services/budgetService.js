import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getBudget = async () => {
    return axios.get(`${DOMAIN}/api/budget`);
  };


export const getBudgetOne = async (id) => {
    return axios.get(`${DOMAIN}/api/budget/one?id_budget=${id}`);
  };

export const postBudget = async (data) => {
  return axios.post(`${DOMAIN}/api/budget`, data);
};

export const putBudget = async (id, data) => {
    return axios.put(`${DOMAIN}/api/budget`, {
        id_budget: id,
        ...data
      });
  };

export const deleteBudget = async (id) => {
    return axios.delete(`${DOMAIN}/api/budget/${id}`);
  };