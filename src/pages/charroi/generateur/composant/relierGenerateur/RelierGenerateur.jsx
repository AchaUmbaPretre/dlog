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
  ThunderboltOutlined,
  BarcodeOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { getCarburantVehicule } from "../../../../../services/carburantService";
import {
  getGenerateur,
  putRelierGenerateurFichier,
} from "../../../../../services/generateurService";

const { Text } = Typography;
const { confirm } = Modal;

const RelierGenerateur = () => {
  const [loading, setLoading] = useState(true);
  const [vehiculecar, setVehiculecar] = useState([]);
  const [generateurAll, setGenerateurAll] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchValue, setSearchValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedGenerateur, setSelectedGenerateur] = useState(null);

  const fetchDataAll = async () => {
    try {
      setLoading(true);
      const [vehiculeCarRes, generateurRes] = await Promise.all([
        getCarburantVehicule(),
        getGenerateur(),
      ]);

      setVehiculecar(vehiculeCarRes.data || []);
      setGenerateurAll(generateurRes.data || []);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du chargement des données véhicules/générateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAll();
  }, []);

  const handleChangeGenerateur = (id_generateur) => {
    setSelectedGenerateur(id_generateur);
  };

  const handleSave = async (record) => {
    if (!selectedGenerateur) {
      message.warning("Veuillez sélectionner un générateur.");
      return;
    }

    const selectedGen = generateurAll.find(
      (g) => g.id_generateur === selectedGenerateur
    );

    confirm({
      title: "Confirmer la liaison",
      icon: <ExclamationCircleOutlined />,
      content: (
        <Text>
          Voulez-vous relier <b>{record.name}</b> au générateur{" "}
          <b>{selectedGen?.nom_marque} - {selectedGen?.nom_modele}</b> ?
        </Text>
      ),
      okText: "Oui",
      cancelText: "Annuler",
      async onOk() {
        try {
          setSaving(true);

          await putRelierGenerateurFichier(selectedGenerateur, {
            id_enregistrement: record.id_enregistrement,
          });

          message.success("Générateur relié/modifié avec succès !");
          await fetchDataAll();
        } catch (error) {
          console.error(error);
          message.error("Erreur lors du reliement.");
        } finally {
          setEditingRow(null);
          setSelectedGenerateur(null);
          setSaving(false);
        }
      },
    });
  };

  const getIconByMarque = (marque) => {
    const isGroup = String(marque).toUpperCase() === "GROUPE ELECTROGENE";

    return isGroup ? (
      <ThunderboltOutlined style={{ color: "#faad14", fontSize: 18 }} />
    ) : (
      <CarOutlined style={{ color: "#1890ff", fontSize: 18 }} />
    );
  };


  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Marque",
      dataIndex: "nom_marque",
      key: "nom_marque",
      render: (text) => (
        <Space>
          {getIconByMarque(text)}
          <Text strong>{text ?? "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Modèle",
      dataIndex: "nom_modele",
      key: "nom_modele",
      render: (text, record) => (
        <Space>
          {getIconByMarque(record.nom_marque)}
          <Text strong>{text ?? "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Immatriculation",
      dataIndex: "immatriculation",
      key: "immatriculation",
      render: (text) => (
        <Space>
          <BarcodeOutlined style={{ color: "#1890ff", fontSize: 18 }} />
          <Text strong>{text ?? "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "N° série",
      dataIndex: "immatriculation",
      key: "immatriculation",
      render: (text) => (
        <Space>
          <BarcodeOutlined style={{ color: "#1890ff", fontSize: 18 }} />
          <Text strong>{text ?? "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Générateur",
      key: "generateur",
      render: (_, record) => {
        const linked = generateurAll.find(
          (g) => g.id_carburant_vehicule === record.id_enregistrement
        );
    
        if (editingRow === record.id_enregistrement) {
          return (
            <Select
              showSearch
              placeholder="Sélectionner un générateur"
              style={{ width: 260 }}
              optionFilterProp="label"
              defaultValue={linked?.id_generateur}
              onChange={handleChangeGenerateur}
              filterOption={(input, option) =>
                option?.label.toLowerCase().includes(input.toLowerCase())
              }
              options={generateurAll.map((g) => ({
                value: g.id_generateur,
                label: `${g.nom_marque} - ${g.nom_modele}`,
              }))}
            />
          );
        }

        if (linked) {
          return (
            <Tag color="green" icon={<CheckOutlined />}>
              {linked.nom_marque} - {linked.nom_modele}
            </Tag>
          );
        }

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
        const linked = generateurAll.find(
          (g) => g.id_carburant_vehicule === record.id_enregistrement
        );

        const isEditing = editingRow === record.id_enregistrement;

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

                <Tooltip title="Annuler">
                  <Button size="small" onClick={() => setEditingRow(null)}>
                    Annuler
                  </Button>
                </Tooltip>
              </>
            ) : linked ? (
              <Tooltip title="Modifier le générateur lié">
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => setEditingRow(record.id_enregistrement)}
                >
                  Modifier
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Lier un générateur">
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
    <Card title="Relier à un générateur" bordered className="relierFalconCard pro-card">
      {loading ? (
        <Spin tip="Chargement..." size="large" style={{ width: "100%" }} />
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Input.Search
            placeholder="Rechercher..."
            allowClear
            enterButton
            style={{ width: 350 }}
            onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
          />

          <Table
            rowKey="id_enregistrement"
            bordered
            columns={columns}
            dataSource={vehiculecar.filter(
              (item) =>
                item.nom_marque?.toLowerCase().includes(searchValue) ||
                item.immatriculation?.toLowerCase().includes(searchValue)
            )}
            pagination={pagination}
            onChange={setPagination}
            size="middle"
            rowClassName={(record) =>
              editingRow === record.id_enregistrement ? "selected-row pro-row" : ""
            }
          />
        </Space>
      )}
    </Card>
  );
};

export default RelierGenerateur;
