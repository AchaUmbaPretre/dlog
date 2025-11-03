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

const RelierFalcon = ({ closeModal, fetchData }) => {
  const [loading, setLoading] = useState(true);
  const [falcon, setFalcon] = useState([]);
  const [vehiculeAll, setVehiculeAll] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchValue, setSearchValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedVehicule, setSelectedVehicule] = useState(null);

  // ✅ Récupération des données Falcon et véhicules
  useEffect(() => {
    const fetchFalcon = async () => {
      try {
        const [dataFalcon, dataVehicules] = await Promise.all([
          getFalcon(),
          getVehicule(),
        ]);
        setFalcon(dataFalcon.data[0].items || []);
        setVehiculeAll(dataVehicules.data.data || []);
      } catch (error) {
        console.error(error);
        message.error("Erreur lors du chargement des données Falcon");
      } finally {
        setLoading(false);
      }
    };
    fetchFalcon();
  }, []);

  // ✅ Lorsqu’un véhicule est sélectionné dans la liste
  const handleChangeVehicule = (id_vehicule) => {
    setSelectedVehicule(id_vehicule);
  };

  // ✅ Enregistrer la liaison (ajout ou modification)
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
          Voulez-vous relier le capteur <b>{record.name}</b> au véhicule sélectionné ?
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
          message.success("Véhicule relié avec succès !");
          fetchData?.();
          closeModal?.();
        } catch (error) {
          console.error(error);
          message.error("Erreur lors du reliement.");
        } finally {
          setSaving(false);
          setEditingRow(null);
          setSelectedVehicule(null);
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
      dataIndex: "vehicule",
      key: "vehicule",
      render: (text, record) =>
        editingRow === record.id ? (
          <Select
            showSearch
            placeholder="Sélectionner véhicule"
            style={{ width: 220 }}
            optionFilterProp="children"
            onChange={handleChangeVehicule}
          >
            {vehiculeAll.map((v) => (
              <Option key={v.id_vehicule} value={v.id_vehicule}>
                {v.nom_marque} - {v.immatriculation}
              </Option>
            ))}
          </Select>
        ) : (
          <Text type="secondary">Non relié</Text>
        ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => {
        const isEditing = editingRow === record.id;
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
            ) : (
              <>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => setEditingRow(record.id)}
                >
                  Ajouter
                </Button>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => setEditingRow(record.id)}
                >
                  Modifier
                </Button>
              </>
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
            placeholder="Rechercher par nom Falcon..."
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
