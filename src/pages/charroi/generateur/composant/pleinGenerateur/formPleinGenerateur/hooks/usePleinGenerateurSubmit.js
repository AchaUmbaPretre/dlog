import { useState } from 'react';
import { notification } from 'antd';
import { postPleinGenerateur, putPleinGenerateur } from '../../../../../../../services/generateurService';


export function usePleinGenerateurSubmit({ onSuccess } = {}) {
const [submitting, setSubmitting] = useState(false);


const submit = async ({ payload, id_plein }) => {
    setSubmitting(true);
    try {
        if (id_plein) {
        await putPleinGenerateur(payload);
        notification.success({ message: 'Succès', description: 'Modification réussie.' });
    } else {
        await postPleinGenerateur(payload);
        notification.success({ message: 'Succès', description: 'Enregistrement réussi.' });
    }


    onSuccess && onSuccess();
    return { ok: true };
    } catch (err) {
        console.error('usePleinGenerateurSubmit.submit', err);
        notification.error({ message: 'Erreur', description: 'Échec de lopération.' });
        return { ok: false, error: err }
    } finally {
    setSubmitting(false);
    }
};
    return { submitting, submit };
}