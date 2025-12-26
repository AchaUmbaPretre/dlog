import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getSortieEam = async () => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/eam`);
};

export const getSortieByEam = async (eam, part) => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/by_smr_eam`, {
        params: {
            smr_ref: eam,
            part: part
        }
    });
};

export const putSortieEam = async (data) => {
    return axios.put(`${DOMAIN}/api/sortieEamFmp/put_eam`, data);
};

export const getSortieFmp = async () => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/fmp`);
};

export const getSortieByFmp = async (num_be,smr) => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/by_smr_fmp`, {
        params: {
            sortie_gsm_num_be : num_be,
            smr
        }
    });
};

export const putSortieFmp = async (data) => {
    return axios.put(`${DOMAIN}/api/sortieEamFmp/put_fmp`, data);
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

