import { useMemo } from 'react';

export const useGroupedVehicles = (vehicles) => {
  return useMemo(() => {
    // Grouper les véhicules par position (tolérance de 0.0001 degrés ~ 10m)
    const groups = new Map();
    
    vehicles.forEach(vehicle => {
      let found = false;
      
      // Chercher un groupe existant à proximité
      for (const [key, group] of groups.entries()) {
        const [lat, lng] = key.split(',').map(Number);
        const distance = Math.hypot(lat - vehicle.lat, lng - vehicle.lng);
        
        if (distance < 0.0001) { // Moins de 10 mètres
          group.vehicles.push(vehicle);
          group.positions.push([vehicle.lat, vehicle.lng]);
          found = true;
          break;
        }
      }
      
      if (!found) {
        groups.set(`${vehicle.lat},${vehicle.lng}`, {
          center: [vehicle.lat, vehicle.lng],
          vehicles: [vehicle],
          positions: [[vehicle.lat, vehicle.lng]]
        });
      }
    });
    
    // Transformer en tableau
    const grouped = Array.from(groups.values()).map(group => ({
      ...group,
      count: group.vehicles.length,
      isCluster: group.vehicles.length > 1
    }));
    
    console.log(`📊 Regroupement: ${vehicles.length} véhicules → ${grouped.length} positions`);
    grouped.forEach(group => {
      if (group.isCluster) {
        console.log(`   📍 ${group.count} véhicules au même endroit`);
      }
    });
    
    return grouped;
  }, [vehicles]);
};
