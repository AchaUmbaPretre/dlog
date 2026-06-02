import axios from 'axios';
import config from '../config';
import { userRequest } from '../requestMethods';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

//Type de reparation
export const getTypeReparation = async () => {
    return axios.get(`${DOMAIN}/api/reparation/type_reparation`);
}

export const postTypeReparation = async (data) => {
    return axios.post(`${DOMAIN}/api/reparation/type_reparation`, data);
}

//Controle technique
export const getControleTechnique = async () => {
    return userRequest.get(`${DOMAIN}/api/reparation/controle_technique`);
}

export const postControleTechnique = async (data) => {
    return userRequest.post(`${DOMAIN}/api/reparation/controle_technique`, data);
}

//Réparation
export const getReparation = async () => {
    return userRequest.get(`${DOMAIN}/api/reparation`);
}

export const getReparationOneV = async (id) => {
    return axios.get(`${DOMAIN}/api/reparation/reparationOneV?id_sud_reparation=${id}`);
}

export const getReparationOne = async (id, inspectionId) => {
    return axios.get(`${DOMAIN}/api/reparation/reparationOne?id_sud_reparation=${id}&id_inspection_gen=${inspectionId}`);
}

export const postReparation = async (data) => {
    return userRequest.post(`${DOMAIN}/api/reparation`, data);
}

export const deleteReparation= async (data) => {
    return userRequest.post(`${DOMAIN}/api/reparation/delete_reparation`, data );
}

export const putReparation = async ({ id_sud_reparation, id_reparation, formData }) => {
    try {
      return await axios.put(
        `${DOMAIN}/api/reparation`,
        formData,
        {
          params: {
            id_sud_reparation,
            id_reparation
          }
        }
      );
    } catch (error) {
      console.error("Erreur dans putReparation:", error);
      throw error;
    }
  };

//Réparation Image
export const getReparationImage = async (id_reparation, id_inspection_gen ) => {
    return userRequest.get(`${DOMAIN}/api/reparation/reparation_image?id_reparation=${id_reparation}&id_inspection_gen=${id_inspection_gen}`);
};

export const postReparationImage = async (data) => {
    return userRequest.post(`${DOMAIN}/api/reparation/reparation_image`, data , {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
};

//Suivi reparation
export const getSuiviReparation= async (id, inspectionId) => {
    return userRequest.get(`${DOMAIN}/api/reparation/suivi_reparation?id_reparation=${id}&id_inspection_gen=${inspectionId}`);
};

export const getSuiviReparationOne = async (id) => {
    return userRequest.get(`${DOMAIN}/api/reparation/suivi_reparationOne?id_sud_reparation=${id}`);
};

export const postSuiviReparation= async (data) => {
    return userRequest.post(`${DOMAIN}/api/reparation/suivi_reparation`, data );
};

export const putSuiviReparation= async (id, data) => {
    return axios.put(`${DOMAIN}/api/reparation/suivi_reparation?id_suivi_reparation=${id}`, data);
};

//Document reparation
export const getDocumentReparation = async (id) => {
    return userRequest.get(`${DOMAIN}/api/reparation/document_reparation?id_sud_reparation=${id}`);
}

export const postDocumentReparation = async (data) => {
    return userRequest.post(`${DOMAIN}/api/raparation/document_reparation`, data , {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
}