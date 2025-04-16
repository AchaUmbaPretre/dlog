import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getCatVehicule = async () => {
    return axios.get(`${DOMAIN}/api/charroi/cat_vehicule`);
  };

export const getMarque = async () => {
    return axios.get(`${DOMAIN}/api/charroi/marque`);
};

export const postMarque = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/marque`, data);
}

export const getModeleAll = async () => {
    return axios.get(`${DOMAIN}/api/charroi/modeleAll`);
};

export const getModele = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/modele?id_marque=${id}`);
};

export const postModele = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/modele`, data);
}

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

//Sites
export const getSite = async () => {
    return axios.get(`${DOMAIN}/api/charroi/site`);
}

export const postSite = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/site`, data);
}

//Affectation
export const getAffectation = async () => {
    return axios.get(`${DOMAIN}/api/charroi/affectation`);
}

export const postAffectation = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/affectation`, data);
}

//Controle technique
export const getControleTechnique = async () => {
    return axios.get(`${DOMAIN}/api/charroi/controle_technique`);
}

export const postControleTechnique = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/controle_technique`, data);
}

//Type de reparation
export const getTypeReparation = async () => {
    return axios.get(`${DOMAIN}/api/charroi/type_reparation`);
}

//Statut véhicule
export const getStatutVehicule = async () => {
    return axios.get(`${DOMAIN}/api/charroi/statut_vehicule`);
}

//Réparation
export const getReparation = async () => {
    return axios.get(`${DOMAIN}/api/charroi/reparation`);
}

export const getReparationOne = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/reparationOne?id_sud_reparation=${id}`);
}

export const postReparation = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/reparation`, data);
}

//Carateristique rep
export const getCarateristiqueRep = async () => {
    return axios.get(`${DOMAIN}/api/charroi/carateristique_rep`);
}

//Inspection gen
export const getInspectionGen = async () => {
    return axios.get(`${DOMAIN}/api/charroi/inspection_gen`);
}

export const postInspectionGen= async (data) => {
    console.log(data)
    return axios.post(`${DOMAIN}/api/charroi/inspection_gen`, data , {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
}

// SUB Inspection
export const getSubInspection = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/sub_inspection_gen?idInspection=${id}`);
}

//Inspection validé
export const getInspectionValide = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/inspection_validation?id_sub_inspection_gen=${id}`);
}
export const postInspectionValide= async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/inspection_validation`, data );
}

//Suivie Inspection
export const getSuiviInspections = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/suivi_inspections?id_sub_inspection_gen=${id}`);
}
export const postSuiviInspections= async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/suivi_inspections`, data );
}