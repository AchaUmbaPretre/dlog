import { useEffect, useState } from 'react';
import { Table, Button, Space, Tabs, Tooltip, Popconfirm, Modal, Typography, Input, message, Dropdown, Menu, notification, Tag } from 'antd';
import { ExportOutlined, DeleteOutlined, ApartmentOutlined, GlobalOutlined, TagsOutlined, PrinterOutlined, EditOutlined, PlusOutlined, MoreOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { getLocalisation } from '../../../services/transporteurService';
import LocalisationFormMulti from './localisationForm/LocalisationFormMulti';
import LocalisationForm from './localisationForm/LocalisationForm';
import TabPane from 'antd/es/tabs/TabPane';
import Localite from '../localite/Localite';
import Trajet from '../trajet/Trajet';

const { Search } = Input;
const { Text } = Typography;

const Localisation = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const scroll = { x: 'max-content' };
  const [localisationId, setLocalisationId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [activeKey, setActiveKey] = useState(['1', '2']);
  const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 15,
    });
  
  
    const handleTabChange = (key) => {
        setActiveKey(key);
      };

    const fetchData = async () => {
      try {
        const { data } = await getLocalisation();

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

    const closeAllModals = () => {
        setModalType(null);
    };

    const openModal = (type, localisationId = '') => {
        closeAllModals();
        setModalType(type);
        setLocalisationId(localisationId)
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
    dataIndex: 'nom',
    key: 'nom',
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
    title: (
      <Space>
        <TagsOutlined style={{ color: '#fa8c16' }} />
        <Text strong>Type</Text>
      </Space>
    ),
    dataIndex: 'type_loc',
    key: 'type_loc',
    align: 'center',
    render: (text) => (
      <Text type="secondary">{text?.toUpperCase()}</Text>
    ),
  },
  {
    title: (
      <Space>
        <ApartmentOutlined style={{ color: '#722ed1' }} />
        <Text strong>Parent</Text>
      </Space>
    ),
    dataIndex: 'parent',
    key: 'parent',
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text ?? 'Aucun'}>
        <Text>{text ?? <Text type="secondary">Aucun</Text>}</Text>
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
            onClick={() => handleEdit(record.id_localisation)}
            aria-label="Modifier"
          />
        </Tooltip>
        <Tooltip title="Supprimer définitivement">
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette localisation ?"
            onConfirm={() => handleDelete(record.id_frequence)}
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

  const  getActionMenu = (openModal) => {
    const handleClick = ({ key }) => {
        switch (key) {
            case 'add' : 
                openModal('Add')
                break
            case 'addMulti' :
                openModal('AddMulti')
                break
            default : 
                break;
        }
    };

    return (
        <Menu onClick={handleClick}>
            <Menu.Item key="add">
                <PlusOutlined style={{ color: 'orange' }} /> Ajouter
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="addMulti">
                <PlusOutlined style={{ color: 'orange' }} /> Ajouter Multi
            </Menu.Item>
        </Menu>
    )
  }

  const filteredData = data.filter(item =>
    item.nom?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.type_loc?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.parent?.toLowerCase().includes(searchValue.toLowerCase())
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
                        📍Localisation
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
                        <h2 className="client-h2">Localisation</h2>
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
                            <Dropdown overlay={getActionMenu(openModal)} trigger={['click']}>
                                <Button
                                    type="text"
                                    icon={<MoreOutlined />}
                                    style={{
                                    color: '#595959',              
                                    backgroundColor: '#f5f5f5',    
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '4px',
                                    boxShadow: 'none',
                                    }}
                                />
                            </Dropdown>

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
                        🏘️ Localité
                    </span>
                }
                key="2"
            >
                <Localite/>
            </TabPane>

            <TabPane
                tab={
                    <span>
                         🛣️ Trajets
                    </span>
                }
                key="3"
            >
                <Trajet/>
            </TabPane>
        </Tabs>


      <Modal
        title=""
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <LocalisationForm closeModal={() => setModalType(null)} fetchData={fetchData}  localisationId={localisationId} />
      </Modal>

       <Modal
        title=""
        visible={modalType === 'AddMulti'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <LocalisationFormMulti closeModal={() => setModalType(null)} fetchData={fetchData}  localisationId={localisationId} />
      </Modal>
    </>
  );
};

export default Localisation;