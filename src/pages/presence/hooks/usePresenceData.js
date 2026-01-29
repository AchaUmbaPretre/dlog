import { useEffect, useState, useCallback } from "react";
import { getPresencePlanning } from "../../../services/presenceService";
import { useSelector } from "react-redux";
import { notifyWarning } from "../../../utils/notifyWarning";

export const usePresenceData = (initialPeriod) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(initialPeriod); 
  const { id_utilisateur, role, scope_sites, scope_departments } = useSelector((state) => state.user?.currentUser);

  const CACHE_KEY = 'presenceCache';

  const loadFromCache = useCallback(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
    return null;
  }, []);

  const saveToCache = useCallback((data) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  }, []);

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
      saveToCache(res.data);
    } catch (error) {
      console.error("Erreur chargement planning", error);
      notifyWarning('Erreur chargement planning', 'Chargement depuis le cache local…');
      
      const cached = loadFromCache();
      if(cached) setData(cached);
    } finally {
      setLoading(false);
    }
  }, [dateRange, loadFromCache, saveToCache]);

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
