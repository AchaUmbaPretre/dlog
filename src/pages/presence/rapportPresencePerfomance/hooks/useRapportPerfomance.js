import { useCallback, useEffect, useState } from "react"
import { notifyWarning } from "../../../../utils/notifyWarning";
import { getPresenceDashboardPerformance } from "../../../../services/presenceService";

export const useRapportPerfomance = () => {
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(false)

    const load = useCallback(async() => {
        try {
            const res = await getPresenceDashboardPerformance();
            setData(res.data)

        } catch (error) {
            console.error("Erreur chargement planning", error);
            notifyWarning('Erreur chargement Performance', 'Chargement depuis le cache local…');      
        }
    },[]);

    useEffect(() => {
        load()
    }, [])

    return {
        data,
        loading,
        reload: load
    }
}