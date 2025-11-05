import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Dropdown,
  Input,
  Space,
  Modal,
  Typography,
  Tag,
  Tooltip,
  Card,
  notification,
} from "antd";
import {
  ExportOutlined,
  PrinterOutlined,
  FireOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import "./carburant.scss";
import { getCarburant } from "../../../services/carburantService";
import CarburantForm from "./carburantForm/CarburantForm";

const { Search } = Input;
const { Text, Title } = Typography;

const Carburant = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [modalType, setModalType] = useState(null);
  const [data, setData] = useState([]);

  /** 🔹 Récupération des données */
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getCarburant();
      setData(data || []);
    } catch (error) {
      notification.error({
        message: "Erreur",
        description: "Impossible de charger les données carburant.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /** 🔹 Gestion modales */
  const closeAllModals = () => setModalType(null);
  const openModal = (type) => setModalType(type);

  /** 🔹 Filtrage intelligent */
  const filteredData =
    data?.filter(
      (item) =>
        item.nom_chauffeur?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.prenom?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase())
    ) || [];

  /** 🔹 Colonnes du tableau */
  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: "Num PC", dataIndex: "num_pc", key: "num_pc" },
    { title: "Facture", dataIndex: "num_facture", key: "num_facture" },
    {
      title: "Chauffeur",
      key: "chauffeur",
      render: (record) => (
        <Text strong>
          {record.nom_chauffeur} {record.prenom}
        </Text>
      ),
    },
    {
      title: "Véhicule",
      dataIndex: "immatriculation",
      key: "immatriculation",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Fournisseur",
      dataIndex: "nom_fournisseur",
      key: "nom_fournisseur",
    },
    {
      title: "Qté (L)",
      dataIndex: "quantite_litres",
      key: "quantite_litres",
      align: "right",
      render: (text) => (
        <Text>{new Intl.NumberFormat("fr-FR").format(text || 0)}</Text>
      ),
    },
    {
      title: "Distance (km)",
      dataIndex: "distance",
      key: "distance",
      align: "right",
      render: (text) => (
        <Text>{new Intl.NumberFormat("fr-FR").format(text || 0)}</Text>
      ),
    },
    {
      title: "km actuel",
      dataIndex: "compteur_km",
      key: "compteur_km",
      align: "right",
      render: (text) => (
        <Text>{new Intl.NumberFormat("fr-FR").format(text || 0)} km</Text>
      ),
    },
    {
      title: "Cons./100km",
      dataIndex: "consommation",
      key: "consommation",
      align: "right",
      render: (text) => (
        <Text>{new Intl.NumberFormat("fr-FR").format(text || 0)} L/100km</Text>
      ),
    },
    {
      title: "P.U ($)",
      dataIndex: "prix_unitaire",
      key: "prix_unitaire",
      align: "right",
      render: (text) => (
        <Text>{new Intl.NumberFormat("fr-FR").format(text || 0)} $</Text>
      ),
    },
    {
      title: "Montant total ($)",
      dataIndex: "montant_total",
      key: "montant_total",
      align: "right",
      render: (text) => (
        <Text strong style={{ color: "#1677ff" }}>
          {new Intl.NumberFormat("fr-FR").format(text || 0)} $
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (record) => (
        <Space>
          <Tooltip title="Supprimer">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log("Supprimer", record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const menu = (
    <div style={{ padding: 10 }}>
      <Button type="text" icon={<ExportOutlined />}>
        Export Excel
      </Button>
      <Button type="text" icon={<ExportOutlined />}>
        Export CSV
      </Button>
    </div>
  );

  return (
    <div className="carburant-page">
      <Card
        title={
          <Space>
            <FireOutlined style={{ color: "#fa541c", fontSize: 22 }} />
            <Title level={4} style={{ margin: 0 }}>
              Gestion des carburants
            </Title>
          </Space>
        }
        bordered={false}
        className="shadow-sm rounded-2xl"
        extra={
          <Space>
            <Search
              placeholder="Recherche chauffeur / véhicule..."
              allowClear
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 260 }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchData}
              loading={loading}
            >
              Actualiser
            </Button>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => openModal("Add")}
            >
              Nouveau
            </Button>
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button icon={<ExportOutlined />}>Exporter</Button>
            </Dropdown>
            <Button icon={<PrinterOutlined />}>Imprimer</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          bordered={false}
          size="middle"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `${total} enregistrements`,
          }}
          onChange={setPagination}
          scroll={{ x: 1000 }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
        />
      </Card>

      <Modal
        open={modalType === "Add"}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
        destroyOnClose
      >
        <CarburantForm closeModal={closeAllModals} fetchData={fetchData} />
      </Modal>
    </div>
  );
};

export default Carburant;
