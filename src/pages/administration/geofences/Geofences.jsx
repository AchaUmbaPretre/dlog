import { useState } from 'react';
import { Table, Button, Dropdown, Input, Space, Modal } from 'antd';
import { 
  ExportOutlined, 
  PrinterOutlined, 
  GlobalOutlined, 
  PlusCircleOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import GeofencesForm from './geofencesForm/GeofencesForm';

const { Search } = Input;

const Geofences = ({ data = [] }) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [idGeofence, setIdGeofence] = useState('');
  const [modalType, setModalType] = useState(null);
  
  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, idGeofence = '') => {
    closeAllModals();
    setModalType(type);
    setIdGeofence(idGeofence);
  };

  // Filtrage sécurisé
  const filteredData = data?.filter(item =>
    item.nom_falcon?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.type_geofence?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase())
  ) || [];

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
      width: '5%',
    },
    { title: 'Nom Falcon', dataIndex: 'nom_falcon', key: 'nom_falcon' },
    { title: 'Nom', dataIndex: 'nom', key: 'nom' },
    { title: 'Type', dataIndex: 'type_geofence', key: 'type_geofence' },
    { title: 'Client', dataIndex: 'nom_client', key: 'nom_client' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => console.log('Modifier', record)}>Modifier</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => console.log('Supprimer', record)}>Supprimer</Button>
        </Space>
      ),
    },
  ];

  // Placeholder fonctions
  const handleAddClient = () => console.log('Ajouter Geofence');
  const handlePrint = () => console.log('Imprimer');
  const menu = (
    <div style={{ padding: 10 }}>
      <Button type="text" icon={<ExportOutlined />}>Export Excel</Button>
      <Button type="text" icon={<ExportOutlined />}>Export CSV</Button>
    </div>
  );

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                <div className="client-row-icon">
                    <GlobalOutlined className='client-icon'/>
                </div>
                <h2 className="client-h2">Gestion des Geofences</h2>
                </div>

                <div className="client-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Search
                    placeholder="Recherche..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ width: 300 }}
                />

                <Space>
                    <Button type="primary" icon={<PlusCircleOutlined />} onClick={handleAddClient}>
                    Ajouter Geofence
                    </Button>
                    <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon={<ExportOutlined />}>Export</Button>
                    </Dropdown>
                    <Button icon={<PrinterOutlined />} onClick={handlePrint}>Imprimer</Button>
                </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    bordered
                    size="middle"
                    scroll={{ x: 400 }}
                    loading={loading}
                    pagination={pagination}
                    onChange={setPagination}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />
            </div>
        </div>
        <Modal
            title=""
            visible={modalType === 'Add'}
            onCancel={closeAllModals}
            footer={null}
            width={1050}
            centered
        >
            <GeofencesForm closeModal={() => setModalType(null)} />
        </Modal>
    </>
  );
};

export default Geofences;
