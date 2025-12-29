import { useCallback, useEffect, useState } from "react";
import { notification } from "antd";
import { getPartItem, getReconciliation, getSmr } from "../../../../../services/sortieEamFmp";

export const useReconciliationData = (initialFilters = null) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(initialFilters);
    const [smrs, setSmrs] = useState([]);
    const [selectedSmr, setSelectedSmr] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [dateRange, setDateRange] = useState(null);

    const load = useCallback(
        async (overrideFilters) => {
            const effectiveFilters = overrideFilters ?? selectedSmr;
            setLoading(true);

            try {
                const res = await getReconciliation(effectiveFilters);
                setData(res?.data ?? []);
            } catch (error) {
                notification.error({
                    message: "Erreur de chargement",
                    description: "Impossible de récupérer les données de réconciliation",
                    placement: "topRight",
                });
            } finally {
                setLoading(false);
            }
        },
        [selectedSmr, selectedItems, dateRange]
    );

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        const loadSmrs = async () => {
            try {
                const res = await getSmr();
                setSmrs(res?.data ?? []);
            } catch (error) {
                notification.error({
                    message: "Erreur de chargement",
                    description: "Impossible de récupérer les données de SMR.",
                    placement: "topRight",
                });
            }
        };

        loadSmrs();
    }, []);

    useEffect(() => {
        const loadItem = async () => {
            try {
                const res = await getPartItem();
                setItems(res?.data ?? []);
            } catch (error) {
                notification.error({
                    message: "Erreur de chargement",
                    description: "Impossible de récupérer les données d'Item.",
                    placement: "topRight",
                });
            }
        };

        loadItem();
    }, []);

    return {
        data,
        setData,
        loading,
        reload: load,
        filters,
        setFilters,
        smrs,
        selectedSmr,
        setSelectedSmr,
        items, 
        setItems,
        selectedItems, 
        setSelectedItems,
        dateRange, 
        setDateRange
    };
};
