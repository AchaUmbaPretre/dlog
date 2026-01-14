import { useEffect, useState, useCallback } from "react";
import { getPresencePlanning } from "../../../services/presenceService";
import { useSelector } from "react-redux";

export const usePresenceData = (initialPeriod) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(initialPeriod); 
  const { id_utilisateur, role, scope_sites, scope_departments } = useSelector((state) => state.user?.currentUser);


  const load = useCallback(async () => {
    setLoading(true);
    try {
        const all = {
            user_id: id_utilisateur,
            role, 
            scope_sites, 
            scope_departments,
            ...dateRange
        }
      const res = await getPresencePlanning(all);
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
