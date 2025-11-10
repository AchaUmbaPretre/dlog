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
  Tooltip,
} from "antd";
import {
  CarOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { getCarburantVehicule, putRelierCarburantVehicule } from "../../../../services/carburantService";
import { getVehicule } from "../../../../services/charroiService";

const { Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const RelierCarburantVehicule = () => {
  const [loading, setLoading] = useState(true);
  const [vehiculecar, setVehiculecar] = useState([]);
  const [vehiculeAll, setVehiculeAll] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchValue, setSearchValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedVehicule, setSelectedVehicule] = useState(null);

  const fetchDataAll = async () => {
    try {
      setLoading(true);
      const [vehiculeCarRes, vehiculeRes] = await Promise.all([
        getCarburantVehicule(),
        getVehicule(),
      ]);
      setVehiculecar(vehiculeCarRes.data);
      setVehiculeAll(vehiculeRes.data.data || []);
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

  const handleChangeVehicule = (id_vehicule) => setSelectedVehicule(id_vehicule);

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
      okText: "Oui",
      cancelText: "Annuler",
      async onOk() {
        try {
          setSaving(true);
          await putRelierCarburantVehicule(selectedVehicule, {
            id_enregistrement: record.id_enregistrement
          });
          message.success("Véhicule relié/modifié avec succès !");
          await fetchDataAll();
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

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "Immatricul.",
      dataIndex: "immatriculation",
      key: "immatriculation",
      render: (text) => (
        <Space>
          <CarOutlined style={{ color: "#1890ff", fontSize: 18 }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
   {
  title: "Véhicule Dlog",
  key: "vehicule",
  render: (_, record) => {
    // 🔍 Chercher le véhicule Dlog déjà relié à ce véhicule carburant
    const linkedVehicule = vehiculeAll.find(
      (v) => v.id_carburant_vehicule === record.id_enregistrement
    );

    if (editingRow === record.id_enregistrement) {
      return (
        <Select
          showSearch
          placeholder="Sélectionner un véhicule"
          style={{ width: 250 }}
          optionFilterProp="children"
          onChange={handleChangeVehicule}
          // ✅ afficher par défaut le véhicule déjà relié
          defaultValue={linkedVehicule?.id_vehicule || undefined}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {vehiculeAll.map((v) => (
            <Option key={v.id_vehicule} value={v.id_vehicule}>
              {v.nom_marque} - {v.immatriculation}
            </Option>
          ))}
        </Select>
      );
    }

    // 🟩 Si le véhicule carburant est déjà relié à un véhicule Dlog
    if (linkedVehicule) {
      return (
        <Tag color="green" icon={<CheckOutlined />}>
          {linkedVehicule.nom_marque} - {linkedVehicule.immatriculation}
        </Tag>
      );
    }

    // 🟥 Si aucun véhicule n’est encore relié
    return (
      <Tag color="red" icon={<CloseOutlined />}>
        Non relié
      </Tag>
    );
  },
},

    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => {
        const isEditing = editingRow === record.id_enregistrement;
         const linkedVehicule = vehiculeAll.find(
        (v) => v.id_carburant_vehicule === record.id_enregistrement
        );

        return (
          <Space>
            {isEditing ? (
              <>
                <Tooltip title="Enregistrer la liaison">
                  <Button
                    type="primary"
                    size="small"
                    loading={saving}
                    onClick={() => handleSave(record)}
                  >
                    Enregistrer
                  </Button>
                </Tooltip>
                <Tooltip title="Annuler la modification">
                  <Button size="small" onClick={() => setEditingRow(null)}>
                    Annuler
                  </Button>
                </Tooltip>
              </>
            ) : linkedVehicule ? (
              <Tooltip title="Modifier le véhicule relié">
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => setEditingRow(record.id_enregistrement)}
                >
                  Modifier
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Ajouter un véhicule à ce vehicule carburant">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => setEditingRow(record.id_enregistrement)}
                >
                  Ajouter
                </Button>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Card
      title="Relier à un véhicule Dlog"
      className="relierFalconCard pro-card"
      bordered
    >
      {loading ? (
        <Spin tip="Chargement..." size="large" />
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Input.Search
            placeholder="Rechercher..."
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 350 }}
            enterButton
          />

          <Table
            columns={columns}
            dataSource={vehiculecar.filter((item) =>
              item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase())
            )}
            rowKey="id_enregistrement"
            bordered
            size="middle"
            pagination={pagination}
            onChange={setPagination}
            rowClassName={(record) =>
              editingRow === record.id_enregistrement ? "selected-row pro-row" : ""
            }
          />
        </Space>
      )}
    </Card>
  );
};

export default RelierCarburantVehicule;
