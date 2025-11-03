import dayjs from "dayjs";

// 🧩 Formate la durée en h / min / sec
const formatDuration = (minutes = 0, seconds = 0) => {
  const totalSeconds = minutes * 60 + seconds;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h > 0 ? h + "h " : ""}${m}min ${s}sec`;
};

// 🧩 Calcule le temps passé dans chaque zone pour chaque véhicule
export const calculateZoneDurations = (eventsData) => {
  if (!eventsData || eventsData.length === 0) return { details: [], resume: [] };

  const sorted = [...eventsData].sort(
    (a, b) =>
      dayjs(a.time, "DD-MM-YYYY HH:mm:ss").valueOf() -
      dayjs(b.time, "DD-MM-YYYY HH:mm:ss").valueOf()
  );

  const results = [];
  const entryStack = {};
  const lastExit = {}; // Pour stocker la dernière sortie par véhicule

  for (const e of sorted) {
    const zone = e.detail || e?.additional?.geofence || "N/A";
    const key = `${e.device_name}_${zone}`;

    if (e.type === "zone_in") {
      // Calcul de la durée depuis la dernière sortie
      const lastExitTime = lastExit[e.device_name];
      let durationSinceLastZone = null;
      if (lastExitTime) {
        const tPrev = dayjs(lastExitTime, "DD-MM-YYYY HH:mm:ss");
        const tCurrent = dayjs(e.time, "DD-MM-YYYY HH:mm:ss");
        const diffMs = tCurrent.diff(tPrev);
        const diffMin = Math.floor(diffMs / 60000);
        const diffSec = Math.floor((diffMs % 60000) / 1000);
        durationSinceLastZone = formatDuration(diffMin, diffSec);
      }

      entryStack[key] = { ...e, durationSinceLastZone };
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
        });
      }

      lastExit[e.device_name] = e.time; // Mettre à jour la dernière sortie
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
    });
  }

  return results;
};
