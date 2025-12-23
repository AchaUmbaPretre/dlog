import { useCallback, useEffect, useState } from "react";
import { notification } from "antd";
import { getReconciliation, getSmr } from "../../../../../services/sortieEamFmp";

export const useReconciliationData = (initialFilters = null) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(initialFilters);
    const [smr, setSmr] = useState([]);
    const [selectedSmr, setSelectedSmr] = useState([]);

    const load = useCallback(
        async (overrideFilters = undefined) => {
            const effective = overrideFilters ?? filters;
            setLoading(true);

            try {
                const res = await getReconciliation(effective);
                setData(res?.data || []);
            } catch (err) {
                notification.error({
                    message: "Erreur de chargement",
                    description: "Impossible de récupérer les données de sortie EAM.",
                    placement: "topRight",
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

    useEffect(()=> {
        try {
            const { data } = getSmr();
            setSmr(data)
        } catch (error) {
            notification.error({
                message: "Erreur de chargement",
                description: "Impossible de récupérer les données de SMR.",
                placement: "topRight",
            })
        }
    }, [])

    return {
        data, 
        setData,
        loading,
        reload: load,
        filters,
        setFilters,
        smr,
        setSmr,
        setSelectedSmr
    };
}