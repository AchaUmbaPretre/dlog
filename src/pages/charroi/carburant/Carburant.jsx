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
  Menu
} from "antd";
import {
  PrinterOutlined,
  FireOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ReloadOutlined,
  DownOutlined,
  MenuOutlined
} from "@ant-design/icons";
import "./carburant.scss";
import { getCarburant } from "../../../services/carburantService";
import CarburantForm from "./carburantForm/CarburantForm";
import moment from 'moment';

const { Search } = Input;
const { Text, Title } = Typography;

const Carburant = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [modalType, setModalType] = useState(null);
  const [data, setData] = useState([]);
  const [columnsVisibility, setColumnsVisibility] = useState({
      '#': true,
      'Num PC' : true,
      'Facture': true,
      'Vehicule': true,
      'Chauffeur': true,
      "Véhicule": true,
      "Fournisseur": true,
      'Qté': false,
      'Distance (km)': false,
      'Km actuel' : false,
      "Consom.": false,
      "P.U": false,
      "Date opération": false,
      "Montant total": true
    });

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

  const filteredData =
    data?.filter(
      (item) =>
        item.nom_chauffeur?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.prenom?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase())
    ) || [];

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
        ...(columnsVisibility['Vehicule'] ? {} : { className: 'hidden-column' })
    },
    { 
      title: 'Date', 
      dataIndex: 'date_operation', 
      key: 'date_operation',
      sorter: (a, b) => moment(a.date_operation).unix() - moment(b.date_operation).unix(),
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color='red'>
          {text ? moment(text).format('DD-MM-yyyy') : 'Aucune'}
        </Tag>
      ),
      ...(columnsVisibility['Date opération'] ? {} : { className: 'hidden-column' })
    },
    {
      title: "Fournisseur",
      dataIndex: "nom_fournisseur",
      key: "nom_fournisseur",
        ...(columnsVisibility['Fournisseur'] ? {} : { className: 'hidden-column' })
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

  const menus = (
    <Menu>
      {Object.keys(columnsVisibility).map(columnName => (
        <Menu.Item key={columnName}>
          <span onClick={(e) => toggleColumnVisibility(columnName,e)}>
            <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
            <span style={{ marginLeft: 8 }}>{columnName}</span>
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );  

  const toggleColumnVisibility = (columnName, e) => {
    e.stopPropagation();
    setColumnsVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };

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
            <Dropdown overlay={menus} trigger={['click']}>
                <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                    Colonnes <DownOutlined />
                </Button>
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
