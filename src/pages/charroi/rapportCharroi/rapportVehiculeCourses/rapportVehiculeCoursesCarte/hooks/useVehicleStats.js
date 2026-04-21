import { useMemo } from 'react';

export const useVehicleStats = (vehicles) => {
  return useMemo(() => {
    const total = vehicles.length;
    const moving = vehicles.filter(v => v.status === 'moving').length;
    const stopped = vehicles.filter(v => v.status === 'stopped').length;
    const totalDistance = vehicles.reduce((sum, v) => sum + v.totalDistance, 0);
    const avgEfficiency = vehicles.reduce((sum, v) => sum + v.efficiency, 0) / total || 0;
    
    return {
      total,
      moving,
      stopped,
      totalDistance: totalDistance.toFixed(1),
      avgEfficiency: Math.round(avgEfficiency),
      movingPercentage: total ? Math.round((moving / total) * 100) : 0
    };
  }, [vehicles]);
};