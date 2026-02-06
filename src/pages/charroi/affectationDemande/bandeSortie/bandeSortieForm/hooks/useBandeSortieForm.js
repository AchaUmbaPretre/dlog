import { useCallback } from "react";
import { useBandeSortieData } from "./useBandeSortieData";
import { useBandeSortieSubmit } from "./useBandeSortieSubmit";


export function useBandeSortieForm(affectationId, { onSaved } = {}) {

    const {     
            form,    
            loadingData,
            vehicule,
            chauffeur,
            userId,
            type,
            motif,
            service,
            client,
            destination,
            societe,
            reload
        } = useBandeSortieData(affectationId);
    const { submitting, submit } = useBandeSortieSubmit({ onSuccess: () => { reload(); onSaved && onSaved(); }});

    const buildPayload = useCallback((values) => {
        const payload = {
            ...values,
            user_cr: userId,
        };

        if (affectationId) {
            payload.id_affectation_demande = affectationId;
        }

        return payload;
    }, [userId, affectationId]);

    const handleFinish = useCallback(async (values) => {
        const payload = buildPayload(values);
        return { payload}
    }, [buildPayload])    

    
    const doSubmit = useCallback(async ({ payload }) => {
        return submit({ payload });
    }, [submit]);
            
    return {
        form,    
        loadingData,
        vehicule,
        chauffeur,
        motif,
        service,
        client,
        destination,
        societe,
        reload,
        submitting,
        handleFinish,
        doSubmit
    }
}