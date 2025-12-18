import { useState } from "react";
import { postInspectGenerateur } from "../../../../../../services/generateurService";
import { notification } from "antd";

export const useInspectionGenSubmit = () => {
    const [submitting, setSubmitting] = useState(false);

    const submit = async({ payload }) => {
        setSubmitting(true)

        try {
            await postInspectGenerateur(payload);
            notification.success({ message : 'Succès', description: 'Enregistrement réussi.'});
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