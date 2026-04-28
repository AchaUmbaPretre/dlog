import { useEffect, useState, useCallback } from "react";
import { notification } from "antd";
import { getControles } from "../../../../../services/controleGpsService";

export const useBonTrueData = (autoRefresh = true, refreshInterval = 5000) => {

    const [data, setData] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchData = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true); // 🔥 silent loading
            } else {
                setInitialLoading(true); // 🔥 first load only
            }

            const response = await getControles();
            setData(response.data.data || []);
            setLastUpdate(new Date());

        } catch (error) {
            console.error("Erreur chargement:", error);
            notification.error({
                message: "Erreur de chargement",
                description: "Une erreur est survenue lors du chargement des données.",
            });
        } finally {
            setInitialLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData(false); // initial load

        let interval;

        if (autoRefresh) {
            interval = setInterval(() => {
                fetchData(true); // 🔥 silent refresh
            }, refreshInterval);
        }

        return () => clearInterval(interval);
    }, [fetchData, autoRefresh, refreshInterval]);

    return {
        data,
        loading: initialLoading,
        refreshing,                  
        lastUpdate,
        fetchData,
    };
};