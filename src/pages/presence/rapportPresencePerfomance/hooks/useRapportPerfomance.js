import { useCallback, useEffect } from "react"
import { notifyWarning } from "../../../../utils/notifyWarning";

export const useRapportPerfomance = () => {
    const load = useCallback(async() => {
        try {
            
        } catch (error) {
            console.error("Erreur chargement planning", error);
            notifyWarning('Erreur chargement Performance', 'Chargement depuis le cache local…');      
        }
    },[]);

    useEffect(() => {
        load()
    }, [])

}