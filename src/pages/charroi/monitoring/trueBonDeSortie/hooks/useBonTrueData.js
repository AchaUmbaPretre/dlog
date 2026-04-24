// hooks/useBonTrueData.js
import { useEffect, useState, useCallback } from "react";
import { notification } from "antd";
import { getControles } from "../../../../../services/controleGpsService";

export const useBonTrueData = (autoRefresh = true, refreshInterval = 5000) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // ✅ CORRIGER : getControles retourne déjà les données directement
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
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                fetchData();
            }, refreshInterval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [fetchData, autoRefresh, refreshInterval]);

    return {
        data,
        loading,
        lastUpdate,
        fetchData,
    };
};