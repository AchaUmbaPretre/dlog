import axios from 'axios';
import config from '../config';
import { userRequest } from '../requestMethods';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getPresence = async (dateRange, siteId) => {
  if (!dateRange || dateRange.length !== 2) {
    return Promise.resolve({ data: [] });
  }

  const params = {
    startDate: dateRange[0].format("YYYY-MM-DD"),
    endDate: dateRange[1].format("YYYY-MM-DD"),
  };

  if (siteId) {
    params.site = siteId;
  }

  return axios.get(`${DOMAIN}/api/presence`, { params });
};


export const getPresencePlanning = async (dateRange) => {
  return userRequest.get(`${DOMAIN}/api/presence/planning`, {
    params: dateRange ?? {}
  });
};

export const getPresenceRapport = async ({ month, year, site }) => {
  return axios.get(`${DOMAIN}/api/presence/month`, {
    params: {
      month,
      year,
      site
    }
  });
};

export const getPresenceSite = async ({ month, year, site }) => {
  return axios.get(`${DOMAIN}/api/presence/presence_site_month`, {
    params: {
      month,
      year,
      site
    }
  });
};


export const getPresenceRetardPonctualite = async (dateRange, site) => {
  if (!dateRange || dateRange.length !== 2) {
    return axios.get(`${DOMAIN}/api/presence/lateEarly`, {
      params: {
        site
      }
    });
  }

  return axios.get(`${DOMAIN}/api/presence/lateEarly`, {
    params: {
      startDate: dateRange[0].format("YYYY-MM-DD"),
      endDate: dateRange[1].format("YYYY-MM-DD"),
      site
    }
  });
};

export const getAttendanceAdjustment = async () => {
  return axios.get(`${DOMAIN}/api/presence/attendance-adjustments`);
};

export const postAttendanceAdjustment = async (data) => {
  return axios.post(`${DOMAIN}/api/presence/attendance-adjustments`, data);
};

export const validateAttendanceAdjustment = async (data) => {
  return axios.put(`${DOMAIN}/api/presence/validation-adjustments`, data);
};

export const getHRGlobalReport = async (dateRange) => {
  if (!dateRange || dateRange.length !== 2) {
    return axios.get(`${DOMAIN}/api/presence/hrglobal`);
  }

  return axios.get(`${DOMAIN}/api/presence/hrglobal`, {
    params: {
      startDate: dateRange[0].format("YYYY-MM-DD"),
      endDate: dateRange[1].format("YYYY-MM-DD")
    }
  });
};


export const getPresenceById = async () => {
  return axios.get(`${DOMAIN}/api/presence/presenceById`);
};

export const postPresence = async (data) => {
  return axios.post(`${DOMAIN}/api/presence`, data);
};


//Dashboard
export const getPresenceDashboard = async () => {
  return axios.get(`${DOMAIN}/api/presence/dashboard`);
};

//Congé
export const getConge = async () => {
  return userRequest.get(`${DOMAIN}/api/presence/conge`);
};

export const postConge = async (data) => {
  return userRequest.post(`${DOMAIN}/api/presence/conge`, data);
};

export const validateConge = async (data) => {
    return userRequest.put(`${DOMAIN}/api/presence/validation_conge`, data)
};

//Absence
export const getAbsence = async () => {
  return userRequest.get(`${DOMAIN}/api/presence/absence`);
};

export const getAbsenceType = async () => {
  return axios.get(`${DOMAIN}/api/presence/absence_type`);
};

export const postAbsence = async (data) => {
  return userRequest.post(`${DOMAIN}/api/presence/absence`, data);
};

export const validateAbsence = async (data) => {
  return axios.put(`${DOMAIN}/api/presence/absence-validation`, data);
};

export const getJourFerie = async () => {
  return axios.get(`${DOMAIN}/api/presence/jour-ferie`);
};

export const postJourFerie = async (data) => {
  return axios.post(`${DOMAIN}/api/presence/jour-ferie`, data);
};

//Horaire
export const getHoraire = async () => {
  return axios.get(`${DOMAIN}/api/presence/horaire`);
};

export const getHoraireUser = async () => {
  return axios.get(`${DOMAIN}/api/presence/horaire_user`);
};


export const postHoraire = async (data) => {
  return axios.post(`${DOMAIN}/api/presence/create_horaire`, data);
};

export const postHoraireUser = async (data) => {
  return axios.post(`${DOMAIN}/api/presence/planning_employe`, data);
};

//Terminal
export const getTerminal = async () => {
  return axios.get(`${DOMAIN}/api/presence/terminal`);
};

export const postTerminal = async (data) => {
  return axios.post(`${DOMAIN}/api/presence/terminal`, data);
};

//User Terminal
export const getUserTerminal = async () => {
  return axios.get(`${DOMAIN}/api/presence/user-terminal`);
};

export const getUserTerminalById = async (id) => {
  return axios.get(`${DOMAIN}/api/presence/user-terminalById`,{
    params: {
      id_terminal: id
    }
  })
}

export const postUserTerminal = async (data) => {
  return axios.post(`${DOMAIN}/api/presence/user-terminal`, data);
};

export const deleteUserTerminal = (user_id, terminal_id) => {
  return axios.delete(`/user-terminals`, 
    {
      params: {
        user_id, 
        terminal_id
      }
    }
  );
};
