import { useEffect, useState, useCallback } from "react";
import { getPresenceRapport } from "../../../../services/presenceService";
import dayjs from "dayjs";

export const usePresenceReport = (initialPeriod) => {
  const today = dayjs();

  // Si initialPeriod est null, on prend le mois courant
  const defaultPeriod = initialPeriod || { 
    startDate: today.startOf('month').format('YYYY-MM-DD'),
    endDate: today.endOf('month').format('YYYY-MM-DD')
  };

  const [dateRange, setDateRange] = useState(defaultPeriod);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    setLoading(true);
    try {
      const res = await getPresenceRapport(dateRange);
      setData(res.data);
    } catch (error) {
      console.error("Erreur chargement rapport", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, setData, loading, reload: load, dateRange, setDateRange };
};
