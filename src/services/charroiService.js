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
    return axios.get(`${DOMAIN}/api/charroi/modele?id_marque=${id}`);
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

export const getLubrifiant = async () => {
    return axios.get(`${DOMAIN}/api/charroi/lubrifiant`);
};

//Vehicule
export const getVehiculeCount = async () => {
    return axios.get(`${DOMAIN}/api/charroi/vehicule_count`);
}

export const getVehicule = async () => {
    return axios.get(`${DOMAIN}/api/charroi/vehicule`);
}

export const getVehiculeOne = async () => {
    return axios.get(`${DOMAIN}/api/charroi/vehicule/one`);
}

export const postVehicule = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/vehicule`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
}

export const putVehicule = async (id, data) => {
    return axios.put(`${DOMAIN}/api/charroi/vehicule?id_vehicule=${id}`, data);
}


export const getPermis = async () => {
    return axios.get(`${DOMAIN}/api/charroi/permis`);
};

export const getSexe = async () => {
    return axios.get(`${DOMAIN}/api/charroi/sexe`);
};

export const getTypeFonction = async () => {
    return axios.get(`${DOMAIN}/api/charroi/type_fonction`);
};

//Chauffeur
export const getChauffeur = async () => {
    return axios.get(`${DOMAIN}/api/charroi/chauffeur`);
}

export const postChauffeur = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/chauffeur`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    } );
}