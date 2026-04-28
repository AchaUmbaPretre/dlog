// hooks/useVehicleData.js
import { useMemo } from 'react';
import { transformToVehicle } from '../utils/vehicle.utils';

export const useVehicleData = (mergedCourses) => {
  return useMemo(() => {
    if (!mergedCourses || !Array.isArray(mergedCourses)) return [];

    const vehicles = mergedCourses
      .map(item => {
        const vehicle = transformToVehicle(item);
        if (vehicle) {
          vehicle.rawData = item;
          vehicle.address = item.capteurInfo?.address || item.address;
        }
        return vehicle;
      })
      .filter(vehicle => vehicle !== null);

    return vehicles;
  }, [mergedCourses]);
};