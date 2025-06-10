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

export const putPermission = async (userId, optionId, submenuId, finalPermissions ) => {
    return axios.put(`${DOMAIN}/api/permission/update/${userId}/permissions/add/${optionId}?submenuId=${submenuId}`, finalPermissions)
}

export const getPermissionsTache = async (userId) => {
  return axios.get(`${DOMAIN}/api/permission/permission_tache?id_tache=${userId}`);
};

export const updatePermissionTache = async (data) => {
  return axios.post(`${DOMAIN}/api/permission/permission_tache`, data)
}

//Permission ville
export const getPermissionsVille = async (userId) => {
  return axios.get(`${DOMAIN}/api/permission/permission_ville?id_user=${userId}`);
};

export const getPermissionsDepartement = async (userId) => {
  return axios.get(`${DOMAIN}/api/permission/permission_departement?id_user=${userId}`);
};

export const updatePermissionVille = async (data) => {
  return axios.post(`${DOMAIN}/api/permission/permission_ville`, data)
}

//Permission departement
export const getPermissionsDepart = async (userId) => {
  return axios.get(`${DOMAIN}/api/permission/permission_departement?id_departement=${userId}`);
};

export const updatePermissionDepart = async (data) => {
  return axios.post(`${DOMAIN}/api/permission/permission_departement`, data)
}

//Permission ville declaration
export const getPermissionsVilleDeclaration= async (userId) => {
  return axios.get(`${DOMAIN}/api/permission/permission_declaration_ville?id_ville=${userId}`);
};

export const updatePermissionVilleDeclaration = async (data) => {
  return axios.post(`${DOMAIN}/api/permission/permission_declaration_ville`, data)
}

//Permission client declaration
export const getPermissionsClientDeclaration= async (userId) => {
  return axios.get(`${DOMAIN}/api/permission/permission_declaration_client?id_client=${userId}`);
};

export const updatePermissionClientDeclaration = async (data) => {
  return axios.post(`${DOMAIN}/api/permission/permission_declaration_client`, data)
}

//Permission declaration
export const getPermissionsDeclaration = async (userId) => {
  return axios.get(`${DOMAIN}/api/permission/permission_declaration?userId=${userId}`);
};

export const updatePermissionDeclaration = async (data) => {
  return axios.post(`${DOMAIN}/api/permission/permission_declaration`, data)
};

//Permission projet
export const getPermissionsProjet = async (userId) => {
  return axios.get(`${DOMAIN}/api/permission/permission_projet?userId=${userId}`);
};

export const updatePermissionProjet = async (data) => {
  return axios.post(`${DOMAIN}/api/permission/permission_projet`, data)
};