import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getTemplateCount = async () => {
  return axios.get(`${DOMAIN}/api/template/count`);
};

export const getTemplate = async () => {
    return axios.get(`${DOMAIN}/api/template`);
  };

export const getTemplate5derniers = async (id, periode, idProvince) => {
    return axios.get(`${DOMAIN}/api/template/5derniers?id_client=${id}&periode=${periode}&idProvince=${idProvince}`);
  };

export const getTemplateDeuxMoisPrecedent = async (id, idProvince) => {
    return axios.get(`${DOMAIN}/api/template/2mois_precedents?id_client=${id}&idProvince=${idProvince}`);
  };

export const putTemplateStatus = async (id, data) => {
    return axios.put(`${DOMAIN}/api/template/statut?id_template=${id}`, {
      status_template : data
    });
  };

export const getTemplateOne = async (id) => {
    return axios.get(`${DOMAIN}/api/template/one?id_template=${id}`);
  };

export const postTemplate = async (data) => {
    return axios.post(`${DOMAIN}/api/template`, data);
  };

export const deletePutTemplate = async (id) => {
    return axios.put(`${DOMAIN}/api/template/template_update_delete?id=${id}`);
  };

export const putTemplate = async (id,data) => {
    return axios.put(`${DOMAIN}/api/template/template_update?id_template=${id}`, data);
  };

export const getTypeOccupation = async () => {
    return axios.get(`${DOMAIN}/api/template/type_occupation`);
  };

export const getObjetFacture = async () => {
    return axios.get(`${DOMAIN}/api/template/objet_facture`);
  };

//Déclaration superficie
export const getDeclarationId = async () => {
  return axios.get(`${DOMAIN}/api/template/declaration_ID`);
}

export const getDeclarationCount = async () => {
  return axios.get(`${DOMAIN}/api/template/declaration_count`);
};

export const getDeclaration = async (data, searchValue, role, userId) => {
    return axios.post(`${DOMAIN}/api/template/declaration_superficies?search=${searchValue}&role=${role}&userId=${userId}`, data);
  };

export const getDeclarationClientOneAll= async (idClient, data) => {
    return axios.post(`${DOMAIN}/api/template/declaration_superficies_client_OneAll?idClient=${idClient}`, data);
  };

export const getDeclaration5derniers = async () => {
    return axios.get(`${DOMAIN}/api/template/declaration_superficies_5derniers`);
  };

export const getDeclarationOne = async (id) => {
    return axios.get(`${DOMAIN}/api/template/declaration_superficie/one?id=${id}`);
  };

export const getDeclarationOneClient = async (id, idProvince, periode) => {
    return axios.get(`${DOMAIN}/api/template/declaration_superficie/oneClient?id_client=${id}&idProvince=${idProvince}&periode=${periode}`);
  };

export const getDeclarationVille = async (id) => {
    return axios.get(`${DOMAIN}/api/template/declaration_superficie/oneVille?id_ville=${id}`);
  };
export const postDeclaration = async (data) => {
    return axios.post(`${DOMAIN}/api/template/declaration_superficie`, data);
  };

export const putDeclaration = async (id,data) => {
    return axios.put(`${DOMAIN}/api/template/declaration_superficie?id_declaration=${id}`, data);
  };

export const deletePutDeclaration = async (id) => {
    return axios.put(`${DOMAIN}/api/template/declaration_superficie_delete?id=${id}`);
  };

  //Statut declarations
export const putDeclarationsStatus = async (id, data) => {
    return axios.put(`${DOMAIN}/api/template/statut_declaration?id_declarations=${id}`, {
      status_decl : data
    });
  };

  export const putDeclarationsStatusCloture = async (data) => {
    return axios.put(`${DOMAIN}/api/template/statut_declaration_cloture`, data);
  };

export const getContrat = async () => {
    return axios.get(`${DOMAIN}/api/template/contrat`);
  };

export const getContratOne = async (id) => {
  return axios.get(`${DOMAIN}/api/template/contratOne?id_client=${id}`);
};

export const postContrat = async (data) => {
  return axios.post(`${DOMAIN}/api/template/contrat`, data);
};

//Type contrat
export const getTypeContrat = async () => {
  return axios.get(`${DOMAIN}/api/template/type_contrat`);
};

//Rapport facture
export const getRapportFacture = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_facture`, filter);
};

//Rapport superficie
export const getRapportSuperficie = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_superficie`, filter);
};

//Rapport complet
export const getRapportComplet = async (filter) => {
  return axios.post(`${DOMAIN}/api/template//rapport_complet`, filter);
};

export const getRapportFactureClient = async (filter) => {
  return axios.get(`${DOMAIN}/api/template/rapport_facture_client`, filter);
};

export const getRapportFactureVille = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_facture_ville`, filter);
};

export const getRapportFactureExterneEtInterne = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_facture_externeEtInternet`, filter);
};

//Rapport ville
export const getRapportVille = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_ville`,filter);
};

//Rapport Pays
export const getRapportPays = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_pays`,filter);
};

//Rapport Externe et Interne
export const getRapportExterneEtInterne = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_externEtInterne`,filter);
};

//Rapport Externe et Interne Annee
export const getRapportExterneEtInterneAnnee = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_externEtInterneAnnee`,filter);
};

//Rapport Externe et Interne Client
export const getRapportExterneEtInterneClient = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_externEtInterneClient`,filter);
};

//Rapport Manutentation
export const getRapportManutentation = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_manutentation`, filter);
};

//Rapport Entreposage
export const getRapportEntreposage = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_entreposage`, filter);
};

//Rapport Template
export const getRapportTemplate = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_template`, filter);
};

//Rapport Batiment
export const getRapportBatiment = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_batiment`, filter);
};

//Rapport Variation
export const getRapportVariation = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_variation`, filter);
};


//Rapport Variation ville
export const getRapportVariationVille = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_variation_ville`, filter);
};

//Rapport Variation client
export const getRapportVariationClient = async (filter) => {
  return axios.post(`${DOMAIN}/api/template/rapport_variation_client`, filter);
};



//Mois & ANNEE
export const getMois = async (annee) => {
  return axios.get(`${DOMAIN}/api/template/mois?annee=${annee}`);
};

export const getAnnee = async () => {
  return axios.get(`${DOMAIN}/api/template/annee`);
};