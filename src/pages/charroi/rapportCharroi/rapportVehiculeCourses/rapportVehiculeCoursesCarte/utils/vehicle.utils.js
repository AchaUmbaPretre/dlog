import { VEHICLE_STATUS } from '../constants/map.constants';
import { isValidCoordinate, parseCoordinate } from './coordinates.utils';

export const extractCoordinates = (rawData) => {
  const sources = [rawData, rawData.capteurInfo, rawData.device_data];
  
  for (const source of sources) {
    if (source?.lat !== undefined && source?.lng !== undefined) {
      const lat = parseCoordinate(source.lat);
      const lng = parseCoordinate(source.lng);
      if (lat !== null && lng !== null && isValidCoordinate(lat, lng)) {
        return { lat, lng };
      }
    }
  }
  return null;
};

export const extractTrajectory = (rawData) => {
  const tail = rawData.tail || rawData.capteurInfo?.tail;
  if (!tail || !Array.isArray(tail)) return [];
  
  return tail
    .filter(point => isValidCoordinate(point.lat, point.lng))
    .map(point => [parseCoordinate(point.lat), parseCoordinate(point.lng)]);
};

export const calculateEfficiency = (plannedMinutes, actualMinutes) => {
  if (!plannedMinutes || plannedMinutes <= 0) return 100;
  const ratio = Math.abs(actualMinutes) / plannedMinutes;
  return Math.round(Math.max(0, 100 - ratio * 100));
};

// utils/vehicle.utils.js

export const transformToVehicle = (rawItem) => {
  if (!rawItem) return null;
  
  const coords = extractCoordinates(rawItem);
  if (!coords) return null;
  
  const speed = rawItem.speed || rawItem.capteurInfo?.speed || 0;
  const status = speed > 0 ? VEHICLE_STATUS.MOVING : VEHICLE_STATUS.STOPPED;
  const trajectory = extractTrajectory(rawItem);
  
  // ✅ CORRECTION: Extraire correctement la distance totale
  let totalDistance = 0;
  
  // Essayer différentes sources pour la distance
  if (rawItem.total_distance) {
    totalDistance = parseFloat(rawItem.total_distance);
  } else if (rawItem.capteurInfo?.total_distance) {
    totalDistance = parseFloat(rawItem.capteurInfo.total_distance);
  } else if (rawItem.distance) {
    totalDistance = parseFloat(rawItem.distance);
  }
  
  // Calculer l'efficacité avec la formule actuelle
  const efficiency = calculateEfficiency(
    rawItem.duree_moyenne_min, 
    rawItem.duree_reelle_min
  );
  
  return {
    id: String(rawItem.id_bande_sortie || rawItem.id || Math.random()),
    name: rawItem.nom || rawItem.name_capteur || rawItem.name || 'Sans nom',
    driver: `${rawItem.prenom_chauffeur || ''} ${rawItem.nom || ''}`.trim() || 'Non assigné',
    registration: rawItem.immatriculation || 'N/A',
    destination: rawItem.nom_destination || 'N/A',
    service: rawItem.nom_service || 'N/A',
    status,
    speed: Math.round(speed),
    lat: coords.lat,
    lng: coords.lng,
    trajectory,
    totalDistance: totalDistance,  // ✅ Maintenant avec la bonne valeur
    stopDuration: rawItem.stop_duration_sec || 0,
    stopDurationFormatted: rawItem.stop_duration || '0s',
    efficiency: efficiency,
    comment: rawItem.commentaire,
    lastUpdate: rawItem.time || rawItem.capteurInfo?.time,
    startTime: rawItem.sortie_time,
    expectedReturn: rawItem.date_retour,
    course: rawItem.course || 0,
    engineStatus: rawItem.engine_status,
    address: rawItem.capteurInfo?.address || rawItem.address,
    rawData: rawItem
  };
};