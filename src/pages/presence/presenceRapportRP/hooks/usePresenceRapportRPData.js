import { useEffect, useState, useCallback } from "react";
import { getPresenceRetardPonctualite } from "../../../../services/presenceService";
import { notification } from "antd";
import { getSite, getSiteUser } from "../../../../services/charroiService";

export const usePresenceRapportRPData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [site, setSite] = useState([]);
  const [siteData, setSiteData] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPresenceRetardPonctualite(dateRange, siteData);
      setData(res.data.data || []);
    } catch (error) {
      console.error("Erreur chargement retard & ponctualité", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, siteData]);

      const fetchData = async () => {
        try {
          const res = await getSite();
          setSite(res?.data.data);
          setLoading(false);
        } catch (error) {
          notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
          });
          setLoading(false);
        }
      };
  

  useEffect(() => {
    load();
    fetchData()
  }, [load]);

  return {
    site,
    setSiteData,
    data,
    loading,
    reload: load,
    dateRange,
    setDateRange
  };
};
