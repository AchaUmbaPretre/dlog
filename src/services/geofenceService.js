import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getCatGeofence = async () => {
    return axios.get(`${DOMAIN}/api/geofences/cat_geofence`);
};

export const getGeofenceFalcon = async () => {
    return axios.get(`${DOMAIN}/api/get_geofences`);
};