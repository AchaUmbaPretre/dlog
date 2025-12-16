import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useReparateurGenLoader } from './useReparateurGenLoader';
import { useReparationGenSubmit } from './useReparationGenSubmit';


export function useReparateurGenForm({ onSaved } = {}) {
    const userId = useSelector((s) => s.user?.currentUser?.id_utilisateur);
    const { loading, lists, reload } = useReparateurGenLoader();
    const { submitting, submit } = useReparationGenSubmit({ onSuccess: () => { reload(); onSaved && onSaved(); }});

    const buildPayload = useCallback((values) => ({
        ...values,
        date_entree : values.date_entree ? dayjs(values.date_entree).format('YYYY/MM/DD') : null,
        date_prevu : values.date_prevu ? dayjs(values.date_prevu).format('YYYY/MM/DD') : null
    }), []);

    const handleFinish = useCallback(async (values) => {
        const payload = buildPayload(values);
        payload.user_cr = userId;
        return { payload };
    }, [buildPayload, userId]);

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