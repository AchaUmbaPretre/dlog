import { useCallback, useMemo, useState } from "react";
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
  Tooltip,
  Skeleton,
  Popconfirm,
  message,
} from "antd";
import {
  CarOutlined,
  EditOutlined,
  DashboardOutlined,
  DollarOutlined,
  UserOutlined,
  PrinterOutlined,
  FireOutlined,
  PlusCircleOutlined,
  CalendarOutlined,
  ReloadOutlined,
  DownOutlined,
  MenuOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./carburant.scss";
import { deleteCarburant } from "../../../services/carburantService";
import CarburantForm from "./carburantForm/CarburantForm";
import { formatNumber } from "../../../utils/formatNumber";
import CarburantKpi from "./carburantkpi/Carburantkpi";
import CarburantDetail from "./carburantDetail/CarburantDetail";
import CarburantFilter from "./carburantFilter/CarburantFilter";
import { useCarburantData } from "./hooks/useCarburantData";
import { useCarburantColumns } from "./hooks/useCarburantColumns";

const { Search } = Input;
const { Text, Title } = Typography;

function useCarburantKpis(data) {
  const totalKmActuel = useMemo(
    () => data.reduce((sum, item) => sum + (item.compteur_km || 0), 0),
    [data]
  );
  const totalConsommation = useMemo(
    () => data.reduce((sum, item) => sum + (item.consommation || 0), 0),
    [data]
  );
  const distanceMoyenne = useMemo(() => {
    if (!data || data.length === 0) return 0;
    const totalDistance = data.reduce((sum, item) => sum + (item.distance || 0), 0);
    return totalDistance / data.length;
  }, [data]);
  const montantTotalUsd = useMemo(
    () => data.reduce((sum, item) => sum + (item.montant_total_usd || 0), 0),
    [data]
  );

  return { totalKmActuel, totalConsommation, distanceMoyenne, montantTotalUsd };
}

/* ------------------ Component ------------------ */
const Carburant = () => {
  // pagination UI state
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // compact modal state object
  const [modal, setModal] = useState({ type: null, id: null });

  // columns visibility map (can be persisted to localStorage later)
  const [columnsVisibility, setColumnsVisibility] = useState({
    "#": true,
    "Num PC": false,
    Facture: false,
    Marque: true,
    Chauffeur: true,
    Véhicule: true,
    "Type vehi.": true,
    Fournisseur: false,
    "Qté (L)": true,
    "Distance (km)": false,
    "Km actuel": true,
    "Cons./100km": true,
    "P.U ($)": false,
    "Date opération": true,
    "M. ($)": true,
    "M. (CDF)": true,
    "Créé par": false,
  });

  const [searchValue, setSearchValue] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  // data hook
  const { data, setData, loading, reload, setFilters } = useCarburantData(null);

  // computed KPIs
  const { totalKmActuel, totalConsommation, distanceMoyenne, montantTotalUsd } =
    useCarburantKpis(data);

  // ids
  const allIds = useMemo(() => [...new Set(data.map((d) => d.id_carburant))], [data]);

  // filteredData (search)
  const filteredData = useMemo(() => {
    const search = (searchValue || "").toLowerCase().trim();
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

  // handlers to open/close modals
  const openModal = (type, id = null) => setModal({ type, id });
  const closeAllModals = () => setModal({ type: null, id: null });

  // delete handler uses local state to update instantly, then show messages
  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteCarburant(id);
        setData((prev) => prev.filter((item) => item.id_carburant !== id));
        message.success("Carburant a été supprimé avec succès");
      } catch (err) {
        notification.error({
          message: "Erreur de suppression",
          description: "Une erreur est survenue lors de la suppression du carburant.",
        });
      }
    },
    [setData]
  );

  // columns hook
  const columns = useCarburantColumns({
    pagination,
    columnsVisibility,
    onEdit: (id) => openModal("Add", id),
    onDetail: (id) => openModal("Detail", id),
    onDelete: handleDelete,
  });

  // column menu UI
  const columnMenu = (
    <div style={{ padding: 10, background: "#fff" }}>
      {Object.keys(columnsVisibility).map((colName) => (
        <div key={colName}>
          <Checkbox
            checked={columnsVisibility[colName]}
            onChange={() =>
              setColumnsVisibility((prev) => ({ ...prev, [colName]: !prev[colName] }))
            }
          >
            {colName}
          </Checkbox>
        </div>
      ))}
    </div>
  );

  // toggle filter panel (keeps fetch separate)
  const handFilter = () => {
    setFilterVisible((v) => !v);
  };

  const handleFilterChange = (newFilters) => {
    // pass new filters to data hook and trigger reload
    setFilters(newFilters);
    // force reload with new filters
    reload(newFilters);
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
          <Space wrap>
            <Search
              placeholder="Recherche chauffeur ou véhicule..."
              allowClear
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 260 }}
            />
            <Button icon={<ReloadOutlined />} onClick={() => reload()} loading={loading}>
              Actualiser
            </Button>
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => openModal("Add")}>
              Nouveau
            </Button>
            <Button type="default" onClick={handFilter}>
              {filterVisible ? "🚫 Cacher les filtres" : "👁️ Afficher les filtres"}
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
        {filterVisible && <CarburantFilter onFilter={handleFilterChange} />}

        <div className="kpi-wrapper">
          <CarburantKpi
            icon={<DashboardOutlined />}
            title="Total KM actuel"
            value={
              loading ? <Skeleton.Input style={{ width: 80 }} active size="small" /> : `${formatNumber(totalKmActuel)} km`
            }
            color="linear-gradient(135deg, #1677ff7e, #69b1ff)"
          />

          <CarburantKpi
            icon={<FireOutlined />}
            title="Totale Consom/100km"
            value={
              loading ? <Skeleton.Input style={{ width: 60 }} active size="small" /> : `${formatNumber(totalConsommation)} L`
            }
            color="linear-gradient(135deg, #ff4d5042, #ff7875)"
          />

          <CarburantKpi
            icon={<CarOutlined />}
            title="Distance moyenne"
            value={
              loading ? <Skeleton.Input style={{ width: 80 }} active size="small" /> : `${formatNumber(distanceMoyenne)} km`
            }
            color="linear-gradient(135deg, #53c41a4f, #95de64)"
          />

          <CarburantKpi
            icon={<DollarOutlined />}
            title="Montant total ($)"
            value={loading ? <Skeleton.Input style={{ width: 80 }} active size="small" /> : formatNumber(montantTotalUsd, " $")}
            color="linear-gradient(135deg, #722ed12c, #b37feb)"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record.id_carburant}
          size="middle"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `${total} enregistrements`,
          }}
          onChange={(p) => setPagination(p)}
          scroll={{ x: 1100 }}
          rowClassName={(record, index) => (index % 2 === 0 ? "odd-row" : "even-row")}
          locale={{
            emptyText: <Empty description="Aucune donnée disponible" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
          bordered
        />
      </Card>

      <Modal open={modal.type === "Add"} onCancel={closeAllModals} footer={null} width={modal.id ? 800 : 1400} centered destroyOnClose>
        <CarburantForm closeModal={closeAllModals} fetchData={reload} idCarburant={modal.id} />
      </Modal>

      <Modal open={modal.type === "Detail"} onCancel={closeAllModals} footer={null} width={1050} centered destroyOnClose>
        <CarburantDetail idCarburant={modal.id} allIds={allIds} />
      </Modal>
    </div>
  );
};

export default Carburant;
