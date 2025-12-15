import { useCallback, useEffect, useState } from "react";
import { getGenerateur } from "../../../../../services/generateurService";
import { getFournisseur } from "../../../../../services/fournisseurService";


export function useReparateurGenLoader() {
    const [loading, setLoading] = useState({ lists: false});
    const [lists, setLists] = useState({ generateurs: [], fournisseur: []});
    const [error, setError] = useState(null);
    
    const loadLists = useCallback(async () => {
        setLoading(l => ({ ...l, lists: true}));
        try {
            const [ geneData, fourniData ] = await Promise.all([
                getGenerateur(),
                getFournisseur()
            ])

            setLists({
                generateurs: geneData?.data || [],
                fournisseurs: fourniData?.data || []
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