import { useCallback, useEffect, useState, useRef } from "react";
import { getPresenceDashboard, getPresenceDashboardParSite } from "../../../../services/presenceService";
import { notification } from "antd";

export const useDashboardPresence = (filters = null) => {
    const [data, setData] = useState({
        kpi: null,
        statuts: null,
        evolution: null,
        employes: null,
        topAbsences: null
    });

    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Utiliser une ref pour suivre les filtres sans causer de re-rendus
    const filtersRef = useRef(filters);
    
    // Mettre à jour la ref quand les filtres changent
    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    // Fonction load stable (ne change jamais)
    const load = useCallback(async (filtersData = null) => {
        setLoading(true);
        try {
            const [presentData, allData] = await Promise.all([
                getPresenceDashboard(filtersData),
                getPresenceDashboardParSite(filtersData)
            ]);

            setData(presentData?.data?.data || {
                kpi: null,
                statuts: null,
                evolution: null,
                employes: null,
                topAbsences: null
            });
            setSites(allData?.data?.data || []);

        } catch (error) {
            console.error("Erreur de chargement:", error);
            notification.error({
                message: "Erreur de chargement",
                description: "Impossible de récupérer les données du dashboard.",
                placement: "topRight"
            });
        } finally {
            setLoading(false);
        }
    }, []); // Dépendances vides = fonction stable

    // Effet pour charger les données quand les filtres changent
    useEffect(() => {
        load(filtersRef.current);
    }, [load, filters]); // load est stable, filters est la seule vraie dépendance

    // Version optimisée de reload qui utilise les filtres courants
    const reload = useCallback(() => {
        load(filtersRef.current);
    }, [load]); // load est stable

    return {
        data,
        sites,
        loading,
        reload
    };
};