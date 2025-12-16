import { useCallback, useEffect, useState } from "react";
import { notification } from "antd";
import { getRepGenerateur } from "../../../../../services/generateurService";

export const useReparationData = ( initialFilters = null) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(initialFilters);

    const load = useCallback(
        async (overrideFilters = undefined) => {
            const effective = overrideFilters ?? filters;
            setLoading(true);

            try {
                const res = await getRepGenerateur(effective);
                setData(res?.data || []);

            } catch (error) {
                notification.error({
                    message : "Erreur de changement",
                    description : "Impossible de récupérer les données générateurs",
                    placement: "topRight"
                })
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
    }
}