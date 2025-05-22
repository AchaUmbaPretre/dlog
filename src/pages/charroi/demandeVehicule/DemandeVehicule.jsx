import { useEffect, useState } from 'react';
import { Table, Button, Space, Tooltip, Popconfirm, Modal, Typography, Input, message, Dropdown, Menu, notification, Tag } from 'antd';
import { ExportOutlined, InfoCircleOutlined, UserOutlined, CarOutlined, DeleteOutlined, LogoutOutlined, LoginOutlined, PlusCircleOutlined, FieldTimeOutlined, AimOutlined, ClockCircleOutlined, PrinterOutlined, EditOutlined, EnvironmentOutlined } from '@ant-design/icons';
import DemandeVehiculeForm from './demandeVehiculeForm/DemandeVehiculeForm';
import { getDemandeVehicule } from '../../../services/charroiService';

const { Search } = Input;
const { Text } = Typography;

const DemandeVehicule = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const scroll = { x: 'max-content' };
  const [localiteId, setLocaliteId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 15,
    });
  
    const fetchData = async () => {
      try {
         const { data } = await getDemandeVehicule();

        setData(data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };
  
    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = () => {

    }
  
    const handleEdit = (id) => openModal('Add', id)

    const handleAdd = () => openModal('Add')

    const closeAllModals = () => {
        setModalType(null);
    };

    const openModal = (type, localisationId = '') => {
        closeAllModals();
        setModalType(type);
        setLocaliteId(localisationId)
    };

    const handleExportExcel = () => {
        message.success('Exporting to Excel...');
    };

    const handleExportPDF = () => {
        message.success('Exporting to PDF...');
    };

    const handlePrint = () => {
        window.print();
    };

    const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        <Tag icon={<ExportOutlined />} color="green">Export to Excel</Tag>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        <Tag icon={<ExportOutlined />} color="blue">Export to PDF</Tag>
      </Menu.Item>
    </Menu>
  );

const columns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    render: (text, record, index) => {
      const pageSize = pagination.pageSize || 10;
      const pageIndex = pagination.current || 1;
      return (pageIndex - 1) * pageSize + index + 1;
    },
    width: "4%",
  },
  {
    title: (
      <Space>
        <LoginOutlined style={{ color: '#1890ff' }} />
        <Text strong>Date chargement</Text>
      </Space>
    ),
    dataIndex: 'date_chargement',
    key: 'date_chargement',
    ellipsis: { showTitle: false },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
  },
  {
    title: (
      <Space>
        <LogoutOutlined style={{ color: '#52c41a' }} />
        <Text strong>Date départ prévue</Text>
      </Space>
    ),
    dataIndex: 'date_depart',
    key: 'date_depart',
    ellipsis: { showTitle: false },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
  },
  {
    title: (
      <Space>
        <AimOutlined style={{ color: '#faad14' }} />
        <Text strong>Date retour</Text>
      </Space>
    ),
    dataIndex: 'date_retour',
    key: 'date_retour',
    align: 'center',
    render: (text) => <Text type="secondary">{text}</Text>,
  },
  {
    title: (
      <Space>
        <ClockCircleOutlined style={{ color: '#722ed1' }} />
        <Text strong>Délai prévu</Text>
      </Space>
    ),
    dataIndex: 'delai_prevu',
    key: 'delai_prevu',
    align: 'center',
    render: (text) => <Text type="secondary">{text}</Text>,
  },
  {
    title: (
      <Space>
        <CarOutlined style={{ color: '#eb2f96' }} />
        <Text strong>Type véhicule</Text>
      </Space>
    ),
    dataIndex: 'type_vehicule',
    key: 'type_vehicule',
    align: 'center',
    render: (text) => <Text type="secondary">{text}</Text>,
  },
  {
    title: (
      <Space>
        <InfoCircleOutlined style={{ color: '#13c2c2' }} />
        <Text strong>Motif</Text>
      </Space>
    ),
    dataIndex: 'motif',
    key: 'motif',
    align: 'center',
    render: (text) => <Text type="secondary">{text}</Text>,
  },
  {
    title: (
      <Space>
        <UserOutlined style={{ color: '#fa541c' }} />
        <Text strong>Demandeur</Text>
      </Space>
    ),
    dataIndex: 'id_demandeur',
    key: 'id_demandeur',
    align: 'center',
    render: (text) => <Text type="secondary">{text}</Text>,
  },
  {
    title: (
      <Text strong>Actions</Text>
    ),
    key: 'action',
    align: 'center',
    width: '120px',
    render: (text, record) => (
      <Space size="middle">
        <Tooltip title="Modifier cette localisation">
          <Button
            type="text"
            icon={<EditOutlined />}
            style={{ color: '#1890ff' }}
            onClick={() => handleEdit(record.id_localite)}
            aria-label="Modifier"
          />
        </Tooltip>
        <Tooltip title="Supprimer définitivement">
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette localisation ?"
            onConfirm={() => handleDelete(record.id_localite)}
            okText="Oui"
            cancelText="Non"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              style={{ color: '#ff4d4f' }}
              aria-label="Supprimer"
            />
          </Popconfirm>
        </Tooltip>
      </Space>
    ),
  },
];


  const filteredData = data.filter(item =>
    item.nom_localite?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <EnvironmentOutlined className='client-icon' style={{color:'red'}} />
            </div>
            <h2 className="client-h2">Liste des demandes</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
                <Search 
                    placeholder="Recherche..." 
                    enterButton 
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <div className="client-rows-right">
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={handleAdd}
                >
                    Ajouter
                </Button>

                <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon={<ExportOutlined />}>Export</Button>
                </Dropdown>
                
                <Button
                    icon={<PrinterOutlined />}
                    onClick={handlePrint}
                >
                    Print
                </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            onChange={(pagination) => setPagination(pagination)}
            rowKey="id"
            bordered
            size="small"
            scroll={scroll}
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={950}
        centered
      >
        <DemandeVehiculeForm closeModal={() => setModalType(null)} fetchData={fetchData} localiteId={localiteId} />
      </Modal>
    </>
  );
};

export default DemandeVehicule;