import { useEffect, useState } from 'react';
import { Table, Button, Dropdown, Input, Space, Modal } from 'antd';
import { 
  ExportOutlined, 
  PrinterOutlined, 
  FireOutlined,
  PlusCircleOutlined, 
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import './carburant.scss'
import { getCarburant } from '../../../services/carburantService';
import CarburantForm from './carburantForm/CarburantForm';

const { Search } = Input;

const Carburant = () => {
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
            const { data } = await getCarburant();
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
    { title: 'Num pc', dataIndex: 'num_pc', key: 'num_pc' },
    { title: 'No facture', dataIndex: 'num_facture', key: 'num_facture' },
    { title: 'Chauffeur', dataIndex: 'nom_chauffeur', key: 'nom_chauffeur' },
    { title: 'Véhicule', dataIndex: 'nom_vehicule', key: 'nom_vehicule' },
    { title: 'Fournisseur', dataIndex: 'nom_fournisseur', key: 'nom_fournisseur' },
    { title: 'Qté litres', dataIndex: 'quantite_litres', key: 'quantite_litres' },
    { title: 'P.U', dataIndex: 'prix_unitaire', key: 'prix_unitaire' },
    { title: 'Montant total', dataIndex: 'montant_total', key: 'montant_total' },
    { title: 'Compteur km', dataIndex: 'compteur_km', key: 'compteur_km' },
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
  const handleAddCarburant = (id_carburant) => {
    openModal('Add', id_carburant);
  };

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
                    <FireOutlined className='client-icon'/>
                </div>
                <h2 className="client-h2">Gestion des carburants</h2>
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
                    <Button type="primary" icon={<PlusCircleOutlined />} onClick={handleAddCarburant}>
                        Ajouter carburant
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
          width={1010}
          centered
        >
          <CarburantForm closeModal={() => setModalType(null)} fetchData={fetchData} idGeofence={idGeofence} />
       </Modal>
    </>
  );
};

export default Carburant;