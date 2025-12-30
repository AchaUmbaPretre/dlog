import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getSortieEam = async (data) => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/eam`, {
        params: {
            data
        }
    });
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

export const getSortieFmp = async (data) => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/fmp`, {
        params:{
            data
        }
    });
};

export const getSortieByFmp = async (item_code,smr) => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/by_smr_fmp`, {
        params: {
            item_code,
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

export const getPartItem = async () => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/part_item`);
};

export const getReconciliation = async (data) => {
    return axios.get(`${DOMAIN}/api/sortieEamFmp/reconciliation`, {
        params: {
            data
        }
    });
};

export const postDocPhysiqueEam = async (data) => {
    return axios.post(`${DOMAIN}/api/sortieEamFmp/eam_post`, data);
};

export const postDocPhysiqueFmp = async (data) => {
    return axios.post(`${DOMAIN}/api/sortieEamFmp/fmp_post`, data);
};

