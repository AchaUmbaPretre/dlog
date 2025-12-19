import { notification } from "antd";
import { useState } from "react";
import { postInspectGenerateur } from "../../../../../../services/generateurService";

export const useInspectionGenSubmit = ({ onSuccess } = {}) => {
    const [submitting, setSubmitting] = useState(false);

    const submit = async ({ payload }) => {
        setSubmitting(true);
        try {
            await postInspectGenerateur(payload);
            notification.success({
                message: 'Succès',
                description: 'Enregistrement réussi.'
            });
            onSuccess?.();
            return { ok: true };
        } catch (error) {
            console.error('useInspectionGenSubmit.submit', error);
            notification.error({
                message: 'Erreur',
                description: "Échec de l'opération."
            });
            return { ok: false, error };
        } finally {
            setSubmitting(false);
        }
    };

    return { submitting, submit };
};
