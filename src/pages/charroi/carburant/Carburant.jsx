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
  Menu,
  Empty,
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
    "Num PC": true,
    Facture: true,
    Chauffeur: true,
    Véhicule: true,
    Fournisseur: false,
    "Qté": true,
    "Distance (km)": false,
    "Km actuel": false,
    "Consom.": true,
    "P.U": false,
    "Date opération": false,
    "Montant total": true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getCarburant();
      setData(data || []);
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
    const search = searchValue.toLowerCase();
    return (
      data?.filter(
        (item) =>
          item.nom_chauffeur?.toLowerCase().includes(search) ||
          item.prenom?.toLowerCase().includes(search) ||
          item.immatriculation?.toLowerCase().includes(search)
      ) || []
    );
  }, [data, searchValue]);

  const columns = useMemo(() => {
    const formatNumber = (num, suffix = "") =>
      `${new Intl.NumberFormat("fr-FR").format(num || 0)}${suffix}`;

    return [
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
        key: "commentaire",
        render: (record) => (
          <Text strong>{`${record.commentaire?? ""}`}</Text>
        ),
      },
      {
        title: "Véhicule",
        dataIndex: "immatriculation",
        key: "immatriculation",
        render: (text) => <Tag color="blue">{text}</Tag>,
      },
      {
        title: "Date opération",
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
        title: "Distance (km)",
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
        render: (text) => <Text>{formatNumber(text, " km")}</Text>,
      },
      {
        title: "Cons./100km",
        dataIndex: "consommation",
        key: "consommation",
        align: "right",
        render: (text) => <Text>{formatNumber(text, " L/100km")}</Text>,
      },
      {
        title: "P.U ($)",
        dataIndex: "prix_unitaire",
        key: "prix_unitaire",
        align: "right",
        render: (text) => <Text>{formatNumber(text, " $")}</Text>,
      },
      {
        title: "Montant total ($)",
        dataIndex: "montant_total",
        key: "montant_total",
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
    ].filter((col) => columnsVisibility[col.title] !== false);
  }, [pagination, columnsVisibility]);

  const menus = (
    <Menu
      items={Object.keys(columnsVisibility).map((columnName) => ({
        key: columnName,
        label: (
          <Space onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={columnsVisibility[columnName]}
              onChange={() =>
                setColumnsVisibility((prev) => ({
                  ...prev,
                  [columnName]: !prev[columnName],
                }))
              }
            />
            <span>{columnName}</span>
          </Space>
        ),
      }))}
    />
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
            <Dropdown overlay={menus} trigger={["click"]}>
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
          scroll={{ x: 1100 }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          locale={{
            emptyText: (
              <Empty
                description="Aucune donnée disponible"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      <Modal
        open={modalType === "Add"}
        onCancel={closeAllModals}
        footer={null}
        width={1250}
        centered
        destroyOnClose
      >
        <CarburantForm closeModal={closeAllModals} fetchData={fetchData} />
      </Modal>
    </div>
  );
};

export default Carburant;
