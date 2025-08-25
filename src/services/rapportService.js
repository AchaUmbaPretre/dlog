import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getRapport = async (id_client) => {
    return axios.get(`${DOMAIN}/api/rapport?id_client=${id_client}`);
  };

export const getRapportOne = async (id) => {
    return axios.get(`${DOMAIN}/api/rapport/one?rapport=${id}`);
  };

export const postRapport = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport`, data)
}

//Categorie
export const getCatRapport = async () => {
    return axios.get(`${DOMAIN}/api/rapport/cat_rapport`);
  };

//Parametre
export const getParametre = async () => {
    return axios.get(`${DOMAIN}/api/rapport/contrat_parametre`);
  };

export const getParametreOne = async (id) => {
    return axios.get(`${DOMAIN}/api/rapport/contrat_parametre/one?id_contrat=${id}`);
  };

export const getParametreContratCat = async (id) => {
    return axios.get(`${DOMAIN}/api/rapport/contrat_parametreContratCat?id_element_contrat=${id}`);
  };

export const postParametre = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport/contrat_parametre`, data)
}

//Element contrat
export const getElementContrat = async () => {
    return axios.get(`${DOMAIN}/api/rapport/element_contrat`);
  };

export const getElementContratCat = async (idContrat, idCat) => {
    return axios.get(`${DOMAIN}/api/rapport/element_contratCat?id_contrat=${idContrat}&id_cat_rapport=${idCat}`);
  };
export const postElementContrat  = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport/element_contrat`, data)
}

//Etiquette
export const getEtiquette = async () => {
    return axios.get(`${DOMAIN}/api/rapport/etiquette`);
  };

export const postEtiquette  = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport/etiquette`, data)
}

//Contrat
export const getContratRapport = async () => {
    return axios.get(`${DOMAIN}/api/rapport/contrat_rapport`);
  };

export const getContratRapportClient = async () => {
    return axios.get(`${DOMAIN}/api/rapport/contrat_rapportClient`);
  };

export const getContratRapportClientOne = async (id_client) => {
    return axios.get(`${DOMAIN}/api/rapport/contrat_rapportClientOne?id_client=${id_client}`);
  };

export const postContratRapport = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport/contrat_rapport`, data)
}

export const getDeclarationTemplate = async (id, idProvince) => {
    return axios.get(`${DOMAIN}/api/rapport/declarationTemplate?id_template=${id}&id_province=${idProvince}`);
  };

export const getCloture = async () => {
    return axios.get(`${DOMAIN}/api/rapport/cloture`);
  };

export const postCloture = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport/cloture`, data)
}

export const postClotureSimple = async (data) => {
    return axios.post(`${DOMAIN}/api/rapport/cloture_simple`, data)
}

//Rapport de bon de sortie
export const getRapportBonGlobal = async (startDate, endDate) => {
  return axios.get(`${DOMAIN}/api/rapport/rapport_bon_global?startDate=${startDate}&endDate=${endDate}`,);
};

export const getRapportBonPerformance = async (filter) => {
  return axios.get(`${DOMAIN}/api/rapport/rapport_performance`,
    {
      params: filter
    });
};

export const getRapportStatutPrincipaux = async (params) => {
  console.log(params)
  return axios.get(`${DOMAIN}/api/rapport/rapport_statut_principaux`, { params });
};

export const getRapportIndicateurLog = async (params) => {
  return axios.get(`${DOMAIN}/api/rapport/rapport_indicateurs_log`, { params });
};

export const getMouvementVehicule = async (params) => {
  return axios.get(`${DOMAIN}/api/rapport/mouvement_vehicule`, { params });
};
