import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

//Equipement
export const getEquipement = async () => {
    return axios.get(`${DOMAIN}/api/batiment/equipement`);
  };

export const getEquipementOneV = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/equipement/oneV?id=${id}`);
  };

export const getEquipementOne = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/equipement/one?id=${id}`);
  };

export const postEquipement = async (data) => {
  return axios.post(`${DOMAIN}/api/batiment/equipement`, data);
};

export const putEquipement = async (id,data) => {
  return axios.put(`${DOMAIN}/api/batiment/equipement_update?id_equipement=${id}`, data);
};

//Batiment plan
export const getPlans = async () => {
    return axios.get(`${DOMAIN}/api/batiment/plans`);
  };

export const getPlansOne = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/plans/one?id_batiment=${id}`);
  };

export const postPlans = async (data) => {
    return axios.post(`${DOMAIN}/api/batiment/plans`, data);
  };

//Maintenance
export const getMaintenance = async () => {
    return axios.get(`${DOMAIN}/api/batiment/maintenance`);
  };

export const getMaintenanceOne = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/maintenance/one?id=${id}`);
  };

export const postMaintenance = async (data) => {
    return axios.post(`${DOMAIN}/api/batiment/maintenance`, data);
  };

// Type Equipement
export const getTypeEquipement = async () => {
    return axios.get(`${DOMAIN}/api/batiment/type_equipement`);
  };
  
export const getStatutEquipement = async () => {
    return axios.get(`${DOMAIN}/api/batiment/statut_equipement`);
  };

  export const getStatutMaintenance = async () => {
    return axios.get(`${DOMAIN}/api/batiment/statut_maintenance`);
  };

  //Doc
export const getBatimentDoc = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/doc`);
  };

export const getBatimentDocOne1 = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/doc/one1?id_document=${id}`);
  };
export const getBatimentDocOne = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/doc/one?id_batiment=${id}`);
  };

export const postBatimentDoc = async (data) => {
  return axios.post(`${DOMAIN}/api/batiment/doc`, data);
};

export const putBatimentDoc = async (id,data) => {
  return axios.put(`${DOMAIN}/api/batiment/doc?id_document=${id}`, data);
};

  

//Stock
export const getStock = async () => {
    return axios.get(`${DOMAIN}/api/batiment/stock`);
  };

export const getStockOne = async (id) => {
    return axios.get(`${DOMAIN}/api/batiment/stock/one?id=${id}`);
  };

export const postStock = async (data) => {
  return axios.post(`${DOMAIN}/api/batiment/stock`, data);
};

export const putStock = async (id,data) => {
  return axios.put(`${DOMAIN}/api/batiment/stock?id=${id}`, data);
};

//Rapport
export const getRapport = async () => {
  return axios.get(`${DOMAIN}/api/batiment/rapport`);
};

export const getRapportOne = async (id) => {
  return axios.get(`${DOMAIN}/api/batiment/rapport/one?id=${id}`);
};

export const getTableauOne = async (id) => {
  return axios.get(`${DOMAIN}/api/batiment/tableau_bord/one?id=${id}`);
};

//Entrepot
export const getEntrepot = async () => {
  return axios.get(`${DOMAIN}/api/batiment/entrepot`);
};

export const getEntrepotOne = async (id) => {
  return axios.get(`${DOMAIN}/api/batiment/entrepot/one?id_batiment=${id}`);
};

export const getEntrepotOneV = async (id) => {
  return axios.get(`${DOMAIN}/api/batiment/entrepot/oneV?id=${id}`);
};

export const postEntrepot = async (data) => {
return axios.post(`${DOMAIN}/api/batiment/entrepot`, data);
};

export const putEntrepot = async (id, data) => {
  return axios.put(`${DOMAIN}/api/batiment/entrepot_put?id_entrepot=${id}`, data);
  };


//BINS
export const getBins = async () => {
  return axios.get(`${DOMAIN}/api/batiment/bins`);
};

export const getBinsOne = async (id) => {
  return axios.get(`${DOMAIN}/api/batiment/bins/one?id_batiment=${id}`);
};

export const getBinsOneV = async (id) => {
  return axios.get(`${DOMAIN}/api/batiment/bins/oneV?id=${id}`);
};

export const postBins = async (data) => {
return axios.post(`${DOMAIN}/api/batiment/bins`, data);
};

export const putBins = async (id,data) => {
  return axios.put(`${DOMAIN}/api/batiment/bins_put?id=${id}`, data);
};

export const putDeleteBins = async (id) => {
    return axios.put(`${DOMAIN}/api/batiment/bins_delete?id=${id}`);
    };

//Maintenance Bins
export const getMaintenanceBins = async () => {
  return axios.get(`${DOMAIN}/api/batiment/maintenance_bins`);
};

export const getMaintenanceBinsOne = async (id) => {
  return axios.get(`${DOMAIN}/api/batiment/maintenance_bins/one?id_bin=${id}`);
};

export const postMaintenanceBins = async (data) => {
return axios.post(`${DOMAIN}/api/batiment/maintenance_bins`, data);
};

//Bureaux
export const getBureau = async () => {
  return axios.get(`${DOMAIN}/api/batiment/bureau`);
};

export const getBureauOne = async (id) => {
  return axios.get(`${DOMAIN}/api/batiment/bureau/one?id_batiment=${id}`);
};

export const postBureau = async (data) => {
return axios.post(`${DOMAIN}/api/batiment/bureau`, data);
};

//Niveau batiment
export const getNiveauCount = async () => {
  return axios.get(`${DOMAIN}/api/batiment/niveau_count`);
};

export const getNiveau = async () => {
  return axios.get(`${DOMAIN}/api/batiment/niveaau_batiment`);
};

export const getNiveauOne = async (id) => {
  return axios.get(`${DOMAIN}/api/batiment/niveau_batiment/one?id_batiment=${id}`);
};

export const postNiveau = async (idBatiment, data) => {
  const params = {
    id_batiment: idBatiment,
    niveaux: Object.keys(data)
      .filter(key => key !== 'id_batiment')
      .map(key => data[key])
  };
return axios.post(`${DOMAIN}/api/batiment/niveaau_batiment`, params);
};

export const putNiveau = async (id,data) => {
  return axios.put(`${DOMAIN}/api/batiment/niveau_batiment_put?id_niveau=${id}`, data);
};


//Dénomination batiment
export const getDenomination = async () => {
  return axios.get(`${DOMAIN}/api/batiment/denomination`);
};

export const getDenominationOne = async (id) => {
  return axios.get(`${DOMAIN}/api/batiment/denomination/one?id_batiment=${id}`);
};

export const postDenomination = async (idBatiment, data) => {

  const params = {
    id_batiment:idBatiment,
    ...data
  }
return axios.post(`${DOMAIN}/api/batiment/denomination`, params);
};

////WHSE FACT
export const getWHSEFACT = async () => {
  return axios.get(`${DOMAIN}/api/batiment/whse_fact`);
};

export const getWHSEFACTOne = async (id) => {
  return axios.get(`${DOMAIN}/api/batiment/whse_fact/one?id_batiment=${id}`);
};

export const postWHSEFACT = async (idBatiment, data) => {
  const params = {
    id_batiment:idBatiment,
    ...data
  }
return axios.post(`${DOMAIN}/api/batiment/whse_fact`, params);
};

//Adresse
export const getAdresse = async () => {
  return axios.get(`${DOMAIN}/api/batiment/adresse`);
};