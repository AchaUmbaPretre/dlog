import { useEffect, useState, useCallback } from "react";
import { LockOutlined } from "@ant-design/icons";
import { Table, Input, Select, Card, Button, notification } from "antd";
import { getCatGeofence, getGeofenceDlog, getGeofenceFalcon, postGeofenceDlog, putGeofenceDlog } from "../../../../services/geofenceService";
import { getClient } from "../../../../services/clientService";
import { getDestination } from "../../../../services/charroiService";
import "./geofencesForm.scss";

const { Option } = Select;

const GeofencesForm = ({ closeModal, fetchData }) => {
  const [falcons, setFalcons] = useState([]);
  const [optionsData, setOptionsData] = useState({ types: [], clients: [], destinations: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [editingRows, setEditingRows] = useState([]);
  const [saving, setSaving] = useState(false);

  // Charger toutes les données et fusionner avec Dlog
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [falconsRes, typesRes, clientsRes, destRes, dlogRes] = await Promise.all([
        getGeofenceFalcon(),
        getCatGeofence(),
        getClient(),
        getDestination(),
        getGeofenceDlog(),
      ]);

      const dlogData = dlogRes.data;

      const checkpointType = typesRes.data.find(t => t.nom_catGeofence.toLowerCase() === "checkpoint");

      const mergedFalcons = falconsRes.data.map(falcon => {
        const saved = dlogData.find(d => d.falcon_id === falcon.id_geofence);

        const isCheckpoint = falcon.name?.toLowerCase().startsWith("checkp");

        return {
          ...falcon,
          type_geofence: saved?.type_geofence 
            || (isCheckpoint ? checkpointType?.id_catGeofence : null),
          client_id: saved?.client_id || null,
          destination_id: saved?.destination_id || null,
          description: saved?.description || "",
          nom: saved?.nom || falcon.name,
          actif: saved?.actif ?? 0,
          exists: !!saved, //  si déjà enregistré dans Dlog
        };
      });


      setFalcons(mergedFalcons);
      setOptionsData({ types: typesRes.data, clients: clientsRes.data, destinations: destRes.data });

    } catch (error) {
      console.error(error);
      notification.error({ message: "Erreur de chargement", description: error.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Double click pour éditer
  const handleDoubleClick = (record) => {
    if (!editingRows.includes(record.id_geofence)) {
      setEditingRows(prev => [...prev, record.id_geofence]);
    }
  };

  // Modifier les champs en édition
  const handleChange = (id, field, value) => {
    setFalcons(prev =>
      prev.map(item => item.id_geofence === id ? { ...item, [field]: value } : item)
    );
  };

  // Validation des champs obligatoires
  const validateRecord = (record) => {
    if (!record.type_geofence) return "Le type est obligatoire";
    if (!record.nom && !record.name) return "Le nom est obligatoire";
    return null;
  };

  // Sauvegarder une ligne (update)
  const handleSave = async (record) => {
  const validationError = validateRecord(record);
    if (validationError) {
      notification.warning({ message: "Validation", description: validationError });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        falcon_id: record.id_geofence,
        nom_falcon: record.name,
        nom: record.nom || record.name,
        type_geofence: record.type_geofence,
        client_id: record.client_id,
        destination_id: record.destination_id,
        description: record.description || "",
        actif: record.actif ?? 1,
      };

      // Vérifier si ce falcon a déjà un enregistrement Dlog
      const existing = await getGeofenceDlog(); // ou mieux : créer un endpoint `getGeofenceDlogByFalconId`
      const exists = existing.data.some(d => d.falcon_id === record.id_geofence);

      if (exists) {
        await putGeofenceDlog(payload, record.id_geofence);
        notification.success({ message: "Geofence mis à jour", description: `${record.name} a été mis à jour.` });
      } else {
        await postGeofenceDlog(payload);
        notification.success({ message: "Geofence ajouté", description: `${record.name} a été ajouté.` });
      }

      setEditingRows(prev => prev.filter(id => id !== record.id_geofence));
      fetchData?.();
      loadData();
    } catch (error) {
      console.error(error);
      notification.error({ message: "Erreur", description: error.message });
    } finally {
      setSaving(false);
    }
  };

const centerIcon = (
  <div style={{ textAlign: "center", width: "100%" }}>
    <LockOutlined style={{ color: "#aaa", fontSize: 16 }} />
  </div>
);

const columns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    render: (text, record, index) => index + 1,
    width: "3%",
  },
  {
    title: "Nom Falcon",
    dataIndex: "name",
    key: "name",
    render: text => <strong>{text}</strong>,
  },
  {
    title: "Type",
    dataIndex: "type_geofence",
    key: "type_geofence",
    align:'center',
    render: (text, record) =>
      editingRows.includes(record.id_geofence) ? (
        <Select
          allowClear
          showSearch
          placeholder="Type"
          value={record.type_geofence || undefined}
          optionFilterProp="children"
          style={{ width: 140 }}
          onChange={v => handleChange(record.id_geofence, "type_geofence", v)}
        >
          {optionsData.types.map(t => (
            <Option key={t.id_catGeofence} value={t.id_catGeofence}>
              {t.nom_catGeofence}
            </Option>
          ))}
        </Select>
      ) : (
        optionsData.types.find(t => t.id_catGeofence === record.type_geofence)?.nom_catGeofence ||
        centerIcon
      )
  },
  {
    title: "Client",
    dataIndex: "client_id",
    key: "client_id",
    align:'center',
    render: (text, record) =>
      editingRows.includes(record.id_geofence) ? (
        <Select
          allowClear
          showSearch
          placeholder="Client"
          value={record.client_id || undefined}
          optionFilterProp="children"
          style={{ width: 150 }}
          onChange={v => handleChange(record.id_geofence, "client_id", v)}
        >
          {optionsData.clients.map(c => (
            <Option key={c.id_client} value={c.id_client}>
              {c.nom}
            </Option>
          ))}
        </Select>
      ) : (
        optionsData.clients.find(c => c.id_client === record.client_id)?.nom ||
        centerIcon
      )
  },
  {
    title: "Destination",
    dataIndex: "destination_id",
    key: "destination_id",
    render: (text, record) =>
      editingRows.includes(record.id_geofence) ? (
        <Select
          allowClear
          showSearch
          placeholder="Destination"
          value={record.destination_id || undefined}
          optionFilterProp="children"
          style={{ width: 150 }}
          onChange={v => handleChange(record.id_geofence, "destination_id", v)}
        >
          {optionsData.destinations.map(d => (
            <Option key={d.id_destination} value={d.id_destination}>
              {d.nom_destination}
            </Option>
          ))}
        </Select>
      ) : (
        optionsData.destinations.find(d => d.id_destination === record.destination_id)?.nom_destination ||
        centerIcon
      )
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (text, record) =>
      editingRows.includes(record.id_geofence) ? (
        <Input
          placeholder="Description"
          value={record.description || ""}
          onChange={e => handleChange(record.id_geofence, "description", e.target.value)}
        />
      ) : (
        text || centerIcon
      )
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => {
      if (editingRows.includes(record.id_geofence)) {
        return (
          <Button
            type="primary"
            size="small"
            loading={saving}
            onClick={() => handleSave(record)}
          >
            Enregistrer
          </Button>
        );
      }

      return (
        <Button
          size="small"
          type="link"
          onClick={() => handleDoubleClick(record)}
          style={{ color: record.exists ? "#fa8c16" : "#1677ff" }}
        >
          {record.exists ? "Modifier" : "+ Ajouter"}
        </Button>
      );
    },
  },
];

  return (
    <div className="geofence_form">
      <Card title="Gestion des Geofences Falcon" loading={isLoading}>
        <Table
          columns={columns}
          dataSource={falcons}
          rowKey="id_geofence"
          bordered
          size="small"
          loading={isLoading}
          onRow={record => ({ onDoubleClick: () => handleDoubleClick(record) })}
          rowClassName={record => editingRows.includes(record.id_geofence) ? "active-row" : ""}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
};

export default GeofencesForm;
