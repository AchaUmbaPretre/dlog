import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getSortieEam = async () => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/eam`);
};

export const getSortieFmp = async () => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/fmp`);
};

export const getSmr = async () => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/smr`);
};


export const getReconciliation = async (smrIds = []) => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/reconciliation`, {
        params: {
            smr: smrIds
        }
    });
};

export const postDocPhysiqueEam = async (data) => {
    return axios.post(`${DOMAIN}/api/sortieEamFmp/eam_post`, data);
};

export const postDocPhysiqueFmp = async (data) => {
    return axios.post(`${DOMAIN}/api/sortieEamFmp/fmp_post`, data);
};

