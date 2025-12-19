import { useCallback } from "react";
import { useReparateurGenLoader } from "../../../reparationGenerat/hook/useReparateurGenLoader";
import { useReparationGenSubmit } from "../../../reparationGenerat/hook/useReparationGenSubmit";
import { useSelector } from "react-redux";
import dayjs from 'dayjs';
import { useInspectionGenSubmit } from "./useInspectionGenSubmit";

export const useInspectionGenForm = (idInspection, { onSaved } = {}) => {
    const userId = useSelector((s) => s.user?.currentUser?.id_utilisateur);
    const { loading, lists, reload } = useReparateurGenLoader();
    const { submitting, submit } = useInspectionGenSubmit({ onSuccess: () => { reload(); onSaved && onSaved(); }});
    
    const buildPayload = useCallback((values) => ({
            ...values,
            date_prevu : values.date_reparation ? dayjs(values.date_reparation).format('YYYY/MM/DD') : null,
            date_inspection : values.date_prevu ? dayjs(values.date_prevu).format('YYYY/MM/DD') : null
    }), []);

    const handleFinish = useCallback(async (values) => {
        const payload = buildPayload(values);
        payload.user_cr = userId;
        return { payload };
    }, [buildPayload, userId])

    const doSubmit = useCallback(async ({ payload }) => {
        return submit({ payload})
    }, [submit]);

    return {
        loading,
        lists,
        submitting,
        handleFinish,
        doSubmit,
        reload
    }
}