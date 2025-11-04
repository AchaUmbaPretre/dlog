import dayjs from "dayjs";

//Formate la durée en h / min / sec
const formatDuration = (minutes = 0, seconds = 0) => {
  const totalSeconds = minutes * 60 + seconds;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h > 0 ? h + "h " : ""}${m}min ${s}sec`;
};

// Calcul de distance entre deux points GPS (km)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const toRad = angle => (angle * Math.PI) / 180;
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calcule le temps passé dans chaque zone pour chaque véhicule
export const calculateZoneDurations = (eventsData) => {
  if (!eventsData || eventsData.length === 0) return [];

  const sorted = [...eventsData].sort(
    (a, b) =>
      dayjs(a.time, "DD-MM-YYYY HH:mm:ss").valueOf() -
      dayjs(b.time, "DD-MM-YYYY HH:mm:ss").valueOf()
  );

  const results = [];
  const entryStack = {};
  const lastDataByVehicle = {}; // { sortie, lat, lng, zone }

  for (const e of sorted) {
    const zone = e.detail || e?.additional?.geofence || "N/A";
    const key = `${e.device_name}_${zone}`;

    if (e.type === "zone_in") {
      const lastData = lastDataByVehicle[e.device_name];
      let durationSinceLastZone = null;
      let distance_km = 0;
      let vitesse_moyenne = 0;

      if (lastData) {
        const tPrev = dayjs(lastData.sortie, "DD-MM-YYYY HH:mm:ss");
        const tCurrent = dayjs(e.time, "DD-MM-YYYY HH:mm:ss");
        const diffMs = tCurrent.diff(tPrev);
        const diffMin = Math.floor(diffMs / 60000);
        const diffSec = Math.floor((diffMs % 60000) / 1000);
        durationSinceLastZone = formatDuration(diffMin, diffSec);

        // Distance et vitesse
        distance_km = haversineDistance(lastData.lat, lastData.lng, e.latitude, e.longitude);
        const dureeHours = tCurrent.diff(tPrev, 'hour', true) || 0.01; // éviter division par 0
        vitesse_moyenne = distance_km / dureeHours;
      }

      entryStack[key] = { ...e, durationSinceLastZone, distance_km, vitesse_moyenne };
    } else if (e.type === "zone_out" && entryStack[key]) {
      const entryEvent = entryStack[key];
      const t1 = dayjs(entryEvent.time, "DD-MM-YYYY HH:mm:ss");
      const t2 = dayjs(e.time, "DD-MM-YYYY HH:mm:ss");
      const diffMs = t2.diff(t1);

      if (diffMs > 0) {
        const diffMin = Math.floor(diffMs / 60000);
        const diffSec = Math.floor((diffMs % 60000) / 1000);

        results.push({
          vehicule: e.device_name,
          device_id: e.device_id,
          zone,
          entree: entryEvent.time,
          sortie: e.time,
          duree_text: formatDuration(diffMin, diffSec),
          duree_minutes: diffMin,
          duree_secondes: diffSec,
          duree_depuis_zone_precedente: entryEvent.durationSinceLastZone || "N/A",
          latitude: e.latitude,
          longitude: e.longitude,
          distance_km: Number((entryEvent.distance_km || 0).toFixed(2)),
          vitesse_moyenne: Number((entryEvent.vitesse_moyenne || 0).toFixed(2)),
        });
      }

      lastDataByVehicle[e.device_name] = { sortie: e.time, lat: e.latitude, lng: e.longitude, zone };
      delete entryStack[key];
    }
  }

  // Traiter les entrées en cours
  for (const key in entryStack) {
    const e = entryStack[key];
    const t1 = dayjs(e.time, "DD-MM-YYYY HH:mm:ss");
    const t2 = dayjs();
    const diffMs = t2.diff(t1);
    const diffMin = Math.floor(diffMs / 60000);
    const diffSec = Math.floor((diffMs % 60000) / 1000);

    results.push({
      vehicule: e.device_name,
      device_id: e.device_id,
      zone: e.detail || e?.additional?.geofence || "N/A",
      entree: e.time,
      sortie: null,
      duree_text: formatDuration(diffMin, diffSec),
      duree_minutes: diffMin,
      duree_secondes: diffSec,
      duree_depuis_zone_precedente: e.durationSinceLastZone || "N/A",
      latitude: e.latitude,
      longitude: e.longitude,
      distance_km: Number((e.distance_km || 0).toFixed(2)),
      vitesse_moyenne: Number((e.vitesse_moyenne || 0).toFixed(2)),
    });
  }

  return results;
};
