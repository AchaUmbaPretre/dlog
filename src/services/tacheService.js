import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getTacheCountChart = async () => {
  return axios.get(`${DOMAIN}/api/tache/count_chart`);
};

export const getTacheCount = async () => {
  return axios.get(`${DOMAIN}/api/tache/count`);
};

export const getTache = async (data) => {
  return axios.post(`${DOMAIN}/api/tache/tache`, data);
};

export const getTacheDoc = async (user) => {
    return axios.get(`${DOMAIN}/api/tache/tache_doc`);
  };

export const getTacheOneV = async (id) => {
    return axios.get(`${DOMAIN}/api/tache/oneV?id_tache=${id}`);
  };

export const getTacheOne = async (id) => {
    return axios.get(`${DOMAIN}/api/tache/one?id_tache=${id}`);
  };

export const getAllTache = async (id) => {
    return axios.get(`${DOMAIN}/api/tache/all_tache?id_tache=${id}`);
  };

export const getDetailTacheDoc = async (id) => {
    return axios.get(`${DOMAIN}/api/tache/detail_tache_doc?id_tache=${id}`);
  };

export const getTacheControleOne = async (id) => {
    return axios.get(`${DOMAIN}/api/tache/controleTacheOne?id_controle=${id}`);
  };

export const postTache = async (data) => {
  return axios.post(`${DOMAIN}/api/tache`, data);
};

export const getTacheDocOne = async (id) => {
  return axios.get(`${DOMAIN}/api/tache/tache_doc/one?id_tache_document=${id}`);
};

export const postTacheDoc = async (data) => {
  return axios.post(`${DOMAIN}/api/tache/tache_doc`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const postTacheDocExcel = async (data) => {
  return axios.post(`${DOMAIN}/api/tache/tache_doc_excel`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const putTacheDoc = async (id, data) => {
  return axios.put(`${DOMAIN}/api/tache/tache_doc?id_tache_document=${id}`, data,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deletePutTache = async (id) => {
  return axios.put(`${DOMAIN}/api/tache/supprime_put?id=${id}`);
};

export const deleteTache = async (id) => {
  return axios.delete(`${DOMAIN}/api/tache/${id}`);
};


//Tache personne
export const getTachePersonne = async (user) => {
  return axios.get(`${DOMAIN}/api/tache/tache_personne`);
};

export const getTachePersonneOne = async (id) => {
  return axios.get(`${DOMAIN}/api/tache/tache_personne?id_tache=${id}`);
};

export const postTachePersonne = async (data) => {
return axios.post(`${DOMAIN}/api/tache/tache_personne`, data);
};

export const deleteTachePersonne = async (id) => {
  return axios.delete(`${DOMAIN}/api/tache/tache_personne/${id}`);
};

export const putTache = async (id, data) => {
  return axios.put(`${DOMAIN}/api/tache?id_tache=${id}`, data);
};

export const putTacheDesc = async (id, data) => {
  return axios.put(`${DOMAIN}/api/tache/put_desc?id_tache=${id}`, data);
};

export const putPriorite = async (id, data) => {
  return axios.put(`${DOMAIN}/api/tache/priorite?id_tache=${id}`, data);
}

//Tag
export const postTag = async (id, data) => {
  return axios.post(`${DOMAIN}/api/tache/post_tag?id_tache=${id}`, data);
  };

//Search
export const getSearch = async (data) => {
  return axios.get(`${DOMAIN}/api/tache/get_search?term=${data}`)
}

//Tache projet
export const postTacheProjet = async (data) => {
  return axios.post(`${DOMAIN}/api/tache/projet_tache`, data)
}

//Projet associé
export const putProjetAssocie = async (data) => {
  return axios.put(`${DOMAIN}/api/tache/projet_associe?id_tache=${data.id_tache}`, data.id_projet);
}