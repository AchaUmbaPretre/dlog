import { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Dropdown,
  Input,
  Space,
  Modal,
  Typography,
  Card,
  notification,
  Empty,
  Checkbox,
  Tooltip,
  Popconfirm
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
  EyeOutlined
} from "@ant-design/icons";
import GenerateurForm from "./generateurForm/GenerateurForm";
import { getGenerateur } from "../../../../services/generateurService";
import RelierGenerateur from "../composant/relierGenerateur/RelierGenerateur";
import DetailGenerateur from "../detailGenerateur/DetailGenerateur";

const { Search } = Input;
const { Text, Title } = Typography;

const ListGenerateur = () => {
 const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
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

    const fetchData = async() => {
        setLoading(true);

        try {
            const response = await getGenerateur();
            setData(response?.data || []);
            setAllIds([ ...new Set(data.map((d) => d.id_generateur) || [])]);

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
        {   title:"Marque", dataIndex: "nom_marque", key: "nom_marque"},
        {   title:"Modèle", dataIndex: "nom_modele", key: "nom_modèle"},
        {   title:"Type gen.", dataIndex: "nom_type_gen", key: "nom_type_gen"},
        {   title:"Type carburant", dataIndex: "nom_type_carburant", key: "nom_type_carburant"},
        {   title:"Puissance", dataIndex: "puissance", key: "puissance"},
        {   title:"Nbre cylindre", dataIndex: "nbre_cylindre", key: "nbre_cylindre"},
        {   title:"Valeur acq.", dataIndex: "valeur_acquisition", key: "valeur_acquisition"},
        {   title:"Reservoir", dataIndex: "reservoir", key: "reservoir"},
        {   title:"Largeur", dataIndex: "largeur", key: "largeur"},
        {   title:"Longueur", dataIndex: "longueur", key: "longueur"},
        {   title:"Crée par", dataIndex: "user_cr", key: "user_cr"},
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
        <GenerateurForm id_generateur={modal.id} closeModal={closeAllModals} fetchData={fetchData} />
      </Modal>

      <Modal
        open={modal.type === "Detail"}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
        destroyOnClose
      >
        <DetailGenerateur id_generateur={modal.id} closeModal={closeAllModals} fetchData={fetchData} allIds={allIds} />
      </Modal>

      <Modal
        open={modal.type === "Relier"}
        onCancel={closeAllModals}
        footer={null}
        width={1100}
        centered
        destroyOnClose
      >
        <RelierGenerateur closeModal={closeAllModals} fetchData={fetchData} />
      </Modal>
    </div>
  )
}

export default ListGenerateur