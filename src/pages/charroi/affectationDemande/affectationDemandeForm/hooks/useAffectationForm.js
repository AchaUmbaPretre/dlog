import { useCallback } from "react";
import { useAffectationData } from "./useAffectationData";
import { useAffectationSubmit } from "./useAffectationSubmit";

export function useAffectationForm(id_demande_vehicule, { onSaved } = {}) {
    const {
        destination,
        loadingData,
        vehicule,
        chauffeur,
        userId,
        motif,
        service,
        client,
        reload
    } = useAffectationData({id_demande_vehicule});
    const { submitting, submit } = useAffectationSubmit({ onSuccess: () => { reload(); onSaved && onSaved(); }});

    const buildPayload = useCallback((values) => ({
        ...values,
        id_demande_vehicule : id_demande_vehicule,
        user_cr: userId
    }), [userId]);

    const handleFinish = useCallback(async (values) => {
        const payload = buildPayload(values);
        return { payload}
    }, [buildPayload]);

    const doSubmit = useCallback(async ({ payload }) => {
        return submit({ payload });
    }, [submit]);

    return {
        destination,
        loadingData,
        vehicule,
        chauffeur,
        motif,
        service,
        client,
        reload,
        submitting,
        handleFinish,
        doSubmit
    }
    
}