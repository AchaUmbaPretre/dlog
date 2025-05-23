import { useEffect, useState } from 'react';
import { Table, Button, Space, Badge, Tooltip, Popconfirm, Modal, Typography, Input, message, Dropdown, Menu, notification, Tag } from 'antd';
import { ExportOutlined, DeleteOutlined, CalendarOutlined, LogoutOutlined, LoginOutlined, PlusCircleOutlined, FieldTimeOutlined, AimOutlined, ClockCircleOutlined, PrinterOutlined, EditOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { getTrajet } from '../../../services/transporteurService';
import TrajetForm from './trajetForm/TrajetForm';
import moment from 'moment';

const { Search } = Input;
const { Text } = Typography;

const Trajet = () => {
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
        const { data } = await getTrajet();

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
        <Text strong>Départ → Destination</Text>
      </Space>
    ),
    dataIndex: 'depart_destination',
    key: 'depart_destination',
    ellipsis: true,
    render: (text) => (
      <Tooltip title={text}>
        <Tag color="blue">{text}</Tag>
      </Tooltip>
    ),
  },
  {
    title: (
      <Space>
        <LogoutOutlined style={{ color: '#52c41a' }} />
        <Text strong>Itinéraire</Text>
      </Space>
    ),
    dataIndex: 'itineraire_complet',
    key: 'itineraire_complet',
    ellipsis: true,
    render: (text) => (
      <Tooltip title={text}>
        <Text style={{ fontStyle: 'italic' }} type="secondary">{text}</Text>
      </Tooltip>
    ),
  },
  {
    title: (
      <Space>
        <AimOutlined style={{ color: '#faad14' }} />
        <Text strong>km</Text>
      </Space>
    ),
    dataIndex: 'distance',
    key: 'distance',
    align: 'center',
    render: (text) => <Badge count={`${text} km`} style={{ backgroundColor: '#faad14' }} />,
  },
  {
    title: (
      <Space>
        <ClockCircleOutlined style={{ color: '#722ed1' }} />
        <Text strong>Départ</Text>
      </Space>
    ),
    dataIndex: 'date_depart',
    key: 'date_depart',
    align: 'center',
    render: (text) => {
      const formattedDate = moment(text).format('DD-MM-YYYY');
      <Tooltip placement="center" title={formattedDate}>
        <Tag icon={<CalendarOutlined />} color="green">{formattedDate}</Tag>
      </Tooltip>
    }
  },
  {
    title: (
      <Space>
        <FieldTimeOutlined style={{ color: '#eb2f96' }} />
        <Text strong>Arrivée</Text>
      </Space>
    ),
    dataIndex: 'date_arrivee',
    key: 'date_arrivee',
    align: 'center',
    render: (text) => <Text type="secondary">{text}</Text>,
  },
  {
    title: <Text strong>Modes trans.</Text>,
    dataIndex: 'modes_transport',
    key: 'modes_transport',
    align: 'center',
    render: (text) => (
      <>
        {text.split(',').map((mode) => (
          <Tag color="green" key={mode.trim()}>{mode.trim()}</Tag>
        ))}
      </>
    ),
  },
  {
    title: <Text strong>Durée</Text>,
    dataIndex: 'duree_jours',
    key: 'duree_jours',
    align: 'center',
    render: (text) => <Tag color="purple">{text} j</Tag>,
  },
  {
    title: <Text strong>Total (€)</Text>,
    dataIndex: 'total',
    key: 'total',
    align: 'center',
    render: (text) => (
      <Text style={{ fontWeight: 'bold', color: '#3f8600' }}>
        {parseFloat(text).toFixed(2)} €
      </Text>
    ),
  },
  {
    title: <Text strong>Actions</Text>,
    key: 'action',
    align: 'center',
    width: '100px',
    render: (text, record) => (
      <Space size="middle">
        <Tooltip title="Modifier ce trajet">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            aria-label="Modifier"
          />
        </Tooltip>
        <Tooltip title="Supprimer définitivement">
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce trajet ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label="Supprimer"
            />
          </Popconfirm>
        </Tooltip>
      </Space>
    ),
  },
];

  const filteredData = data.filter(item =>
    item.depart_destination?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <EnvironmentOutlined className='client-icon' style={{color:'red'}} />
            </div>
            <h2 className="client-h2">Trajet</h2>
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
        <TrajetForm closeModal={() => setModalType(null)} fetchDatas={fetchData} localiteId={localiteId} />
      </Modal>
    </>
  );
};

export default Trajet;