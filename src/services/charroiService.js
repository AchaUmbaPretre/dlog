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

export const getVehiculeOne = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/vehicule/one?id_vehicule=${id}`);
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

export const putVehiculeSupprime = async (id) => {
    return axios.put(`${DOMAIN}/api/charroi/vehicule_estSupprime?id_vehicule=${id}`);
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


export const postTypeReparation = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/type_reparation`, data);
}

//Statut véhicule
export const getStatutVehicule = async () => {
    return axios.get(`${DOMAIN}/api/charroi/statut_vehicule`);
}

//Réparation
export const getReparation = async () => {
    return axios.get(`${DOMAIN}/api/charroi/reparation`);
}

export const getReparationOneV = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/reparationOneV?id_sud_reparation=${id}`);
}

export const getReparationOne = async (id, inspectionId) => {
    return axios.get(`${DOMAIN}/api/charroi/reparationOne?id_sud_reparation=${id}&id_inspection_gen=${inspectionId}`);
}

export const postReparation = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/reparation`, data);
}

export const deleteReparation= async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/delete_reparation`, data );
}


export const putReparation = async ({ id_sud_reparation, id_reparation, formData }) => {
    try {
      return await axios.put(
        `${DOMAIN}/api/charroi/reparation`,
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
    return axios.get(`${DOMAIN}/api/charroi/reparation_image?id_reparation=${id_reparation}&id_inspection_gen=${id_inspection_gen}`);
}

export const postReparationImage = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/reparation_image`, data , {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
} 

//Carateristique rep
export const getCarateristiqueRep = async () => {
    return axios.get(`${DOMAIN}/api/charroi/carateristique_rep`);
}

//Inspection gen
export const getInspectionGen = async (searchValue, data) => {
    return axios.post(`${DOMAIN}/api/charroi/inspection_gens?searchValue=${searchValue}`, data);
}

export const getInspectionResume = async () => {
    return axios.get(`${DOMAIN}/api/charroi/inspection_gen_resume`);
}

export const postInspectionGen= async (data) => {
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

export const getSubInspectionOneV = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/sub_inspection_genOneV?id_sub_inspection_gen=${id}`);
}

export const getSubInspectionOne = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/sub_inspection_genOne?id_sub_inspection_gen=${id}`);
}

/* export const putSubInspection = async (id) => {
    console.log(id)
    return axios.put(`${DOMAIN}/api/charroi/sub_inspection_gen?data=${id}`);
}
 */

export const putSubInspection = async ({ id_sub_inspection_gen, id_inspection_gen, formData }) => {

    console.log(id_sub_inspection_gen)
    try {
      return await axios.put(
        `${DOMAIN}/api/charroi/sub_inspection_gen`, // pas d'ID dans l'URL
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          params: {
            id_sub_inspection_gen,
            id_inspection_gen
          }
        }
      );
    } catch (error) {
      console.error("Erreur dans putSubInspection :", error);
      throw error;
    }
  };


export const deleteInspectionGen= async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/delete_inspection`, data );
}
  
export const putInspectionGenImage= async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/put_inspection_gen_image`, data , {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

//Suivi reparation

export const getSuiviReparation= async (id, inspectionId) => {
    return axios.get(`${DOMAIN}/api/charroi/suivi_reparation?id_reparation=${id}&id_inspection_gen=${inspectionId}`);
}

export const getSuiviReparationOne = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/suivi_reparationOne?id_sud_reparation=${id}`);
}

export const postSuiviReparation= async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/suivi_reparation`, data );
}

export const putSuiviReparation= async (id, data) => {
    return axios.put(`${DOMAIN}/api/charroi/suivi_reparation?id_suivi_reparation=${id}`, data);
}

//Evaluation
export const getEvaluation = async () => {
    return axios.get(`${DOMAIN}/api/charroi/evaluation`);
}

//Document reparation
export const getDocumentReparation = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/document_reparation?id_sud_reparation=${id}`);
}

export const postDocumentReparation = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/document_reparation`, data , {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
}

//Piece
export const getCatPiece = async () => {
    return axios.get(`${DOMAIN}/api/charroi/cat_piece`);
}

export const getPiece = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/piece`);
}

export const getPieceOne = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/pieceOne?id_cat=${id}`);
}

export const postPiece= async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/piece`, data);
}

//Tracking gen
export const getTracking = async () => {
    return axios.get(`${DOMAIN}/api/charroi/tracking_gen`);
}

export const getLogInspection = async () => {
    return axios.get(`${DOMAIN}/api/charroi/log_inspection`);
}

//doc inspection
export const getDocumentInspection = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/document_inspection?id_sub_inspection=${id}`);
}

//Historique
export const getHistorique = async (data) => {
    return axios.get(`${DOMAIN}/api/charroi/historique?searchValue=${data}`);
}

//Reclamation
export const getReclamation = async (idReparation, inspectionId) => {
    return axios.get(`${DOMAIN}/api/charroi/reclamation?id_reparation=${idReparation}&inspectionId=${inspectionId}`);
}

export const getReclamationOne = async (id) => {
    return axios.get(`${DOMAIN}/api/charroi/reclamationOne?id_sub_inspection_gen=${id}`);
}

export const postReclamation = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/reclamation`, data );
}

//Service demandeur
export const getServiceDemandeur = async () => {
    return axios.get(`${DOMAIN}/api/charroi/serviceDemadeur`);
}

export const getTypeVehicule = async () => {
    return axios.get(`${DOMAIN}/api/charroi/type_vehicule`);
}

export const getMotif = async () => {
    return axios.get(`${DOMAIN}/api/charroi/motif`);
}

export const getDemandeVehicule = async (userId, role) => {
    return axios.get(`${DOMAIN}/api/charroi/demande_vehicule?userId=${userId}&userRole=${role}`);
}

export const postDemandeVehicule = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/demande_vehicule`, data);
}

export const putDemandeVehiculeVu = async(id) => {
    return axios.put(`${DOMAIN}/api/charroi/demande_vehiculeVue?id_demande=${id}`)
}

//Affectation
export const getAffectationDemande = async () => {
    return axios.get(`${DOMAIN}/api/charroi/affectation_demande`);
}

export const getAffectationDemandeOne = async () => {
    return axios.get(`${DOMAIN}/api/charroi/affectation_demandeOne`);
}

export const postAffectationDemande = async (data) => {
    return axios.post(`${DOMAIN}/api/charroi/affectation_demande`, data);
}