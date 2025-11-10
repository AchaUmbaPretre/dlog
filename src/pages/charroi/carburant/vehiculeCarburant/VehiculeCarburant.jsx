import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Typography,
  Tag,
  Tooltip,
  Card,
  notification,
  Empty,
} from "antd";
import {
  RetweetOutlined,
  ThunderboltOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getCarburantVehicule } from '../../../../services/carburantService';
import RelierCarburantVehicule from '../relierCarburantVehicule/RelierCarburantVehicule';

const { Search } = Input;
const { Text, Title } = Typography;

const VehiculeCarburant = () => {
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const closeAllModals = () => setModalType(null);
  const openModal = (type) => setModalType(type);

  const handleRelier = () => {
    openModal('Relier')
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getCarburantVehicule();
      setData(data);
    } catch (error) {
      notification.error({
        message: "Erreur de chargement",
        description: "Impossible de récupérer les données des véhicules.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Confirmer la suppression",
      icon: <ExclamationCircleOutlined />,
      content: `Voulez-vous vraiment supprimer le véhicule ${record.immatriculation} ?`,
      okText: "Oui",
      cancelText: "Non",
      onOk: () => {
        console.log("Supprimer", record);
      },
    });
  };


  const filteredData = data.filter(
    (item) =>
      item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.nom_modele?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: "Marque", dataIndex: "nom_marque", key: "nom_marque" },
    { title: "Modèle", dataIndex: "nom_modele", key: "nom_modele" },
    {
      title: "Immatric.",
      dataIndex: "immatriculation",
      key: "immatriculation",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Num série",
      dataIndex: "num_serie",
      key: "num_serie",
      render: (text) => <Tag color={text ? "blue" : "default"}>{text || "N/A"}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (record) => (
        <Tooltip title="Supprimer">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="carburant-page">
      <Card
        title={
          <Space>
            <ThunderboltOutlined style={{ color: "#fa541c", fontSize: 22 }} />
            <Title level={4} style={{ margin: 0 }}>
              Véhicule & Groupe électrogène
            </Title>
          </Space>
        }
        bordered={false}
        className="shadow-sm rounded-2xl"
        extra={
          <Space wrap>
            <Search
              placeholder="Recherche marque ou véhicule..."
              allowClear
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 260 }}
            />
            <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
              Actualiser
            </Button>
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => openModal("Add")}>
              Nouveau
            </Button>
            <Button icon={<RetweetOutlined />} onClick={handleRelier}>Rélier</Button>
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
          rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
          locale={{
            emptyText: <Empty description="Aucune donnée disponible" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
          bordered
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
            <RelierCarburantVehicule closeModal={closeAllModals} fetchData={fetchData} />
        </Modal>
    </div>
  );
};

export default VehiculeCarburant;
