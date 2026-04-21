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

export const transformToVehicle = (rawItem) => {
  const coords = extractCoordinates(rawItem);
  if (!coords) return null;
  
  const speed = rawItem.speed || rawItem.capteurInfo?.speed || 0;
  const trajectory = extractTrajectory(rawItem);
  
  return {
    id: String(rawItem.id_bande_sortie || rawItem.id),
    name: rawItem.nom || rawItem.name_capteur || rawItem.name || 'Sans nom',
    driver: `${rawItem.prenom_chauffeur || ''} ${rawItem.nom || ''}`.trim() || 'Non assigné',
    registration: rawItem.immatriculation || 'N/A',
    destination: rawItem.nom_destination || 'N/A',
    service: rawItem.nom_service || 'N/A',
    status: speed > 0 ? VEHICLE_STATUS.MOVING : VEHICLE_STATUS.STOPPED,
    speed: Math.round(speed),
    lat: coords.lat,
    lng: coords.lng,
    trajectory,
    totalDistance: rawItem.total_distance || 0,
    stopDuration: rawItem.stop_duration_sec || 0,
    stopDurationFormatted: rawItem.stop_duration || '0s',
    efficiency: calculateEfficiency(rawItem.duree_moyenne_min, rawItem.duree_reelle_min),
    comment: rawItem.commentaire,
    lastUpdate: rawItem.time,
    startTime: rawItem.sortie_time,
    expectedReturn: rawItem.date_retour,
    course: rawItem.course || 0,
    engineStatus: rawItem.engine_status
  };
};
