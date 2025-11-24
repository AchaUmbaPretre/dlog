import { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Dropdown,
  Input,
  Space,
  Modal,
  Typography,
  Tag,
  Card,
  notification,
  Empty,
  Checkbox,
} from "antd";
import {
  CarOutlined,
  PrinterOutlined,
  FireOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ReloadOutlined,
  DownOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./carburant.scss";
import { getCarburant } from "../../../services/carburantService";
import CarburantForm from "./carburantForm/CarburantForm";
import { formatNumber } from "../../../utils/formatNumber";
import { render } from "@testing-library/react";

const { Search } = Input;
const { Text, Title } = Typography;

const Carburant = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [modalType, setModalType] = useState(null);
  const [data, setData] = useState([]);
  const [columnsVisibility, setColumnsVisibility] = useState({
    "#": true,
    "Num PC": false,
    Facture: false,
    Marque: true,
    Chauffeur: true,
    Véhicule: true,
    Fournisseur: false,
    "Qté (L)": true,
    "Distance (km)": false,
    "Km actuel": true,
    "Cons./100km": true,
    "P.U ($)": false,
    "Date opération": true,
    "Montant total ($)": true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getCarburant();
      setData(response?.data || []);
    } catch (error) {
      notification.error({
        message: "Erreur de chargement",
        description: "Impossible de récupérer les données carburant.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const closeAllModals = () => setModalType(null);
  const openModal = (type) => setModalType(type);

  const filteredData = useMemo(() => {
    const search = searchValue.toLowerCase().trim();
    if (!search) return data;
    return data.filter(
      (item) =>
        item.commentaire?.toLowerCase().includes(search) ||
        item.nom_chauffeur?.toLowerCase().includes(search) ||
        item.nom?.toLowerCase().includes(search) ||
        item.nom_marque?.toLowerCase().includes(search) ||
        item.immatriculation?.toLowerCase().includes(search)
    );
  }, [data, searchValue]);

const columns = useMemo(() => {
  const allColumns = [
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
      title: "Date op.",
      dataIndex: "date_operation",
      key: "date_operation",
      sorter: (a, b) =>
        moment(a.date_operation).unix() - moment(b.date_operation).unix(),
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="red">
          {text ? moment(text).format("DD-MM-YYYY") : "Aucune"}
        </Tag>
      ),
    },
    {
      title: "Chauffeur",
      dataIndex: "nom_chauffeur",
      render: (value, record) => (
        <Text strong>
          {value && record.prenom ? `${value} ${record.prenom}` : record.commentaire}
        </Text>
      ),
    },
    {
      title: "Marque / Immat.",
      key: "vehicule_marque",
      render: (_, record) => (
        <div>
          <Text strong>{record.nom_marque ?? "N/A"}</Text>
          <br />
          <Tag color="blue">{record.immatriculation ?? "N/A"}</Tag>
        </div>
      ),
      sorter: (a, b) => (a.nom_marque ?? "").localeCompare(b.nom_marque ?? ""),
      width: 180,
    },
    {
      title: "Type vehi.",
      dataIndex: "abreviation",
      key: "abreviation",
      render: (text) => (
        <Space>
          <CarOutlined style={{ color: "#1890ff" }} />
          <Text>{text ?? "N/A"}</Text>
        </Space>
      ),
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
      render: (text) => <Text>{formatNumber(text)} L</Text>,
    },
    {
      title: "Km actuel",
      dataIndex: "compteur_km",
      key: "compteur_km",
      align: "right",
      render: (text) => <Text>{formatNumber(text)} km</Text>,
    },
    {
      title: "Dist. (km)",
      dataIndex: "distance",
      key: "distance",
      align: "right",
      render: (text) => <Text>{formatNumber(text)} km</Text>,
    },
    {
      title: "Cons./100km",
      dataIndex: "consommation",
      key: "consommation",
      align: "right",
      render: (value) => {
        let color = "🟢"; // Normal
        if (value > 15 && value <= 30) color = "🟡"; // À surveiller
        else if (value > 30) color = "🔴"; // Anormal

        return (
          <span>
            {formatNumber(value, " L")} / 100km {color}
          </span>
        );
      },
    },
    {
      title: "P.U ($)",
      dataIndex: "prix_usd",
      key: "prix_usd",
      align: "right",
      render: (text) => <Text>{formatNumber(text, " $")}</Text>,
    },
    {
      title: "Montant ($)",
      dataIndex: "montant_total_usd",
      key: "montant_total_usd",
      align: "right",
      render: (text) => (
        <Text strong style={{ color: "#1677ff" }}>
          {text ? formatNumber(text, " $") : "N/A"}
        </Text>
      ),
    },
    {
      title: "M. (CDF)",
      dataIndex: "montant_total_cdf",
      key: "montant_total_cdf",
      align: "right",
      render: (text) => (
        <Text strong style={{ color: "#1677ff" }}>
          {text ? formatNumber(text, " CDF") : "N/A"}
        </Text>
      ),
    },
  ];

  return allColumns.filter((col) => columnsVisibility[col.title] !== false);
}, [pagination, columnsVisibility]);

  const columnMenu = (
    <div style={{ padding: 10, background:'#fff' }}>
      {Object.keys(columnsVisibility).map((colName) => (
        <div key={colName}>
          <Checkbox
            checked={columnsVisibility[colName]}
            onChange={() =>
              setColumnsVisibility((prev) => ({
                ...prev,
                [colName]: !prev[colName],
              }))
            }
          >
            {colName}
          </Checkbox>
        </div>
      ))}
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
          <Space wrap>
            <Search
              placeholder="Recherche chauffeur ou véhicule..."
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
            <Dropdown overlay={columnMenu} trigger={["click"]}>
              <Button icon={<MenuOutlined />}>
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
          rowKey={(record) => record.id || record.key}
          size="middle"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `${total} enregistrements`,
          }}
          onChange={(pagination) => setPagination(pagination)}
          scroll={{ x: 1100 }}
          rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          locale={{
            emptyText: (
              <Empty
                description="Aucune donnée disponible"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          bordered
        />
      </Card>

      <Modal
        open={modalType === "Add"}
        onCancel={closeAllModals}
        footer={null}
        width={1400}
        centered
        destroyOnClose
      >
        <CarburantForm closeModal={closeAllModals} fetchData={fetchData} />
      </Modal>
    </div>
  );
};

export default Carburant;
