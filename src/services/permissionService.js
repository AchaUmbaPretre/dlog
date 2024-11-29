import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getMenusAllOne = async (userId) => {
    return axios.get(`${DOMAIN}/api/permission/addOne?userId=${userId}`);
  };


export const getMenusOne = async () => {
    return axios.get(`${DOMAIN}/api/permission/add`);
  };

export const getMenus = async (userId) => {
    return axios.get(`${DOMAIN}/api/permission/one?userId=${userId}`);
  };

export const putPermission = async (userId, optionId,finalPermissions ) => {
    return axios.put(`${DOMAIN}/api/permission/update/${userId}/permissions/add/${optionId}`, finalPermissions)
}

export const getPermissionsTache = async (userId) => {
  return axios.get(`${DOMAIN}/api/permission/permission_tache?id_tache=${userId}`);
};

export const updatePermissionTache = async (data) => {
  return axios.post(`${DOMAIN}/api/permission/permission_tache`, data)
}

export const getPermissionsVille = async (userId) => {
  return axios.get(`${DOMAIN}/api/permission/permission_ville?id_ville=${userId}`);
};

export const updatePermissionVille = async (data) => {
  return axios.post(`${DOMAIN}/api/permission/permission_ville`, data)
}