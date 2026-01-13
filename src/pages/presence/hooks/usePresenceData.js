import { useEffect, useState, useCallback } from "react";
import { getPresencePlanning } from "../../../services/presenceService";

export const usePresenceData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPresencePlanning();
      setData(res.data);
    } catch (error) {
      console.error("Erreur chargement planning", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    setData,
    loading,
    reload: load
  };
};
