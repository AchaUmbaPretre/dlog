import { notification } from "antd";
import { postRepGenerateur } from "../../../../../services/generateurService";
import { useState } from "react";

export function useReparationGenSubmit({ onSuccess } = {}) {
    const [submitting, setSubmitting] = useState(false);
    
    const submit = async({ payload }) => {
        setSubmitting(true);

        try {
            await postRepGenerateur(payload);
            notification.success({ message: 'Succès', description :'Enregistrement réussi.'})
            
            onSuccess && onSuccess();
            return { ok: true };
        } catch (error) {
            console.error('usePleinGenerateurSubmit.submit', error);
            notification.error({ message: 'Erreur', description: 'Échec de lopération.' });
            return { ok: false, error: error }
        } finally {
            setSubmitting(false);
        }
    };
    return { submitting, submit }
}