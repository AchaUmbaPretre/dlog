import dayjs from "dayjs";

export const calculateZoneDurations = (eventsData) => {
  if (!eventsData || eventsData.length === 0) return { details: [], resume: [] };

  // 🔹 Trier les événements chronologiquement
  const sorted = [...eventsData].sort(
    (a, b) =>
      dayjs(a.time, "DD-MM-YYYY HH:mm:ss").valueOf() -
      dayjs(b.time, "DD-MM-YYYY HH:mm:ss").valueOf()
  );

  const results = [];
  const entryStack = {}; // stocke les entrées actives { vehicule_zone_key: event }

  for (const e of sorted) {
    const zone = e.detail || e?.additional?.geofence || "N/A";
    const key = `${e.device_name}_${zone}`;

    if (e.type === "zone_in") {
      // Enregistrer la dernière entrée
      entryStack[key] = e;
    } else if (e.type === "zone_out" && entryStack[key]) {
      // Trouver l'entrée correspondante
      const entryEvent = entryStack[key];
      const t1 = dayjs(entryEvent.time, "DD-MM-YYYY HH:mm:ss");
      const t2 = dayjs(e.time, "DD-MM-YYYY HH:mm:ss");
      const diffMs = t2.diff(t1);

      if (diffMs > 0) {
        const diffMin = Math.floor(diffMs / 60000);
        const diffSec = Math.floor((diffMs % 60000) / 1000);

        results.push({
          vehicule: e.device_name,
          zone,
          entree: entryEvent.time,
          sortie: e.time,
          duree_text: `${diffMin} min ${diffSec} sec`,
          duree_minutes: diffMin,
        });
      }

      // Supprimer cette entrée (paire trouvée)
      delete entryStack[key];
    }
  }

  // 🔸 Ajouter les entrées encore en cours (pas encore sorties)
  for (const key in entryStack) {
    const e = entryStack[key];
    results.push({
      vehicule: e.device_name,
      zone: e.detail || e?.additional?.geofence || "N/A",
      entree: e.time,
      sortie: null,
      duree_text: null,
      duree_minutes: null,
    });
  }

  // 🔹 Créer un résumé global par véhicule + zone
  const summary = {};
  for (const r of results) {
    if (r.duree_minutes != null) {
      const key = `${r.vehicule}_${r.zone}`;
      if (!summary[key]) {
        summary[key] = {
          vehicule: r.vehicule,
          zone: r.zone,
          total_minutes: 0,
          total_durees: [],
        };
      }
      summary[key].total_minutes += r.duree_minutes;
      summary[key].total_durees.push(r.duree_text);
    }
  }

  // 🔸 Formater le résumé
  const resume = Object.values(summary).map((s) => {
    const heures = Math.floor(s.total_minutes / 60);
    const minutes = s.total_minutes % 60;
    return {
      vehicule: s.vehicule,
      zone: s.zone,
      total_minutes: s.total_minutes,
      total_heures: heures > 0 ? `${heures}h ${minutes}min` : `${minutes}min`,
      passages: s.total_durees.length,
    };
  });

  return { details: results, resume };
};
