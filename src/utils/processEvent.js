import dayjs from "dayjs";

/**
 * Calcule le dernier état de chaque véhicule avec la durée depuis ce changement.
 */
export const processEvents = (eventsData) => {
  if (!Array.isArray(eventsData) || eventsData.length === 0) return [];

  const grouped = {};

  // 1️⃣ Regrouper par device_id
  for (const e of eventsData) {
    if (!grouped[e.device_id]) grouped[e.device_id] = [];
    grouped[e.device_id].push(e);
  }

  const result = [];

  // 2️⃣ Parcourir chaque groupe (véhicule)
  Object.keys(grouped).forEach((deviceId) => {
    const events = grouped[deviceId]
      .filter((ev) => !!ev.time)
      .sort(
        (a, b) =>
          dayjs(a.time, "DD-MM-YYYY HH:mm:ss").unix() -
          dayjs(b.time, "DD-MM-YYYY HH:mm:ss").unix()
      );

    const last = events[events.length - 1];
    const lastTime = dayjs(last.time, "DD-MM-YYYY HH:mm:ss");
    const now = dayjs();

    const diffMinutes = now.diff(lastTime, "minute");

    // Convertir en format lisible
    let duration = "";
    if (diffMinutes >= 60) {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      duration = `${hours}h ${minutes}min`;
    } else {
      duration = `${diffMinutes} min`;
    }

    result.push({
      device_id: deviceId,
      device_name: last.device_name,
      message: last.message || last.name,
      event_type: last.type,
      time: last.time,
      duration_since_last_change: duration,
    });
  });

  return result;
};
