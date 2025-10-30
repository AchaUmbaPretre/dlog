import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getCatGeofence = async () => {
    return axios.get(`${DOMAIN}/api/geofences/cat_geofence`);
};

export const getGeofenceDlog = async () => {
    return axios.get(`${DOMAIN}/api/geofences`);
};

export const getGeofenceDlogOne = async (id) => {
    return axios.get(`${DOMAIN}/api/geofences/one`, {params: id});
};

export const getGeofenceFalcon = async () => {
    return axios.get(`${DOMAIN}/api/geofences/get_geofence_falcon`);
};

export const postGeofenceDlog = async (data) => {
    return axios.post(`${DOMAIN}/api/geofences`, data);
};