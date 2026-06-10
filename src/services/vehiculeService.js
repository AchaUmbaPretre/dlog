import axios from 'axios';
import config from '../config';
import { userRequest } from '../requestMethods';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getVehiculeCount = async () => {
    return axios.get(`${DOMAIN}/api/vehicule/vehicule_count`);
}

export const getVehicule = async () => {
    return userRequest.get(`${DOMAIN}/api/vehicule`);
}

export const getVehiculeDispo = async () => {
    return axios.get(`${DOMAIN}/api/vehicule/vehicule_dispo`);
}

export const getVehiculeOccupe = async () => {
    return axios.get(`${DOMAIN}/api/vehicule/vehicule_occupe`);
}

export const rendreVehiculeDispo = async (id) => {
    return axios.put(`${DOMAIN}/api/vehicule/rend_dispo`, null, {
        params: {
            id_vehicule: id
        }
    });
};

export const getVehiculeOne = async (id) => {
    return axios.get(`${DOMAIN}/api/vehicule/one?id_vehicule=${id}`);
}

export const postVehicule = async (data) => {
    return userRequest.post(`${DOMAIN}/api/vehicule`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
}

export const putVehicule = async (id, data) => {
    return userRequest.put(`${DOMAIN}/api/vehicule?id_vehicule=${id}`, data);
}

export const putVehiculeSupprime = async (id) => {
    return axios.put(`${DOMAIN}/api/vehicule/vehicule_estSupprime?id_vehicule=${id}`);
}

export const putRelierVehiculeFalcon = async (id, data) => {
    return axios.put(`${DOMAIN}/api/vehicule/vehicule_falcon?id_vehicule=${id}`, data);
}