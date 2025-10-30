import { useEffect, useState, useCallback } from "react";
import { Table, Input, Select, Space, Button, notification } from "antd";
import { getClient } from "../../../../services/clientService";
import {
  getCatGeofence,
  getGeofenceFalcon,
} from "../../../../services/geofenceService";
import { getDestination } from "../../../../services/charroiService";
import axios from "axios";
import "./geofencesForm.scss";

const { Option } = Select;

const GeofencesForm = ({ fetchData }) => {
  const [falcons, setFalcons] = useState([]);
  const [optionsData, setOptionsData] = useState({
    types: [],
    clients: [],
    destinations: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingRows, setEditingRows] = useState([]);
  const [saving, setSaving] = useState(false);

  // Charger les données
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [falconsRes, typesRes, clientsRes, destRes] = await Promise.all([
        getGeofenceFalcon(),
        getCatGeofence(),
        getClient(),
        getDestination(),
      ]);

      setFalcons(falconsRes.data.items.geofences);
      setOptionsData({
        types: typesRes.data,
        clients: clientsRes.data,
        destinations: destRes.data,
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Erreur de chargement",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Double clic -> activer l'édition
  const handleDoubleClick = (record) => {
    if (!editingRows.includes(record.id)) {
      setEditingRows((prev) => [...prev, record.id]);
    }
  };

  // Modifier les champs localement
  const handleChange = (id, field, value) => {
    setFalcons((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Enregistrer dans geofences_dlog
  const handleSave = async (record) => {
    try {
      setSaving(true);

      const payload = {
        falcon_id: record.id,
        nom_falcon: record.name,
        nom: record.nom || record.name,
        type_geofence: record.type_geofence,
        client_id: record.client_id,
        zone_parent_id: record.destination_id,
        description: record.description || "",
        actif: 1,
      };

      await axios.post("/api/geofences", payload);

      notification.success({
        message: "Geofence enregistré",
        description: `${record.name} a été ajouté avec succès.`,
      });

      // retirer la ligne du mode édition
      setEditingRows((prev) => prev.filter((id) => id !== record.id));

      // recharger la liste
      fetchData?.();
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Erreur lors de l'enregistrement",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: "Nom Falcon",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
      render: (text, record) =>
        editingRows.includes(record.id) ? (
          <Input
            placeholder="Nom geofence"
            value={record.nom || ""}
            onChange={(e) => handleChange(record.id, "nom", e.target.value)}
          />
        ) : (
          <span>{record.nom || "-"}</span>
        ),
    },
    {
      title: "Type",
      dataIndex: "type_geofence",
      key: "type_geofence",
      render: (text, record) =>
        editingRows.includes(record.id) ? (
          <Select
            placeholder="Type"
            value={record.type_geofence}
            style={{ width: 140 }}
            onChange={(value) =>
              handleChange(record.id, "type_geofence", value)
            }
          >
            {optionsData.types.map((t) => (
              <Option key={t.id_catGeofence} value={t.id_catGeofence}>
                {t.nom_catGeofence}
              </Option>
            ))}
          </Select>
        ) : (
          <span>
            {
              optionsData.types.find(
                (t) => t.id_catGeofence === record.type_geofence
              )?.nom_catGeofence || "-"
            }
          </span>
        ),
    },
    {
      title: "Client",
      dataIndex: "client_id",
      key: "client_id",
      render: (text, record) =>
        editingRows.includes(record.id) ? (
          <Select
            placeholder="Client"
            value={record.client_id}
            style={{ width: 150 }}
            onChange={(value) => handleChange(record.id, "client_id", value)}
          >
            {optionsData.clients.map((c) => (
              <Option key={c.id_client} value={c.id_client}>
                {c.nom}
              </Option>
            ))}
          </Select>
        ) : (
          <span>
            {
              optionsData.clients.find((c) => c.id_client === record.client_id)
                ?.nom || "-"
            }
          </span>
        ),
    },
    {
      title: "Destination",
      dataIndex: "destination_id",
      key: "destination_id",
      render: (text, record) =>
        editingRows.includes(record.id) ? (
          <Select
            placeholder="Destination"
            value={record.destination_id}
            style={{ width: 150 }}
            onChange={(value) =>
              handleChange(record.id, "destination_id", value)
            }
          >
            {optionsData.destinations.map((d) => (
              <Option key={d.id_destination} value={d.id_destination}>
                {d.nom_destination}
              </Option>
            ))}
          </Select>
        ) : (
          <span>
            {
              optionsData.destinations.find(
                (d) => d.id_destination === record.destination_id
              )?.nom_destination || "-"
            }
          </span>
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) =>
        editingRows.includes(record.id) ? (
          <Input
            placeholder="Description"
            value={record.description || ""}
            onChange={(e) =>
              handleChange(record.id, "description", e.target.value)
            }
          />
        ) : (
          <span>{text || "-"}</span>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        editingRows.includes(record.id) ? (
          <Button
            type="primary"
            size="small"
            loading={saving}
            onClick={() => handleSave(record)}
          >
            Enregistrer
          </Button>
        ) : (
          <Button
            size="small"
            type="link"
            onClick={() => handleDoubleClick(record)}
          >
            + Ajouter
          </Button>
        ),
    },
  ];

  return (
    <div className="geofence_form">
      <Table
        columns={columns}
        dataSource={falcons}
        rowKey="id"
        bordered
        size="small"
        loading={isLoading}
        onRow={(record) => ({
          onDoubleClick: () => handleDoubleClick(record),
        })}
        rowClassName={(record) =>
          editingRows.includes(record.id) ? "active-row" : ""
        }
      />
    </div>
  );
};

export default GeofencesForm;
