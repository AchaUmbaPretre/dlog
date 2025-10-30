// --- Zone de geofencing (ex: Kinshasa) ---
export const zoneAutorisee = {
  latMin: -4.6,
  latMax: -4.3,
  lngMin: 15.1,
  lngMax: 15.5,
};

export const getOdometer = (sensors = []) => {
  const odo = sensors.find((s) => s.type === "odometer");
  if (!odo) return null;

  // retirer " km" et convertir en nombre
  const kmString = odo.value || odo.val || "";
  const kmNumber = parseFloat(kmString.replace(/\s?km/i, '').replace(/,/g, ''));
  
  return isNaN(kmNumber) ? null : kmNumber;
};


export const getEngineStatus = (sensors = []) => {
    const Contact = sensors.find((s) => s.type === "acc");
    return Contact?.value === "On" ? "ON" : "OFF";
  };

export const getBatteryLevel = (sensors = []) => {
  const battery = sensors.find((s) => s.type === "battery");
  return battery ? battery.value : null;
};
