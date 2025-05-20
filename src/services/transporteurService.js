import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getLocalisation = async() => {
    return axios.get(`${DOMAIN}/api/transporteur/localisation`)
}

export const getLocalisationOne = async(id) => {
    return axios.get(`${DOMAIN}/api/transporteur/localisation/one?id_localisation=${id}`)
}

export const postLocalisation = async(data) => {
    return axios.post(`${DOMAIN}/api/transporteur/localisation`, data)
}

export const putLocalisation = async(data) => {
    return axios.put(`${DOMAIN}/api/transporteur/localisation`, data)
}

export const getTypeLocalisation = async() => {
    return axios.get(`${DOMAIN}/api/transporteur/type_localisation`)
}

export const getCommune = async() => {
    return axios.get(`${DOMAIN}/api/transporteur/commune`)
}

export const getVille = async() => {
    return axios.get(`${DOMAIN}/api/transporteur/ville`)
}

export const getLocalite = async() => {
    return axios.get(`${DOMAIN}/api/transporteur/localite`)
}
export const postLocalite = async (data) => {
    return axios.post(`${DOMAIN}/api/transporteur/localite`, data)
}

export const getSiteLoc = async() => {
    return axios.get(`${DOMAIN}/api/transporteur/site_loc`)
}

export const getPays = async() => {
    return axios.get(`${DOMAIN}/api/transporteur/pays`)
}