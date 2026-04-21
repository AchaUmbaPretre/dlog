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