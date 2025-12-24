import { useState } from "react";
import axios from "axios";
import { postDocPhysiqueEam } from "../../../../../../services/sortieEamFmp";

export const useSortieFmpDocForm = (reload) => {
  const [loading, setLoading] = useState(false);

  const postDocPhysiqueFmp = async ({ smr, sortie_gsm_num_be, item_code, docPhysiqueOk, qteDocPhysique }) => {
    setLoading(true);
    try {
      // Appel API
      await postDocPhysiqueFmp({
        smr,
        sortie_gsm_num_be,
        item_code, 
        doc_physique_ok: docPhysiqueOk ? 1 : 0,
        qte_doc_physique: docPhysiqueOk ? qteDocPhysique : null,
      })

      reload();
     
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du document physique :", error);
    } finally {
      setLoading(false);
    }
  };

  return { postDocPhysiqueFmp, loading };
};
