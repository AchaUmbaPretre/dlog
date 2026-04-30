import { VEHICLE_STATUS, IDLE_THRESHOLDS } from '../constants/map.constants';
import { isValidCoordinate, parseCoordinate } from './coordinates.utils';

// ============ FONCTIONS UTILITAIRES ============

const calculateCourseFromTrajectory = (tail) => {
  if (!tail || tail.length < 2) return null;
  
  // Prendre les deux derniers points (les plus récents)
  const lastPoint = tail[tail.length - 1];
  const prevPoint = tail[tail.length - 2];
  
  const lat1 = parseFloat(prevPoint.lat);
  const lon1 = parseFloat(prevPoint.lng);
  const lat2 = parseFloat(lastPoint.lat);
  const lon2 = parseFloat(lastPoint.lng);
  
  // Formule de calcul du cap
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  bearing = (bearing + 360) % 360;
  
  return bearing;
};


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
  const ratio = Math.abs(actualMinutes || 0) / plannedMinutes;
  return Math.round(Math.max(0, Math.min(100, 100 - ratio * 100)));
};

export const formatPremiumDuration = (seconds) => {
  if (!seconds || seconds <= 0) return { short: '0s', full: '0 seconde' };
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  const fullParts = [];
  
  if (days > 0) {
    parts.push(`${days}j`);
    fullParts.push(`${days} jour${days > 1 ? 's' : ''}`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
    fullParts.push(`${hours} heure${hours > 1 ? 's' : ''}`);
  }
  if (minutes > 0 && days === 0) {
    parts.push(`${minutes}min`);
    fullParts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }
  if (secs > 0 && days === 0 && hours === 0 && minutes === 0) {
    parts.push(`${secs}s`);
    fullParts.push(`${secs} seconde${secs > 1 ? 's' : ''}`);
  }
  
  return {
    short: parts.join(' '),
    full: fullParts.join(' ')
  };
};

export const determineVehicleStatus = (speed, stopDurationSec) => {
  if (speed > 0) return VEHICLE_STATUS.MOVING;
  if (!stopDurationSec || stopDurationSec <= 0) return VEHICLE_STATUS.STOPPED;
  
  if (stopDurationSec >= IDLE_THRESHOLDS.VERY_LONG_IDLE) {
    return VEHICLE_STATUS.VERY_LONG_IDLE;
  }
  if (stopDurationSec >= IDLE_THRESHOLDS.LONG_IDLE) {
    return VEHICLE_STATUS.LONG_IDLE;
  }
  if (stopDurationSec >= IDLE_THRESHOLDS.IDLE) {
    return VEHICLE_STATUS.IDLE;
  }
  
  return VEHICLE_STATUS.STOPPED;
};

// ============ SCORE DE STATIONNEMENT (0-100) ============

export const calculateParkingScore = (stopDurationSec) => {
  if (!stopDurationSec || stopDurationSec <= 0) return 100;
  
  // Moins de 30 min -> 100%
  if (stopDurationSec < IDLE_THRESHOLDS.IDLE) return 100;
  
  // Entre 30 min et 2h -> 100% à 50%
  if (stopDurationSec < IDLE_THRESHOLDS.LONG_IDLE) {
    const range = IDLE_THRESHOLDS.LONG_IDLE - IDLE_THRESHOLDS.IDLE;
    const progress = (stopDurationSec - IDLE_THRESHOLDS.IDLE) / range;
    return Math.round(100 - (progress * 50));
  }
  
  // Entre 2h et 8h -> 50% à 0%
  if (stopDurationSec < IDLE_THRESHOLDS.VERY_LONG_IDLE) {
    const range = IDLE_THRESHOLDS.VERY_LONG_IDLE - IDLE_THRESHOLDS.LONG_IDLE;
    const progress = (stopDurationSec - IDLE_THRESHOLDS.LONG_IDLE) / range;
    return Math.round(50 - (progress * 50));
  }
  
  // Plus de 8h -> 0%
  return 0;
};

// ============ RECOMMANDATIONS INTELLIGENTES ============

export const getParkingRecommendation = (stopDurationSec) => {
  if (!stopDurationSec || stopDurationSec <= 0) {
    return {
      level: 'success',
      message: '✅ Stationnement normal',
      action: 'Tout est en ordre'
    };
  }
  
  if (stopDurationSec >= IDLE_THRESHOLDS.VERY_LONG_IDLE) {
    return {
      level: 'critical',
      message: '🚨 VÉHICULE À L\'ABANDON - Action urgente requise',
      action: 'Contacter immédiatement le conducteur ou les secours'
    };
  }
  
  if (stopDurationSec >= IDLE_THRESHOLDS.LONG_IDLE) {
    return {
      level: 'warning',
      message: '⚠️ Stationnement très prolongé - À surveiller',
      action: 'Vérifier la situation du véhicule et contacter le conducteur'
    };
  }
  
  if (stopDurationSec >= IDLE_THRESHOLDS.IDLE) {
    return {
      level: 'info',
      message: 'ℹ️ Stationnement prolongé',
      action: 'Aucune action immédiate, simple surveillance'
    };
  }
  
  return {
    level: 'success',
    message: '✅ Stationnement normal',
    action: 'Tout est en ordre'
  };
};

// ============ PARSING DES COORDONNÉES DE DESTINATION ============

export const parseDestinationCoordinates = (coordinatesStr) => {
  if (!coordinatesStr) return null;
  try {
    // Si c'est déjà un objet
    if (typeof coordinatesStr === 'object') return coordinatesStr;
    
    // Si c'est une chaîne JSON
    const coords = JSON.parse(coordinatesStr);
    if (!Array.isArray(coords) || coords.length === 0) return null;
    
    // Calculer le centre du polygone
    const center = coords.reduce((acc, point) => ({
      lat: acc.lat + point.lat / coords.length,
      lng: acc.lng + point.lng / coords.length
    }), { lat: 0, lng: 0 });
    
    return {
      polygon: coords,
      center: [center.lat, center.lng],
      bounds: coords.map(p => [p.lat, p.lng])
    };
  } catch (e) {
    console.warn('Erreur parsing coordinates:', e);
    return null;
  }
};

// ============ TRANSFORMATION PRINCIPALE ============

export const transformToVehicle = (rawItem) => {
  console.log('data: ', rawItem)
  if (!rawItem) return null;
  
  // Extraction des coordonnées GPS
  const coords = extractCoordinates(rawItem);
  if (!coords) return null;
  
  // Extraction de la vitesse
  const speed = rawItem.speed || rawItem.capteurInfo?.speed || 0;
  
  // Extraction de la durée d'arrêt
  let stopDurationSec = 0;
  let stopDurationRaw = '0s';
  
  if (rawItem.stop_duration_sec) {
    stopDurationSec = rawItem.stop_duration_sec;
    stopDurationRaw = rawItem.stop_duration || formatPremiumDuration(stopDurationSec).short;
  } else if (rawItem.capteurInfo?.stop_duration_sec) {
    stopDurationSec = rawItem.capteurInfo.stop_duration_sec;
    stopDurationRaw = rawItem.capteurInfo.stop_duration || formatPremiumDuration(stopDurationSec).short;
  }
  
  // Formatage premium de la durée
  const formattedDuration = formatPremiumDuration(stopDurationSec);
  
  // Détection signal perdu
  const lastUpdate = rawItem.time || rawItem.capteurInfo?.time;
  const hoursSinceUpdate = lastUpdate ? (Date.now() - new Date(lastUpdate)) / (1000 * 3600) : 0;
  const isSignalLost = hoursSinceUpdate > 2;
  
  // Détermination du statut
  let status = determineVehicleStatus(speed, stopDurationSec);
  if (isSignalLost && speed === 0) {
    status = VEHICLE_STATUS.NO_SIGNAL;
  }
  
  // Calcul du score de stationnement
  const parkingScore = calculateParkingScore(stopDurationSec);
  
  // Génération de recommandation
  const recommendation = getParkingRecommendation(stopDurationSec);
  
  // Extraction de la trajectoire
  const trajectory = extractTrajectory(rawItem);
  
  // Extraction de la distance totale
  let totalDistance = 0;
  if (rawItem.total_distance) {
    totalDistance = parseFloat(rawItem.total_distance);
  } else if (rawItem.capteurInfo?.total_distance) {
    totalDistance = parseFloat(rawItem.capteurInfo.total_distance);
  } else if (rawItem.distance) {
    totalDistance = parseFloat(rawItem.distance);
  }
  
  // Calcul de l'efficacité
  const efficiency = calculateEfficiency(
    rawItem.duree_moyenne_min, 
    rawItem.duree_reelle_min
  );
  
  // Batterie (si disponible)
  const batteryLevel = rawItem.battery_level || rawItem.capteurInfo?.battery_level;
  
  // Coupure batterie
  const isEngineCut = rawItem.engine_cut || rawItem.capteurInfo?.engine_cut || false;
  
  // Coordonnées destination
  const destinationCoords = parseDestinationCoordinates(rawItem.coordinates);
  
  // Statut en ligne
  const isOnline = rawItem.online === 'online' || rawItem.online === 'ack';
  
   let course = rawItem.course || rawItem.capteurInfo?.course || 0;
  
  // Si course = 0 ou undefined, essayer de calculer depuis la trajectoire
  if ((course === 0 || course === undefined || course === null) && rawItem.tail && rawItem.tail.length >= 2) {
    const calculatedCourse = calculateCourseFromTrajectory(rawItem.tail);
    if (calculatedCourse !== null && calculatedCourse > 0) {
      course = calculatedCourse;
    }
  }
  
  if ((course === 0 || course === undefined || course === null) && rawItem.lastKnownCourse) {
    course = rawItem.lastKnownCourse;
  }

  return {
    // Identifiants
    id: String(rawItem.id_bande_sortie || rawItem.id || Math.random()),
    vehicleId: rawItem.id,
    
    // Informations générales
    name: rawItem.nom || rawItem.name_capteur || rawItem.name || 'Sans nom',
    driver: `${rawItem.prenom_chauffeur || ''} ${rawItem.nom || ''}`.trim() || 'Non assigné',
    registration: rawItem.immatriculation || 'N/A',
    destination: rawItem.nom_destination || 'N/A',
    service: rawItem.nom_service || 'N/A',
    comment: rawItem.commentaire,
    
    // Statut
    status,
    isOnline,
    engineStatus: rawItem.engine_status || false,
    isSignalLost,
    
    // Position et mouvement
    lat: coords.lat,
    lng: coords.lng,
    speed: Math.round(speed),
    course: course,
    lastKnownCourse: course,
    
    // Trajectoire
    trajectory,
    
    // Distance
    totalDistance: totalDistance,
    
    // Stationnement
    stopDuration: stopDurationSec,
    stopDurationFormatted: formattedDuration.short,
    stopDurationFull: formattedDuration.full,
    stopDurationRaw: stopDurationRaw,
    
    // Métriques
    efficiency: efficiency,
    parkingScore: parkingScore,
    recommendation: recommendation,
    
    // Timestamps
    lastUpdate: rawItem.time || rawItem.capteurInfo?.time,
    startTime: rawItem.sortie_time,
    expectedReturn: rawItem.date_retour,
    movedTimestamp: rawItem.moved_timestamp || rawItem.capteurInfo?.moved_timestamp,
    
    // Adresse
    address: rawItem.capteurInfo?.address || rawItem.address,
    
    // Batterie et coupure
    batteryLevel: batteryLevel,
    isEngineCut: isEngineCut,
    
    // Destination (geofence)
    destinationLat: destinationCoords?.center?.[0],
    destinationLng: destinationCoords?.center?.[1],
    destinationPolygon: destinationCoords?.polygon,
    
    // Données brutes (pour debug)
    rawData: rawItem
  };
};