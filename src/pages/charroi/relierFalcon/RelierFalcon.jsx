import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Typography,
  message,
  Card,
  Space,
  Input,
  Spin,
  Select,
  Modal,
  Tag,
} from "antd";
import {
  CarOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  getVehicule,
  putRelierVehiculeFalcon,
} from "../../../services/charroiService";
import { getFalcon } from "../../../services/rapportService";
import "./relierFalcon.scss";

const { Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const RelierFalcon = ({ fetchData }) => {
  const [loading, setLoading] = useState(true);
  const [falcon, setFalcon] = useState([]);
  const [vehiculeAll, setVehiculeAll] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchValue, setSearchValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedVehicule, setSelectedVehicule] = useState(null);

  // ✅ Charger Falcon + Véhicules, puis fusionner

    const fetchDataAll = async () => {
      try {
        const [falconRes, vehiculeRes] = await Promise.all([
          getFalcon(),
          getVehicule(),
        ]);

        const falconList = falconRes.data[0].items || [];
        const vehiculeList = vehiculeRes.data.data || [];

        // 🔹 Fusion : si un véhicule contient id_capteur = id Falcon, alors il est déjà relié
        const merged = falconList.map((f) => {
          const linkedVehicule = vehiculeList.find(
            (v) => Number(v.id_capteur) === Number(f.id)
          );
          return {
            ...f,
            linkedVehicule: linkedVehicule
              ? {
                  id_vehicule: linkedVehicule.id_vehicule,
                  immatriculation: linkedVehicule.immatriculation,
                  nom_marque: linkedVehicule.nom_marque,
                }
              : null,
          };
        });

        setFalcon(merged);
        setVehiculeAll(vehiculeList);
      } catch (error) {
        console.error(error);
        message.error("Erreur lors du chargement des données Falcon/Véhicules");
      } finally {
        setLoading(false);
      }
    };
    
  useEffect(() => {
    fetchDataAll();
  }, []);

  // ✅ Sélection d’un véhicule
  const handleChangeVehicule = (id_vehicule) => {
    setSelectedVehicule(id_vehicule);
  };

  // ✅ Enregistrement liaison Falcon ↔ Véhicule
const handleSave = async (record) => {
  if (!selectedVehicule) {
    message.warning("Veuillez sélectionner un véhicule.");
    return;
  }

  confirm({
    title: "Confirmer la liaison",
    icon: <ExclamationCircleOutlined />,
    content: (
      <Text>
        Voulez-vous relier le capteur <b>{record.name}</b> au véhicule{" "}
        <b>
          {
            vehiculeAll.find((v) => v.id_vehicule === selectedVehicule)
              ?.immatriculation
          }
        </b>
        ?
      </Text>
    ),
    okText: "Oui, relier",
    cancelText: "Annuler",
    async onOk() {
      try {
        setSaving(true);
        await putRelierVehiculeFalcon(selectedVehicule, {
          id_capteur: record.id,
          name_capteur: record.name,
        });
        message.success("Véhicule modifié avec succès !");
        await fetchDataAll(); // ✅ recharge bien la liste actualisée
      } catch (error) {
        console.error(error);
        message.error("Erreur lors du reliement.");
      } finally {
        setEditingRow(null);
        setSelectedVehicule(null);
        setSaving(false);
      }
    },
  });
};


  // ✅ Colonnes du tableau
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "Capteur Falcon",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <CarOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Véhicule Dlog",
      dataIndex: "linkedVehicule",
      key: "vehicule",
      render: (linkedVehicule, record) => {
        if (editingRow === record.id) {
          return (
            <Select
              showSearch
              placeholder="Sélectionner un véhicule"
              style={{ width: 220 }}
              optionFilterProp="children"
              onChange={handleChangeVehicule}
              defaultValue={linkedVehicule?.id_vehicule || undefined}
            >
              {vehiculeAll.map((v) => (
                <Option key={v.id_vehicule} value={v.id_vehicule}>
                  {v.nom_marque} - {v.immatriculation}
                </Option>
              ))}
            </Select>
          );
        }

        if (linkedVehicule) {
          return (
            <Tag color="green">
              {linkedVehicule.nom_marque} - {linkedVehicule.immatriculation}
            </Tag>
          );
        }

        return <Tag color="red">Non relié</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => {
        const isEditing = editingRow === record.id;
        const isLinked = !!record.linkedVehicule;

        return (
          <Space>
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  size="small"
                  loading={saving}
                  onClick={() => handleSave(record)}
                >
                  Enregistrer
                </Button>
                <Button size="small" onClick={() => setEditingRow(null)}>
                  Annuler
                </Button>
              </>
            ) : isLinked ? (
              <Button
                type="default"
                icon={<EditOutlined />}
                size="small"
                onClick={() => setEditingRow(record.id)}
              >
                Modifier
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="small"
                onClick={() => setEditingRow(record.id)}
              >
                Ajouter
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Card title="Relier un véhicule Falcon" className="relierFalconCard" bordered>
      {loading ? (
        <Spin tip="Chargement..." />
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Input.Search
            placeholder="Rechercher un capteur Falcon..."
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 300 }}
          />

          <Table
            columns={columns}
            dataSource={falcon.filter((item) =>
              item.name?.toLowerCase().includes(searchValue.toLowerCase())
            )}
            rowKey="id"
            bordered
            size="middle"
            pagination={pagination}
            onChange={setPagination}
            rowClassName={(record) =>
              editingRow === record.id ? "selected-row" : ""
            }
          />
        </Space>
      )}
    </Card>
  );
};

export default RelierFalcon;
