import { useCallback, useEffect, useState } from 'react';
import { notification } from 'antd';
import { getVehicule } from '../../../../../services/charroiService';
import { deleteGeofenceVehicule, getGeofenceVehiculeById, postGeofenceVehicule, putGeofenceVehicule } from '../../../../../services/geofenceService';

export const useGeofenceVehicule = (idGeofence) => {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const mergeData = (vehicules = [], relations = []) => {
    return vehicules.map(v => {
      const exist = relations.find(
        r => r.id_vehicule === v.id_vehicule
      );

      return {
        ...v,
        checked: !!exist,
        autorise_sans_bs: exist?.autorise_sans_bs || 0,
        id_vehicule_geofence: exist?.id_vehicule_geofence || null
      };
    });
  };

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);

      const vehiculesRes = await getVehicule();

      let relations = [];

      if (idGeofence) {
        const relationsRes = await getGeofenceVehiculeById(idGeofence);
        relations = relationsRes?.data?.data || [];
      }

      const vehicules = vehiculesRes?.data?.data || [];

      const merged = mergeData(vehicules, relations);

      setData(merged);

    } catch (error) {
      console.error(error);
      notification.error({
        message: "Erreur",
        description: "Chargement échoué"
      });
    } finally {
      setLoading(false);
    }
  }, [idGeofence]);

  useEffect(() => {
    if (idGeofence) fetchAll();
  }, [idGeofence]);

  const handleCheck = (id) => {
    setData(prev =>
      prev.map(v =>
        v.id_vehicule === id
          ? { ...v, checked: !v.checked }
          : v
      )
    );
  };

  const handleSwitch = (id) => {
    setData(prev =>
      prev.map(v =>
        v.id_vehicule === id
          ? { ...v, autorise_sans_bs: v.autorise_sans_bs ? 0 : 1 }
          : v
      )
    );
  };

  const handleSave = async (closeModal, fetchDatas) => {
    try {
      setSaving(true);

      const toInsert = [];
      const toUpdate = [];
      const toDelete = [];

      data.forEach(v => {
        if (v.checked && !v.id_vehicule_geofence) {
          toInsert.push({
            id_vehicule: v.id_vehicule,
            id_geo_dlog: idGeofence,
            autorise_sans_bs: v.autorise_sans_bs
          });
        }

        if (v.checked && v.id_vehicule_geofence) {
          toUpdate.push({
            id_vehicule: v.id_vehicule,
            id_geo_dlog: idGeofence,
            id_vehicule_geofence: v.id_vehicule_geofence,
            autorise_sans_bs: v.autorise_sans_bs
          });
        }

        if (!v.checked && v.id_vehicule_geofence) {
          toDelete.push(v.id_vehicule_geofence);
        }
      });

      await Promise.all([
        ...toInsert.map(postGeofenceVehicule),
        ...toUpdate.map(item =>
          putGeofenceVehicule(item, item.id_vehicule_geofence)
        ),
        ...toDelete.map(id =>
          deleteGeofenceVehicule(id)
        )
      ]);

      notification.success({
        message: "Sauvegarde réussie"
      });

      fetchDatas?.();
      closeModal?.();

    } catch (error) {
      console.error(error);
      notification.error({
        message: "Erreur",
        description: error.message
      });
    } finally {
      setSaving(false);
    }
  };

  // 🔍 filter
  const filteredData = data.filter(v =>
    `${v.nom_marque} ${v.modele} ${v.immatriculation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return {
    data,
    filteredData,
    loading,
    saving,
    search,
    setSearch,
    handleCheck,
    handleSwitch,
    handleSave
  };
};