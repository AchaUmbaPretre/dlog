import { useEffect, useState, useCallback } from "react";
import { getPresenceRapport } from "../../../../services/presenceService";
import dayjs from "dayjs";
import { getSite } from "../../../../services/charroiService";
import { notification } from "antd";

export const usePresenceReport = () => {
  const today = dayjs();

  // Période par défaut = mois courant
  const defaultPeriod = { month: today.month() + 1, year: today.year() };

  const [monthRange, setMonthRange] = useState(defaultPeriod);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [site, setSite] = useState([]);
  const [siteData, setSiteData] = useState([]);

  const load = useCallback(async () => {
    if (!monthRange?.month || !monthRange?.year) return;

    setLoading(true);
    try {
      const res = await getPresenceRapport({
        month: monthRange.month,
        year: monthRange.year,
        site : siteData
      });
      setData(res.data);
    } catch (err) {
      console.error("Erreur chargement rapport", err);
    } finally {
      setLoading(false);
    }
  }, [monthRange, siteData]);

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

  // Recharge à chaque changement de monthRange
  useEffect(() => {
    load();
    fetchData()
  }, [load]);

  return { site, setSiteData, data, loading, monthRange, setMonthRange, reload: load };
};
