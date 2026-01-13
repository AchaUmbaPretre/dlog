import { useEffect, useState, useCallback } from "react";
import { getPresenceRapport } from "../../../../services/presenceService";
import dayjs from "dayjs";

export const usePresenceReport = () => {
  const today = dayjs();

  // Période par défaut = mois courant
  const defaultPeriod = { month: today.month() + 1, year: today.year() };

  const [monthRange, setMonthRange] = useState(defaultPeriod);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!monthRange?.month || !monthRange?.year) return;

    setLoading(true);
    try {
      const res = await getPresenceRapport({
        month: monthRange.month,
        year: monthRange.year
      });
      setData(res.data);
    } catch (err) {
      console.error("Erreur chargement rapport", err);
    } finally {
      setLoading(false);
    }
  }, [monthRange]);

  // Recharge à chaque changement de monthRange
  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, monthRange, setMonthRange, reload: load };
};
