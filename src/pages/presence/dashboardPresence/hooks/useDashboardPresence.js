import { useCallback, useEffect, useState } from "react"
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

    const load = useCallback(async (filtersData = null) => {
        setLoading(true);
        try {
            // Passez les filtres aux services
            const [presentData, allData] = await Promise.all([
                getPresenceDashboard(filtersData), // Modifiez votre service pour accepter les filtres
                getPresenceDashboardParSite(filtersData) // Modifiez votre service pour accepter les filtres
            ]);

            setData(presentData?.data?.data);
            setSites(allData?.data?.data);

        } catch (error) {
            notification.error({
                message: "Erreur de chargement",
                description: "Impossible de récupérer les données du dashboard.",
                placement: "topRight"
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load(filters);
    }, [load, filters]); // Recharge quand les filtres changent

    return {
        data,
        sites,
        loading,
        reload: load
    };
};