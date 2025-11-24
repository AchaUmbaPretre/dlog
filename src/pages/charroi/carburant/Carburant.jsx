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
  Tooltip,
  Card,
  notification,
  Empty,
  Checkbox,
} from "antd";
import {
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
        title: "Chauffeur",
        dataIndex: "nom_chauffeur",
        render: (value, record) => (
          <Text strong>
            {value && record.prenom
              ? `${value} ${record.prenom}`
              : record.commentaire}
          </Text>
        )
      },
      {
        title: "Marque",
        dataIndex: "nom_marque",
        key: "nom_marque",
        render: (text) => <Text italic>{text}</Text>,
      },
      {
        title: "Véhicule",
        dataIndex: "immatriculation",
        key: "immatriculation",
        render: (text) => <Tag color="blue">{text ?? 'N/A'}</Tag>,
      },
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
        title: "Fournisseur",
        dataIndex: "nom_fournisseur",
        key: "nom_fournisseur",
      },
      {
        title: "Qté (L)",
        dataIndex: "quantite_litres",
        key: "quantite_litres",
        align: "right",
        render: (text) => <Text>{formatNumber(text)}</Text>,
      },
      {
        title: "Dist. (km)",
        dataIndex: "distance",
        key: "distance",
        align: "right",
        render: (text) => <Text>{formatNumber(text)}</Text>,
      },
      {
        title: "Km actuel",
        dataIndex: "compteur_km",
        key: "compteur_km",
        align: "right",
        render: (text) => <Text>{formatNumber(text)} km</Text>,
      },
      {
        title: "Cons./100km",
        dataIndex: "consommation",
        key: "consommation",
        align: "right",
        render: (text) => <Text>{formatNumber(text, " L")}</Text>,
      },
      {
        title: "P.U ($)",
        dataIndex: "prix_usd",
        key: "prix_usd",
        align: "right",
        render: (text) => <Text>{formatNumber(text, " $")}</Text>,
      },
      {
        title: "M. total ($)",
        dataIndex: "montant_total_usd",
        key: "montant_total_usd",
        align: "right",
        render: (text) => (
          <Text strong style={{ color: "#1677ff" }}>
            {formatNumber(text, " $")}
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

    // On garde seulement les colonnes visibles
    return allColumns.filter(
      (col) => columnsVisibility[col.title] !== false
    );
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
