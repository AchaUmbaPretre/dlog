import { useCallback, useEffect, useState } from "react";
import { getGenerateur } from "../../../../../services/generateurService";
import { getFournisseur } from "../../../../../services/fournisseurService";
import { getStatutVehicule } from "../../../../../services/charroiService";


export function useReparateurGenLoader() {
    const [loading, setLoading] = useState({ lists: false});
    const [lists, setLists] = useState({ generateurs: [], fournisseurs: [], statutVehicules:[] });
    const [error, setError] = useState(null);
    
    const loadLists = useCallback(async () => {
        setLoading(l => ({ ...l, lists: true}));
        try {
            const [ geneData, fourniData, statusData ] = await Promise.all([
                getGenerateur(),
                getFournisseur(),
                getStatutVehicule()
            ])

            setLists({
                generateurs: geneData?.data || [],
                fournisseurs: fourniData?.data || [],
                statutVehicules: statusData?.data || []
            })
        } catch (err) {
            console.error('useRepGenerateurLoaders.loadLists', err);
            setError(err);
        } finally {
            setLoading(l => ({ ...l, lists: false }));
        }
    }, []);

    useEffect(() => {
        loadLists();
    }, [loadLists]);

    return {
        loading,
        lists,
        error,
        reload : () => {
            loadLists();
        }
    };
}