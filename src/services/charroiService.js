import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getCatVehicule = async () => {
    return axios.get(`${DOMAIN}/api/charroi/cat_vehicule`);
  };

export const getMarque = async () => {
    return axios.get(`${DOMAIN}/api/charroi/marque`);
  };

export const getModele = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/modele?id_modele=${id}`);
  };

export const getDisposition = async () => {
    return axios.get(`${DOMAIN}/api/charroi/disposition`);
};

export const getCouleur = async () => {
    return axios.get(`${DOMAIN}/api/charroi/couleur`);
};

export const getTypeCarburant = async () => {
    return axios.get(`${DOMAIN}/api/charroi/type_carburant`);
};

export const getTypePneus = async () => {
    return axios.get(`${DOMAIN}/api/charroi/pneus`);
};
