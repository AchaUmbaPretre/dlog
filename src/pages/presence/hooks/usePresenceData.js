import { useEffect, useState, useCallback } from "react";
import { getPresencePlanning } from "../../../services/presenceService";

export const usePresenceData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null); 

  console.log(dateRange)
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPresencePlanning(dateRange);
      setData(res.data);
    } catch (error) {
      console.error("Erreur chargement planning", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    setData,
    loading,
    reload: load,
    dateRange,
    setDateRange
  };
};
