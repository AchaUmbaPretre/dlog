export const isValidCoordinate = (lat, lng) => {
  if (lat === undefined || lng === undefined || lat === null || lng === null) return false;
  
  const numLat = typeof lat === 'number' ? lat : parseFloat(lat);
  const numLng = typeof lng === 'number' ? lng : parseFloat(lng);
  
  if (isNaN(numLat) || isNaN(numLng)) return false;
  
  return numLat >= -90 && numLat <= 90 && numLng >= -180 && numLng <= 180;
};

export const parseCoordinate = (value) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
};

// utils/destination.utils.js

export const parseDestinationCoordinates = (coordinatesStr) => {
  if (!coordinatesStr) return null;
  try {
    const coords = JSON.parse(coordinatesStr);
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
    return null;
  }
};