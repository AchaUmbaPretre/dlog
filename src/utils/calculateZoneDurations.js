import dayjs from "dayjs";

// 🧩 Formate la durée en h / min / sec
const formatDuration = (minutes, seconds) => {
  if (minutes < 60) return `${minutes} min ${seconds} sec`;

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m} min ${seconds} sec`;
};

// 🧩 Calcule le temps passé dans chaque zone pour chaque véhicule
export const calculateZoneDurations = (eventsData) => {
  if (!eventsData || eventsData.length === 0) return { details: [], resume: [] };

  // Tri par date croissante
  const sorted = [...eventsData].sort(
    (a, b) =>
      dayjs(a.time, "DD-MM-YYYY HH:mm:ss").valueOf() -
      dayjs(b.time, "DD-MM-YYYY HH:mm:ss").valueOf()
  );

  const results = [];
  const entryStack = {};

  for (const e of sorted) {
    const zone = e.detail || e?.additional?.geofence || "N/A";
    const key = `${e.device_name}_${zone}`;

    if (e.type === "zone_in") entryStack[key] = e;
    else if (e.type === "zone_out" && entryStack[key]) {
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
          latitude: e.latitude,
          longitude: e.longitude,
        });
      }

      delete entryStack[key];
    }
  }

  // Ajouter les entrées sans sortie
  for (const key in entryStack) {
    const e = entryStack[key];
    results.push({
      vehicule: e.device_name,
      device_id: e.device_id,
      zone: e.detail || e?.additional?.geofence || "N/A",
      entree: e.time,
      sortie: null,
      duree_text: null,
      duree_minutes: null,
      duree_secondes: null,
      latitude: e.latitude,
      longitude: e.longitude,
    });
  }

  // Résumé global par véhicule / zone
  const summary = {};
  for (const r of results) {
    if (r.duree_minutes != null) {
      const key = `${r.vehicule}_${r.zone}`;
      if (!summary[key])
        summary[key] = {
          vehicule: r.vehicule,
          device_id: r.device_id,
          zone: r.zone,
          total_minutes: 0,
          total_secondes: 0,
        };
      summary[key].total_minutes += r.duree_minutes;
      summary[key].total_secondes += r.duree_secondes;
    }
  }

  const resume = Object.values(summary).map((s) => {
    const extraMinutes = Math.floor(s.total_secondes / 60);
    const secondesRestantes = s.total_secondes % 60;
    const totalMinutes = s.total_minutes + extraMinutes;

    return {
      vehicule: s.vehicule,
      device_id: s.device_id,
      zone: s.zone,
      total_minutes: totalMinutes,
      total_duree_text: formatDuration(totalMinutes, secondesRestantes),
    };
  });

  return { details: results, resume };
};
