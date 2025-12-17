import { useCallback, useEffect, useState } from "react";
import { notification } from "antd";
import {
  getCat_inspection
} from "../../../../../../../services/batimentService";
import {
  getEvaluation,
  getPiece,
  getStatutVehicule,
  getTypeReparation
} from "../../../../../../../services/charroiService";
import {
  getRepSousGeneById
} from "../../../../../../../services/generateurService";

const initialState = {
  evaluation: [],
  tache: [],
  piece: [],
  statut: [],
  reparation: [],
  detail: null
};

export const useReparationTracking = ({ idRep }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialState);

  const fetchAll = useCallback(async () => {
    let isMounted = true;
    setLoading(true);

    try {
      const [
        tacheRes,
        evaluationRes,
        pieceRes,
        reparationRes,
        statutRes
      ] = await Promise.all([
        getCat_inspection(),
        getEvaluation(),
        getPiece(),
        getTypeReparation(),
        getStatutVehicule()
      ]);

      let detail = null;
      if (idRep) {
        const res = await getRepSousGeneById(idRep);
        detail = res?.data ?? null;
      }

      if (isMounted) {
        setData({
          tache: tacheRes?.data ?? [],
          evaluation: evaluationRes?.data ?? [],
          piece: pieceRes?.data ?? [],
          reparation: reparationRes?.data ?? [],
          statut: statutRes?.data ?? [],
          detail
        });
      }
    } catch (error) {
      notification.error({
        message: "Erreur",
        description: "Impossible de charger les données de réparation"
      });
      console.error(error);
    } finally {
      isMounted && setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [idRep]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    data,
    loading,
    refresh: fetchAll
  };
};
