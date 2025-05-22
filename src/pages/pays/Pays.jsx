import { useEffect, useState } from 'react';
import { Table, Button, Space, Tabs, Tooltip, Popconfirm, Modal, Typography, Input, message, Dropdown, Menu, notification, Tag } from 'antd';
import { ExportOutlined, DeleteOutlined, PlusCircleOutlined, TagsOutlined, PrinterOutlined, EditOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { getPays } from '../../services/transporteurService';
import PaysForm from './paysForm/PaysForm';
import TabPane from 'antd/es/tabs/TabPane';
import Province from '../province/Province';
import Ville from '../ville/Ville';

const { Search } = Input;
const { Text } = Typography;

const Pays = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const scroll = { x: 'max-content' };
  const [paysId, setPaysId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 15,
    });
  const [activeKey, setActiveKey] = useState(['1', '2']);

  
    const fetchData = async () => {
      try {
        const { data } = await getPays();

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

    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    const handleDelete = () => {

    }
  
    const handleEdit = (id) => openModal('Add', id)

    const handleAdd = () => openModal('Add')

    const closeAllModals = () => {
        setModalType(null);
    };

    const openModal = (type, paysId = '') => {
        closeAllModals();
        setModalType(type);
        setPaysId(paysId)
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
    width: "4%"
  },
  {
    title: (
      <Space>
        <EnvironmentOutlined style={{ color: 'red' }} />
        <Text strong>Nom</Text>
      </Space>
    ),
    dataIndex: 'nom_pays',
    key: 'nom_pays',
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
  },
  {
    title: <Text strong>Actions</Text>,
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
    item.nom_pays?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
        <Tabs
            activeKey={activeKey[0]}
            onChange={handleTabChange}
            type="card"
            tabPosition="top"
            renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} />}
        >
            <TabPane
                tab={
                    <span>
                        🌍 Pays
                    </span>
                }
                key="1"
            >
                <div className="client">
                    <div className="client-wrapper">
                    <div className="client-row">
                        <div className="client-row-icon">
                        <EnvironmentOutlined className='client-icon' style={{color:'red'}} />
                        </div>
                        <h2 className="client-h2">Pays</h2>
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
            </TabPane>

            <TabPane
                tab={
                    <span>
                        🧭 Province
                    </span>
                }
                key="2"
            >
                <Province/>
            </TabPane>

            <TabPane
                tab={
                    <span>
                        📍 Ville
                    </span>
                }
                key="3"
            >
                <Ville/>
            </TabPane>
        </Tabs>

      <Modal
        title=""
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={700}
        centered
      >
        <PaysForm closeModal={() => setModalType(null)} fetchData={fetchData} paysId={paysId} />
      </Modal>
    </>
  );
};

export default Pays;