import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;


export const getMenusOne = async () => {
    return axios.get(`${DOMAIN}/api/permission/addOne`);
  };

export const getMenus = async (userId) => {
    return axios.get(`${DOMAIN}/api/permission/One?userId=${userId}`);
  };

export const putPermission = async (userId, optionId,finalPermissions ) => {
    return axios.put(`${DOMAIN}/api/permission/update/${userId}/permissions/add/${optionId}`, finalPermissions)
}