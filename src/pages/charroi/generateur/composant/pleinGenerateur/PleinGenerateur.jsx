import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  Button,
  Dropdown,
  Input,
  Space,
  Typography,
  Card,
  Empty,
  Checkbox,
  Modal,
  notification,
  message
} from "antd";
import {
  FireOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  DownOutlined,
  MenuOutlined
} from "@ant-design/icons";
import FormPleinGenerateur from "./formPleinGenerateur/FormPleinGenerateur";
import { deletePleinGenerateur, getPleinGenerateur } from "../../../../../services/generateurService";
import { useGenerateurColumns } from "./hooks/useGenerateurColumns";

const { Search } = Input;
const { Text, Title } = Typography;

const PleinGenerateur = () => {
 const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [columnsVisibility, setColumnsVisibility] = useState({
    "#": true,
    'N° Facture' : false,
    'N° Pc' : false,
    'Marque': true,
    "Code groupe": false,
    "Type gen.": true,
    "Type carburant": true,
    "Date operation": false,
    "Qté" : true,
    "Fournisseur": false,
    "P.U Usd": false,
    "P.U Cdf": false,
    "M. (CDF)" : true,
    "M. ($)": true,
    "Crée par" : false
  }); 
  const [modal, setModal] = useState({ type: null, id: null });

    const fetchData = async() => {
        setLoading(true);

        try {
            const response = await getPleinGenerateur();
            setData(response?.data || []);

        } catch (error) {
            notification.error({
                message: "Erreur de chargement",
                description: "Impossible de récupérer les données du générateur.",
                placement: "topRight",
            });
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

  const openModal = (type, id = null) => setModal({ type, id });
  const closeAllModals = () => setModal({ type: null, id: null });

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
  
    const handleDelete = useCallback(
        async (id) => {
          try {
            await deletePleinGenerateur(id);
            setData((prev) => prev.filter((item) => item.id_carburant !== id));
            message.success("Le plein a été supprimé avec succès");
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
    const columns = useGenerateurColumns({
        pagination,
        columnsVisibility,
        onEdit: (id) => openModal("Add", id),
        onDetail: (id) => openModal("Detail", id),
        onDelete: handleDelete,
    });

  const filteredData = useMemo(() => {
    const search = searchValue.toLowerCase().trim();
    if(!search) return data;
    return data.filter(
        (item) =>
            item.nom_marque?.toLowerCase().includes(search) || 
            item.nom_modele?.toLowerCase().includes(search) || 
            item.nom_type_gen?.toLowerCase().includes(search) || 
            item.nom_type_carburant?.toLowerCase().includes(search)
    );
  }, [data, searchValue]);

  return (
    <div className="carburant-page">
        <Card
        title={
          <Space>
            <FireOutlined style={{ color: "#fa541c", fontSize: 22 }} />
            <Title level={4} style={{ margin: 0 }}>
              Gestion des pleins générateurs
            </Title>
          </Space>
        }
        bordered={false}
        className="shadow-sm rounded-2xl"
        extra={
          <Space wrap>
            <Search
              placeholder="Recherche..."
              allowClear
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 260 }}
            />
            <Button
              icon={<ReloadOutlined />}
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
        open={modal.type === "Add"}
        onCancel={closeAllModals}
        footer={null}
        width={1200}
        centered
        destroyOnClose
      >
        <FormPleinGenerateur id_plein={""} fetchData={fetchData} closeModal={closeAllModals} />
      </Modal>
    </div>
  )
}

export default PleinGenerateur;