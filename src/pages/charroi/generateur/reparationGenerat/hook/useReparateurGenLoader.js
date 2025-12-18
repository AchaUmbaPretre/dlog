import { useCallback, useEffect, useState } from "react";
import { getGenerateur } from "../../../../../services/generateurService";
import { getFournisseur } from "../../../../../services/fournisseurService";
import { getStatutVehicule, getTypeReparation } from "../../../../../services/charroiService";
import { getCat_inspection } from "../../../../../services/batimentService";


export function useReparateurGenLoader() {
    const [loading, setLoading] = useState({ lists: false});
    const [lists, setLists] = useState({ generateurs: [], fournisseurs: [], statutVehicules:[], typeReparation: [], catInspection: [] });
    const [error, setError] = useState(null);
    
    const loadLists = useCallback(async () => {
        setLoading(l => ({ ...l, lists: true}));
        try {
            const [ geneData, fourniData, statusData, typeData, catData ] = await Promise.all([
                getGenerateur(),
                getFournisseur(),
                getStatutVehicule(),
                getTypeReparation(),
                getCat_inspection()
            ])

            setLists({
                generateurs: geneData?.data || [],
                fournisseurs: fourniData?.data || [],
                statutVehicules: statusData?.data || [],
                typeReparation: typeData?.data?.data || [],
                catInspection: catData?.data || []
            });

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