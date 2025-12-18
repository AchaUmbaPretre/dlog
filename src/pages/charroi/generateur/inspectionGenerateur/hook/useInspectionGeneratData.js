import { use, useCallback, useEffect } from "react";
import { useState } from "react";
import { getInspectGenerateur } from "../../../../../services/generateurService";
import { notification } from "antd";

export const useInspectionGeneratData = (initialFilters = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const load = useCallback(
    async (overrideFilters = undefined) => {
        const effective = overrideFilters ?? filters;
        setLoading(true);

        try {
            const res = await getInspectGenerateur(effective);
            setData(res?.data || []);

        } catch (error) {
            notification.error({
                message: "Erreur de chargement",
                description: "Impossible de récupérer les données carburant.",
                placement: "topRight",
            });
        } finally {
            setLoading(false);
        }
    },
    [filters]
  );

    useEffect(() => {
      load();
    }, [load]);

    return {
        data,
        setData,
        loading,
        reload: load,
        filters,
        setFilters
    };
}