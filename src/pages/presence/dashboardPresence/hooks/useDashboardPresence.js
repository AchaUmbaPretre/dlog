import { useCallback, useEffect, useState } from "react"
import { getPresenceDashboard, getPresenceDashboardParSite } from "../../../../services/presenceService";
import { notification } from "antd";


export const useDashboardPresence = () => {
    const [data, setData] = useState({
        kpi: null,
        statuts: null,
        evolution: null,
        employes: null,
        topAbsences: null
    });

    const [sites, setSites] = useState([]);

    const load = useCallback(async () => {
    try {
      const [presentData, allData] = await Promise.all([
        getPresenceDashboard(),
        getPresenceDashboardParSite()
      ]);

      setData(presentData?.data?.data);
      setSites(allData?.data?.data);

    } catch (error) {
      notification.error({
        message: "Erreur de chargement",
        description: "Impossible de récupérer les données du dashboard.",
        placement: "topRight"
      });
    }
    }, [])

    useEffect(() => {
        load()
    }, [])

    return {
        data,
        sites,
        reload : load
    }
}