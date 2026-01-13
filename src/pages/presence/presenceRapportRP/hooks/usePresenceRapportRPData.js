import { useEffect, useState, useCallback } from "react";
import { getPresenceRetardPonctualite } from "../../../../services/presenceService";

export const usePresenceRapportRPData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPresenceRetardPonctualite(dateRange);
      setData(res.data.data || []);
    } catch (error) {
      console.error("Erreur chargement retard & ponctualité", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    reload: load,
    dateRange,
    setDateRange
  };
};
