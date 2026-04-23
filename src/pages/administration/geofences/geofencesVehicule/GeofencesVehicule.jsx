import React, { useCallback, useEffect, useState } from 'react';
import { Table, Checkbox, Switch, Input, Button, notification } from 'antd';
import {
  getVehicule
} from '../../../../services/charroiService';

import {
  getGeofenceVehiculeById,
  postGeofenceVehicule,
  putGeofenceVehicule,
  deleteGeofenceVehicule // ⚠️ à créer si pas encore
} from '../../../../services/geofenceService';

const GeofencesVehicule = ({ closeModal, fetchDatas, idGeofence }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  // 🔥 Merge vehicules + relations
  const mergeData = (vehicules, relations) => {
    return vehicules.map(v => {
      const exist = relations.find(r => r.id_vehicule === v.id_vehicule);

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

      console.log("relationsRes FULL:", relationsRes);

      relations = relationsRes?.data?.data || [];
    }

    const vehicules = vehiculesRes?.data?.data || [];

    const merged = mergeData(vehicules, relations);

    setData(merged);

  } catch (error) {
    console.error("ERROR:", error);
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

  // ✅ Checkbox
  const handleCheck = (id) => {
    setData(prev =>
      prev.map(v =>
        v.id_vehicule === id
          ? { ...v, checked: !v.checked }
          : v
      )
    );
  };

  console.log('donnees', data)

  // ✅ Switch
  const handleSwitch = (id) => {
    setData(prev =>
      prev.map(v =>
        v.id_vehicule === id
          ? { ...v, autorise_sans_bs: v.autorise_sans_bs ? 0 : 1 }
          : v
      )
    );
  };

  // 🔍 Recherche
  const filteredData = data.filter(v =>
    `${v.nom_marque} ${v.modele} ${v.immatriculation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 💾 Sauvegarde
  const handleSave = async () => {
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
            id: v.id_vehicule_geofence,
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
          putGeofenceVehicule(item, item.id)
        ),
        ...toDelete.map(id =>
          deleteGeofenceVehicule(id)
        )
      ]);

      notification.success({
        message: "Sauvegarde réussie"
      });

      fetchDatas();
      closeModal();

    } catch (error) {
      notification.error({
        message: "Erreur",
        description: error.message
      });
    } finally {
      setSaving(false);
    }
  };

  // 📊 Colonnes
  const columns = [
    {
      title: 'Véhicule',
      render: (_, record) => (
        <span>
          {record.nom_marque} {record.modele} - {record.immatriculation}
        </span>
      )
    },
    {
      title: 'Affecté',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={record.checked}
          onChange={() => handleCheck(record.id_vehicule)}
        />
      )
    },
    {
      title: 'Sans BS',
      align: 'center',
      render: (_, record) => (
        <Switch
          checked={record.autorise_sans_bs === 1}
          onChange={() => handleSwitch(record.id_vehicule)}
          disabled={!record.checked}
        />
      )
    }
  ];

  const totalSelected = data.filter(v => v.checked).length;

  return (
    <div>

      {/* 🔍 Recherche */}
      <Input
        placeholder="Rechercher un véhicule..."
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      {/* 📊 Compteur */}
      <div style={{ marginBottom: 10 }}>
        Véhicules affectés : <strong>{totalSelected}</strong>
      </div>

      {/* 📋 Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id_vehicule"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 400 }}
      />

      {/* 💾 Actions */}
      <div style={{ marginTop: 15, textAlign: 'right' }}>
        <Button onClick={closeModal} style={{ marginRight: 10 }}>
          Annuler
        </Button>

        <Button
          type="primary"
          loading={saving}
          onClick={handleSave}
        >
          Enregistrer
        </Button>
      </div>

    </div>
  );
};

export default GeofencesVehicule;