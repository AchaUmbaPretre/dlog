import { useEffect, useState } from 'react';
import { Table, Button, Dropdown, Input, Space, Modal } from 'antd';
import { 
  ExportOutlined, 
  PrinterOutlined, 
  GlobalOutlined, 
  PlusCircleOutlined, 
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import GeofencesForm from './geofencesForm/GeofencesForm';
import { getGeofenceDlog } from '../../../services/geofenceService';

const { Search } = Input;

const Geofences = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [idGeofence, setIdGeofence] = useState('');
  const [modalType, setModalType] = useState(null);
  const [data, setData] = useState([]);

    const fetchData = async() => {
        try {
            const { data } = await getGeofenceDlog();
            setData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
    fetchData()
  },[]);

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
    item.nom_destination?.toLowerCase().includes(searchValue.toLowerCase()) ||
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
    { title: 'Type', dataIndex: 'nom_catGeofence', key: 'nom_catGeofence' },
    { title: 'Destination', dataIndex: 'nom_destination', key: 'nom_destination' },
    { title: 'Client', dataIndex: 'nom_client', key: 'nom_client' },
    {
      title: 'Actions',
      key: 'actions',
      width: '100px',
      render: (_, record) => (
        <Space style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => console.log('Supprimer', record)}></Button>
        </Space>
      ),
    },
  ];


  // Placeholder fonctions
    const handleAddClient = (idGeofence) => {
        openModal('Add', idGeofence);
    };

    const handleUpdate = (idGeofence) => {
        openModal('Add', idGeofence);
    }
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
          width={1210}
          centered
        >
          <GeofencesForm closeModal={() => setModalType(null)} fetchData={fetchData} idGeofence={idGeofence} />
        </Modal>
    </>
  );
};

export default Geofences;