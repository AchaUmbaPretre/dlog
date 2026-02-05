import { useState, useCallback } from "react";
import { notification } from "antd";
import { postAffectationDemande } from "../../../../../services/charroiService";

export function useAffectationSubmit({ onSuccess } = {}) {
    const [submitting, setSubmitting] = useState(false);

    const submit = useCallback(async ({ payload }) => {
        setSubmitting(true);
        try {
            const response = await postAffectationDemande(payload);

            notification.success({
                message: "Succès",
                description: "Affectation a été créée avec succès."
            });

            onSuccess?.();

            return {
                ok: true,
                id: response.data?.id_affectation
            }
        } catch (error) {
            console.error("useAffectationSubmit.submit", error);

            notification.error({
                message: "Erreur",
                description: "Échec de l'opération.",
            });

            return { ok: false, error };
        }  finally {
            setSubmitting(false);
        }
    }, [onSuccess]);

    return { submitting, submit };
}