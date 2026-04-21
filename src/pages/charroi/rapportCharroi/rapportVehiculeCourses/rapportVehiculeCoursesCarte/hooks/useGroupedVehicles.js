import { useMemo } from 'react';

export const useGroupedVehicles = (vehicles, tolerance = 0.0001) => {
  return useMemo(() => {
    if (!vehicles || !vehicles.length) return [];
    
    const groups = [];
    const used = new Set();
    
    // Grouper les véhicules par proximité
    vehicles.forEach((vehicle, i) => {
      if (used.has(i)) return;
      
      const group = {
        center: [vehicle.lat, vehicle.lng],
        vehicles: [vehicle],
        indices: [i]
      };
      
      // Chercher les véhicules proches
      vehicles.forEach((otherVehicle, j) => {
        if (i !== j && !used.has(j)) {
          const distance = Math.hypot(
            vehicle.lat - otherVehicle.lat,
            vehicle.lng - otherVehicle.lng
          );
          
          if (distance < tolerance) {
            group.vehicles.push(otherVehicle);
            group.indices.push(j);
            used.add(j);
          }
        }
      });
      
      group.count = group.vehicles.length;
      group.isCluster = group.count > 1;
      
      groups.push(group);
      used.add(i);
    });
    
    return groups;
  }, [vehicles, tolerance]);
};