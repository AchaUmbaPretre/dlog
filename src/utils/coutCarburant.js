/**
 * Calcule la consommation et le coût du carburant
 * @param {Object} vehicleData - Données du véhicule
 * @param {string} vehicleData.distance_sum - Distance au format "X Km"
 * @param {Object} vehicleData.device - Infos du device
 * @param {string|number} vehicleData.device.fuel_per_km - Conso en L/km
 * @param {string|number} [vehicleData.device.fuel_price] - Prix du litre
 * @returns {{distance: number, consumption: number, cost: number}} Résultats
 */
export const calculateFuelConsumption = (vehicleData) => {
  if (!vehicleData || !vehicleData.distance_sum || !vehicleData.device) {
    return { distance: 0, consumption: 0, cost: 0 };
  }

  // ✅ Extraction et parsing des valeurs
  const distanceKm = parseFloat(
    String(vehicleData.distance_sum).replace(" Km", "").trim()
  ) || 0;

  const fuelPerKm = parseFloat(vehicleData.device.fuel_per_km) || 0;
  const fuelPrice = parseFloat(vehicleData.device.fuel_price) || 0;

  // ✅ Calcul
  const consumption = distanceKm * fuelPerKm;
  const cost = consumption * fuelPrice;

  return {
    distance: distanceKm,
    consumption: Number(consumption.toFixed(4)), // L
    cost: Number(cost.toFixed(2)) // unité monétaire
  };
}

