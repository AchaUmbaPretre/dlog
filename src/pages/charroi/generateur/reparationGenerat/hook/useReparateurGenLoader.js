import { useCallback } from "react";
import { getGenerateur } from "../../../../../services/generateurService";
import { getFournisseur } from "../../../../../services/fournisseurService";


export function useReparateurGenLoader() {
    [loading, setLoading] = useState({ lists: false});
    [lists, setLists] = useState({ generateurs: [], fournisseur: []});
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
        } catch (error) {
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