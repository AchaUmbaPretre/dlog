import { useMemo } from 'react';
import L from 'leaflet';

export const useMapBounds = (vehicles) => {
  return useMemo(() => {
    if (!vehicles.length) return null;
    
    const allPoints = vehicles.flatMap(vehicle => [
      [vehicle.lat, vehicle.lng],
      ...vehicle.trajectory
    ]);
    
    if (!allPoints.length) return null;
    
    try {
      const bounds = L.latLngBounds(allPoints);
      return bounds.isValid() ? bounds : null;
    } catch (error) {
      console.error('Erreur calcul bounds:', error);
      return null;
    }
  }, [vehicles]);
};
