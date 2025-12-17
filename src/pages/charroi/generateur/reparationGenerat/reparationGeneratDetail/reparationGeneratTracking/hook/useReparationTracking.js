import { useCallback, useEffect, useState } from "react";
import { getCat_inspection } from "../../../../../../../services/batimentService";
import { getEvaluation, getPiece, getStatutVehicule, getTypeReparation } from "../../../../../../../services/charroiService";
import { notification } from "antd";

export const useReparationTracking = ({idRep}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        evaluation: [],
        tache: [],
        piece: [],
        statut: [],
        reparation: []
    });

    const fetchAll = useCallback(async () => {
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

        setData({
            tache: tacheRes?.data || [],
            evaluation: evaluationRes?.data || [],
            piece: pieceRes?.data || [],
            reparation: reparationRes?.data || [],
            statut: statutRes?.data || []
        });
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: 'Impossible de charger les données de réparation'
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll, idRep]);

  return {
    data,
    loading,
    refresh: fetchAll
  }
}