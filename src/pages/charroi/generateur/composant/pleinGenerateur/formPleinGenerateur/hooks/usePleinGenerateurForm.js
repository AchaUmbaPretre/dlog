import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { usePleinGenerateurSubmit } from './usePleinGenerateurSubmit';
import { usePleinGenerateurLoaders } from './usePleinGenerateurLoaders';

export function usePleinGenerateurForm(id_plein, { onSaved } = {}) {
    const userId = useSelector((s) => s.user?.currentUser?.id_utilisateur);


    const { loading, lists, initialValues, reload } = usePleinGenerateurLoaders(id_plein);
    const { submitting, submit } = usePleinGenerateurSubmit({ onSuccess: () => { reload(); onSaved && onSaved(); } });


    const buildPayload = useCallback((values) => ({
    ...values,
    date_operation: values?.date_operation ? dayjs(values.date_operation).format('YYYY-MM-DD') : null,
    }), []);


    const handleFinish = useCallback(async (values) => {
    const payload = buildPayload(values);
    payload.user_cr = userId;
    return { payload, id_plein };
    }, [buildPayload, userId, id_plein]);


    const doSubmit = useCallback(async ({ payload, id }) => {
        return submit({ payload, id_plein: id });
    }, [submit]);


    return {
        loading,
        lists,
        initialValues,
        submitting,
        handleFinish,
        doSubmit,
        reload
    };
}