import { useState, useCallback } from "react";
import { notification } from "antd";
import { postBandeSortie } from "../../../../../../services/charroiService";

export function useBandeSortieSubmit({ onSuccess } = {}) {
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async ({ payload }) => {
    setSubmitting(true);

    try {
      await postBandeSortie(payload);

      notification.success({
        message: "Succès",
        description: "Enregistrement réussi.",
      });

      onSuccess?.();

      return { ok: true };
    } catch (error) {
      console.error("useBandeSortieSubmit.submit", error);

      notification.error({
        message: "Erreur",
        description: "Échec de l'opération.",
      });

      return { ok: false, error };
    } finally {
      setSubmitting(false);
    }
  }, [onSuccess]);

  return { submitting, submit };
}
