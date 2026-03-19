import { useEffect, useState, useCallback } from "react";
import { message, notification } from "antd";
import {
  getBandeSortie,
  putEstSupprimeBandeSortie,
  putAnnulereBandeSortie
} from "../../../../../services/charroiService";

export const useBandeData = (userId, initialFilters = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getBandeSortie(userId);
      setData(data);
    } catch (error) {
      notification.error({
        message: "Erreur de chargement",
        description:
          "Une erreur est survenue lors du chargement des données.",
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const silentFetch = useCallback(async () => {
    try {
      const { data } = await getBandeSortie(userId);
      setData(data);
    } catch (error) {
      console.error("Erreur refresh automatique :", error);
    }
  }, [userId]);

  // 🗑 DELETE
  const handleDelete = useCallback(
    async (id, idVehicule) => {
      try {
        await putEstSupprimeBandeSortie(id, idVehicule, userId);
        setData((prev) => prev.filter((item) => item.id_bande_sortie !== id));
        message.success("Suppression réussie");
      } catch (error) {
        notification.error({
          message: "Erreur de suppression",
          description:
            "Une erreur est survenue lors de la suppression.",
        });
      }
    },
    [userId]
  );

  const handleAnnuler = useCallback(
    async (id_bande_sortie, id_vehicule) => {
      const loadingKey = "loadingAnnuler";

      message.loading({
        content: "Traitement en cours...",
        key: loadingKey,
        duration: 0,
      });

      try {
        await putAnnulereBandeSortie(id_bande_sortie, id_vehicule, userId);

        message.success({
          content: `Bon ${id_bande_sortie} annulé avec succès`,
          key: loadingKey,
        });

        // refresh principal (avec loading pour feedback utilisateur)
        await fetchData();

      } catch (error) {
        message.error({
          content: "Erreur lors de l'annulation",
          key: loadingKey,
        });
      }
    },
    [userId, fetchData]
  );

  useEffect(() => {
    if (!userId) return;

    fetchData();

    const interval = setInterval(() => {
      silentFetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId, fetchData, silentFetch]);

  return {
    data,
    loading,
    fetchData,
    handleDelete,
    handleAnnuler,
  };
};