import { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import { getGenerateur, getPleinGenerateurLimit, getPleinGenerateurOne } from '../../../../../../../services/generateurService';
import { getTypeCarburant } from '../../../../../../../services/charroiService';
import { getFournisseur_activiteOne } from '../../../../../../../services/fournisseurService';


export function usePleinGenerateurLoaders(id_plein) {
const [loading, setLoading] = useState({ lists: false, plein: false });
const [lists, setLists] = useState({ generateurs: [], types: [], fournisseurs: [], limits: [] });
const [initialValues, setInitialValues] = useState(null);
const [error, setError] = useState(null);


const loadLists = useCallback(async () => {
setLoading(l => ({ ...l, lists: true }));
try {
const [geneData, typeData, limitData, fournisseurRes] = await Promise.all([
getGenerateur(),
getTypeCarburant(),
getPleinGenerateurLimit(),
getFournisseur_activiteOne(5),
]);


setLists({
generateurs: geneData?.data || [],
types: typeData?.data || [],
fournisseurs: fournisseurRes?.data || [],
limits: limitData?.data || []
});
} catch (err) {
console.error('usePleinGenerateurLoaders.loadLists', err);
setError(err);
} finally {
setLoading(l => ({ ...l, lists: false }));
}
}, []);


const loadPlein = useCallback(async (id) => {
if (!id) return;
setLoading(l => ({ ...l, plein: true }));
try {
const { data } = await getPleinGenerateurOne(id);
const item = data?.[0] ?? null;
if (item) {
setInitialValues({
...item,
date_operation: item.date_operation ? dayjs(item.date_operation, 'YYYY-MM-DD') : null,
});
}
} catch (err) {
console.error('usePleinGenerateurLoaders.loadPlein', err);
setError(err);
} finally {
setLoading(l => ({ ...l, plein: false }));
}
}, []);


useEffect(() => {
loadLists();
}, [loadLists]);


useEffect(() => {
if (id_plein) loadPlein(id_plein);
}, [id_plein, loadPlein]);


return {
    loading,
    lists,
    initialValues,
    error,
    reload: () => {
        loadLists();
        if (id_plein) loadPlein(id_plein);
    }
};
}