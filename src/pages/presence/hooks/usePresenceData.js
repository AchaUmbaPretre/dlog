import { useCallback, useEffect, useState } from "react";
import { notification } from "antd";
import { getPresence } from "../../../services/presenceService";

export const usePresenceData = (initialFilters = null) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(initialFilters);

    const load = useCallback(
        async (overrideFilters = undefined) => {
            const effective = overrideFilters ?? filters;
            setLoading(true);

            try {
                const res = await getPresence();
                setData(res?.data || []);
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Impossible de récupérer la liste de presence',
                    placement: "topRight"
                })
            } finally {
                setLoading(false)
            }
        },
        [filters]
    );

    useEffect(() => {
        load()
    }, [load]);

    return {
        data,
        setData,
        loading,
        reload: load
    };

}
