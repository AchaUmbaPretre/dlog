import { useEffect, useState, useCallback } from "react";
import { notification } from "antd";
import { getRapportPresenceSite } from "../../../../services/presenceService";

export const useRapportPresenceSite = (dateRange) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return;

    setLoading(true);

    try {
      const date_debut = dateRange[0].format("YYYY-MM-DD");
      const date_fin = dateRange[1].format("YYYY-MM-DD");

      const res = await getRapportPresenceSite(date_debut, date_fin);
      setData(res.data);
    } catch (error) {
      notification.error({
        message: "Erreur",
        description: "Chargement des données impossible.",
      });
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, reload: load };
};
