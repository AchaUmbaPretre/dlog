import { useEffect, useState, useCallback } from "react";
import { notification } from "antd";
import { getSite } from "../../../../services/charroiService";
import { getPresence } from "../../../../services/presenceService";
import moment from "moment";

export const usePresenceAllData = () => {
  const [presences, setPresences] = useState([]);
  const [sites, setSites] = useState([]);
  const [siteData, setSiteData] = useState(null);
  const [dateRange, setDateRange] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const [loading, setLoading] = useState(false);

  const showError = (message = "Une erreur est survenue lors du chargement des données.") => {
    notification.error({
      message: "Erreur de chargement",
      description: message,
    });
  };

  useEffect(() => {
    const loadSites = async () => {
      try {
        const res = await getSite();
        setSites(res?.data?.data ?? []);
      } catch {
        showError("Impossible de charger les sites");
      }
    };
    loadSites();
  }, []);

  const loadPresences = useCallback(async () => {
    if (!dateRange || dateRange.length !== 2) return; // sécurité
    setLoading(true);
    try {
      const res = await getPresence(dateRange, siteData);
      setPresences(res?.data ?? []);
    } catch {
      showError("Impossible de charger les présences");
    } finally {
      setLoading(false);
    }
  }, [dateRange, siteData]);

  useEffect(() => {
    loadPresences();
  }, [loadPresences]);

  return {
    presences,
    sites,
    loading,
    dateRange,
    setDateRange,
    siteData,
    setSiteData,
    reload: loadPresences
  };
};
