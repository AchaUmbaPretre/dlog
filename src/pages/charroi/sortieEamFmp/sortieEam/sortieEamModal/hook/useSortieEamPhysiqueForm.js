import { useState } from "react";
import axios from "axios";
import { postDocPhysiqueEam } from "../../../../../../services/sortieEamFmp";

export const useSortieEamPhysiqueForm = (data, setData) => {
  const [loading, setLoading] = useState(false);

  const postDocPhysiqueEams = async ({ id_sortie_eam, smr_ref, part, docPhysiqueOk, qteDocPhysique }) => {
    setLoading(true);
    try {
      // Appel API
      await postDocPhysiqueEam({
        id_eam_doc: id_sortie_eam,
        smr_ref,
        part,
        doc_physique_ok: docPhysiqueOk ? 1 : 0,
        qte_doc_physique: docPhysiqueOk ? qteDocPhysique : null,
      })
     
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du document physique :", error);
    } finally {
      setLoading(false);
    }
  };

  return { postDocPhysiqueEams, loading };
};
