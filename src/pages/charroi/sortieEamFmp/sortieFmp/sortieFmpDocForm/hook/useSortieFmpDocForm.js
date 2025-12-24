import { useState } from "react";
import { notification } from "antd";
import { postDocPhysiqueEam, postDocPhysiqueFmp } from "../../../../../../services/sortieEamFmp";

export const useSortieFmpDocForm = (reload) => {
  const [loading, setLoading] = useState(false);

  const postDocPhysiqueFmps = async ({
    smr,
    sortie_gsm_num_be,
    item_code,
    docPhysiqueOk,
    qteDocPhysique
  }) => {
    setLoading(true);

    try {
      await postDocPhysiqueFmp({
        smr,
        sortie_gsm_num_be,
        item_code,
        doc_physique_ok: docPhysiqueOk ? 1 : 0,
        qte_doc_physique: docPhysiqueOk ? qteDocPhysique : null,
      });

      notification.success({
        message: "Succès",
        description: "Le document physique a été enregistré avec succès.",
        placement: "topRight",
      });

      reload();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du document physique :", error);

      notification.error({
        message: "Erreur",
        description:
          error?.response?.data?.message ||
          "Une erreur est survenue lors de l’enregistrement du document physique.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return { postDocPhysiqueFmps, loading };
};
