import { useState, useMemo } from "react";
import {
  Table,
  Button,
  Dropdown,
  Input,
  Space,
  Modal,
  Typography,
  Card,
  Empty,
  Checkbox,
  Tooltip,
  Popconfirm,
  Tag
} from "antd";
import {
  EditOutlined,
  FireOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  DownOutlined,
  MenuOutlined,
  RetweetOutlined,
  DeleteOutlined,
  EyeOutlined,
  TrademarkOutlined,
  TagsOutlined,
  ThunderboltOutlined
} from "@ant-design/icons";
import GenerateurForm from "./generateurForm/GenerateurForm";
import RelierGenerateur from "../composant/relierGenerateur/RelierGenerateur";
import DetailGenerateur from "../detailGenerateur/DetailGenerateur";
import { useListGenerateur } from "./hook/useListGenerateur";

const { Search } = Input;
const { Text, Title } = Typography;

const ListGenerateur = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchValue, setSearchValue] = useState("");
  const [columnsVisibility, setColumnsVisibility] = useState({
    "#": true,
    Marque: true,
    "Code groupe": false,
    "Type gen.": true,
    "Type carburant": true,
    Puissance: false,
    "Nbre cylindre" : true,
    "Valeur acq." : false,
    Reservoir: true,
    Longueur: true,
    "Crée par": false
  });
  const [modal, setModal] = useState({ type: null, id: null });
  const [allIds, setAllIds] = useState([]);
  const { data, loading, reload, setFilters } = useListGenerateur(null)

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

  const handleDelete = () => {

  }

  const columns = useMemo(() => {
    const allColumns = [
        {
            title: "#",
            key: "index",
            width: 40,
            align: "center",
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {   title:"Code groupe", dataIndex: "code_groupe", key: "code_groupe"},
        {
            title: "Marque",
            dataIndex: "nom_marque",
            key: "nom_marque",
            render: (text) => (
              <Text type="success">
                <TrademarkOutlined style={{ marginRight: 4 }} />
                {text}
              </Text>
            ),
        },
        {
            title: "Modèle",
            dataIndex: "nom_modele",
            key: "nom_modele",
              render: (text) => (
                <Tag
                  icon={<TagsOutlined />}
                  style={{
                    fontSize: 12,
                    padding: "2px 7px",
                    border: "1px solid #1677ff",
                    background: "transparent",
                    color: "#1677ff",
                  }}
                >
                  {text}
                </Tag>
              ),
        },
        {
            title: "Type gen.",
            dataIndex: "nom_type_gen",
            key: "nom_type_gen",
            render: (text) => (
              <Tag
                icon={<ThunderboltOutlined />}
                color="blue"
                style={{ fontSize: 12, padding: "3px 8px" }}
              >
                {text}
              </Tag>
            ),
        },
        {
            title: "Type carburant",
            dataIndex: "nom_type_carburant",
            key: "nom_type_carburant",
            render: (text) => {
              const isEssence = text?.toLowerCase() === "essence";

                return (
                  <Tag
                    color={isEssence ? "orange" : "purple"}
                    style={{ display: "flex", alignItems: "center", justifyContent:'center', gap: 6 }}
                  >
                    {isEssence ? <FireOutlined /> : <ThunderboltOutlined />}
                    {text}
                  </Tag>
                );
              },
        },
        {   title:"Puissance", dataIndex: "puissance", align: 'center', key: "puissance"},
        {   title:"Nbre cylindre", dataIndex: "nbre_cylindre", align: 'center', key: "nbre_cylindre"},
        {   title:"Valeur acq.", dataIndex: "valeur_acquisition", align: 'center', key: "valeur_acquisition"},
        {   title:"Reservoir", dataIndex: "reservoir", align: 'center', key: "reservoir"},
        {   title:"Largeur", dataIndex: "largeur", align: 'center', key: "largeur"},
        {   title:"Longueur", dataIndex: "longueur", align: 'center', key: "longueur"},
        {   title:"Crée par", dataIndex: "user_cr", align: 'center', key: "user_cr"},
        {
            title: "Actions",
            key: 'action',
            width: '10%',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Modifier">
                      <Button
                        icon={<EditOutlined />}
                        style={{ color: 'green' }}
                        onClick={() =>  openModal("Add", record.id_generateur)}
                        aria-label="Edit generateur"
                      />
                    </Tooltip>   
                    <Tooltip title="Voir les détails">
                      <Button
                        icon={<EyeOutlined />}
                        aria-label="Voir les détails"
                        style={{ color: "blue" }}
                        onClick={() => openModal("Detail", record.id_generateur)}
                      />
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cette ligne ?"
                        onConfirm={() => handleDelete(record.id_generateur)}
                        okText="Oui"
                        cancelText="Non"
                      >
                        <Button icon={<DeleteOutlined />} style={{ color: "red" }} aria-label="Delete" />
                      </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }

    ];
    return allColumns.filter((col) => columnsVisibility[col.title] !== false);
  }, [pagination, columnsVisibility]);

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
              Gestion des générateurs
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
              onClick={reload}
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
            <Button
              type="default"
              icon={<RetweetOutlined />}
              onClick={() => openModal("Relier")}
            >
              Rélier les générateurs
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
        width={1000}
        centered
        destroyOnClose
      >
        <GenerateurForm id_generateur={modal.id} closeModal={closeAllModals} fetchData={reload} />
      </Modal>

      <Modal
        open={modal.type === "Detail"}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
        destroyOnClose
      >
        <DetailGenerateur id_generateur={modal.id} closeModal={closeAllModals} fetchData={reload} allIds={allIds} />
      </Modal>

      <Modal
        open={modal.type === "Relier"}
        onCancel={closeAllModals}
        footer={null}
        width={1100}
        centered
        destroyOnClose
      >
        <RelierGenerateur closeModal={closeAllModals} fetchData={reload} />
      </Modal>
    </div>
  )
}

export default ListGenerateur