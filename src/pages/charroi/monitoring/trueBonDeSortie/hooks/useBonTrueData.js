import { useEffect, useState, useCallback } from "react";
import { message, notification } from "antd";
import { getBandeSortie } from "../../../../../services/charroiService";

export const useBonTrueData = (userId, initialFilters = null) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async() => {
        setLoading(true);
        try {
            const { data } = await getBandeSortie(userId);
            setData(data);
        } catch (error) {
            notification.error({
                message: "Erreur de chargement",
                description:
                "Une erreur est survenue lors du chargement des données.",
            });
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const silentFetch = useCallback(async () => {
        try {
        const { data } = await getBandeSortie(userId);
        setData(data);
        } catch (error) {
        console.error("Erreur refresh automatique :", error);
        }
    }, [userId]);

      useEffect(() => {
    if (!userId) return;

    fetchData();

    const interval = setInterval(() => {
      silentFetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId, fetchData, silentFetch]);

    return {
        data,
        loading,
        fetchData,
    }
}