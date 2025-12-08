// src/services/generateurService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

//type generateur
export const getTypeGenerateur = async () => {
  return axios.get(`${DOMAIN}/api/generateur/type_generateur`);
};

export const postTypeGenerateur = async (data) => {
  return axios.post(`${DOMAIN}/api/generateur/type_generateur`, data);
};

export const getMarqueGenerateur  = async () => {
  return axios.get(`${DOMAIN}/api/generateur/marque_generateur`);
};

export const postMarqueGenerateur = async (data) => {
  return axios.post(`${DOMAIN}/api/generateur/marque_generateur`, data);
};

export const getModeleGenerateur  = async () => {
  return axios.get(`${DOMAIN}/api/generateur/modele_generateur`);
};

export const getModeleGenerateurOne  = async (id) => {
  return axios.get(`${DOMAIN}/api/generateur/modele_generateur/one`,{
    params: {
      id_marque_generateur: id
    }
  });
};

export const postModeleGenerateur = async (data) => {
  return axios.post(`${DOMAIN}/api/generateur/modele_generateur`, data);
};

export const getRefroidissement  = async () => {
  return axios.get(`${DOMAIN}/api/generateur/refroidissement`);
};

export const getGenerateur = async (user) => {
    return axios.get(`${DOMAIN}/api/generateur`);
  };

export const getGenerateurOne= async (id) => {
    return axios.get(`${DOMAIN}/api/generateur/one?id_generateur=${id}`);
  };

export const postGenerateur = async (data) => {
  return axios.post(`${DOMAIN}/api/generateur`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
};

export const putGenerateur = async (data) => {
  return axios.put(`${DOMAIN}/api/generateur`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
};

//Relier un générateur à un fichier excel
export const putRelierGenerateurFichier = async (id, data) => {
    return axios.put(`${DOMAIN}/api/generateur/relier_generateur?id_generateur=${id}`, data);
};

//Plein generateur
export const getPleinGenerateur  = async () => {
  return axios.get(`${DOMAIN}/api/generateur/plein_generateur`);
};

export const getPleinGenerateurLimit  = async () => {
  return axios.get(`${DOMAIN}/api/generateur/plein_generateur_ten`);
};

export const getPleinGenerateurOne  = async (id) => {
  return axios.get(`${DOMAIN}/api/generateur/plein_generateur/one`,{
    params: {
      id_plein_generateur: id
    }
  });
};

export const postPleinGenerateur = async (data) => {
  return axios.post(`${DOMAIN}/api/generateur/plein_generateur`, data);
};

export const putPleinGenerateur =  async(data) => {
  return axios.put(`${DOMAIN}/api/generateur/plein_generateur`, data)
}

export const deletePleinGenerateur =  async(id) => {
  return axios.put(`${DOMAIN}/api/generateur/plein_generateur/sup?id_plein_generateur=${id}`)
}