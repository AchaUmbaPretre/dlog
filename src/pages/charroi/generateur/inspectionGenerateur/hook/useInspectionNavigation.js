import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { notification } from 'antd';
import {
  getInspectGenerateur,
  getInspectGenerateurById
} from '../../../../../services/generateurService';

export const useInspectionNavigation = (initialInspectionId) => {
  const [currentInspectionId, setCurrentInspectionId] = useState(initialInspectionId);
  const [inspectionIds, setInspectionIds] = useState([]);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const activeRequestRef = useRef(null);

    useEffect(() => {
        setCurrentInspectionId(Number(initialInspectionId));
    }, [initialInspectionId]);


  useEffect(() => {
    const fetchIds = async () => {
      try {
        const res = await getInspectGenerateur();
        const ids = (res?.data || [])
        .map(i => Number(i.id_inspection_generateur))
        .sort((a, b) => a - b);


        setInspectionIds(ids);
      } catch {
        notification.error({
          message: 'Erreur',
          description: 'Chargement des inspections impossible.'
        });
      }
    };

    fetchIds();
  }, []);

  const fetchDetails = useCallback(async (id) => {
    setLoading(true);
    activeRequestRef.current = id;

    try {
      const res = await getInspectGenerateurById(id);
      if (activeRequestRef.current !== id) return;

      const rows = res?.data || [];
      setDatas(rows);
      setTotal(rows.reduce((s, r) => s + (r.montant ?? 0), 0));
    } catch {
      notification.error({
        message: 'Erreur',
        description: 'Chargement des détails impossible.'
      });
    } finally {
      if (activeRequestRef.current === id) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (currentInspectionId) {
      fetchDetails(currentInspectionId);
    }
  }, [currentInspectionId, fetchDetails]);

  const goToPrevious = () => {
    const index = inspectionIds.indexOf(currentInspectionId);
    if (index > 0) {
      setCurrentInspectionId(inspectionIds[index - 1]);
    }
  };

  const goToNext = () => {
        if (!inspectionIds.length) return;

        const index = inspectionIds.findIndex(
            id => id === Number(currentInspectionId)
        );

        if (index === -1) {
            console.warn('ID courant introuvable dans inspectionIds', {
            currentInspectionId,
            inspectionIds
            });
            return;
        }

        if (index < inspectionIds.length - 1) {
            setCurrentInspectionId(inspectionIds[index + 1]);
        }
    };


  const headerInfo = useMemo(() => {
    if (!datas.length) return {};
    return {
      marque: datas[0].nom_marque,
      modele: datas[0].nom_modele,
      date_inspection: datas[0].date_inspection
    };
  }, [datas]);

  return {
    currentInspectionId,
    datas,
    total,
    loading,
    headerInfo,
    goToPrevious,
    goToNext
  };
};
