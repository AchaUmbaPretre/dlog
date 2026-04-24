// services/controleGpsService.js
import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

// Récupérer tous les contrôles
export const getControles = async (date) => {
    const params = date ? { date } : {};
    return axios.get(`${DOMAIN}/api/controleGps/controles`, { params });
};

// ✅ CORRIGER : Récupérer les statistiques
export const getStatistiques = async (date) => {
    const params = date ? { date } : {};
    return axios.get(`${DOMAIN}/api/controleGps/statistiques`, { params });
};

// Récupérer les sorties sans bon
export const getSortiesSansBon = async (date) => {
    const params = date ? { date } : {};
    return axios.get(`${DOMAIN}/api/controleGps/sorties-sans-bon`, { params });
};

// Régulariser une sortie
export const regulariserSortie = async (id, idBonSortie, commentaire, userId) => {
    return axios.post(`${DOMAIN}/api/controleGps/regulariser/${id}`, {
        id_bon_sortie: idBonSortie,
        commentaire,
        user_id: userId
    });
};