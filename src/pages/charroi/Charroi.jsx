import { useEffect, useState } from 'react';
import { Table, Button, Image, Tabs, Input, message, Dropdown, Menu, Space, Tooltip, Popconfirm, Tag, Modal, notification } from 'antd';
import { ExportOutlined, CarOutlined, DeleteOutlined, EyeOutlined, TruckOutlined, CalendarOutlined, PrinterOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons';
import CharroiForm from './charroiForm/CharroiForm';
import TabPane from 'antd/es/tabs/TabPane';
import { getVehicule, putVehicule } from '../../services/charroiService';
import config from '../../config';
import vehiculeImg from './../../assets/vehicule.png'
import VehiculeDetail from './vehiculeDetail/VehiculeDetail';
import Modele from '../modeles/Modele';
import Marque from '../marque/Marque';

const { Search } = Input;

const Charroi = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);
  const [pagination, setPagination] = useState({
          current: 1,
          pageSize: 15,
      });
  const scroll = { x: 'max-content' };
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [idVehicule, setIdVehicule] = useState('');
  const [activeKey, setActiveKey] = useState(['1', '2']);
  
  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const handleEdit = (id) => {
  };

  const handleDelete = async (id) => {
 try {
      await putVehicule(id);
      setData(data.filter((item) => item.id_vehicule !== id));
      message.success('Suppression du véhicule effectuée avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

    const fetchData = async () => {
      try {
        const { data } = await getVehicule();
        setData(data.data);
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

  const handleAddClient = (id) => openModal('Add', id)
  const handleDetail = (id) => openModal('Detail', id)

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, idVehicule = '') => {
    closeAllModals();
    setModalType(type);
    setIdVehicule(idVehicule)
  };

  
  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    // Logic to export data to PDF
    message.success('Exporting to PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        Export to Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        Export to PDF
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { 
      title: '#', 
      dataIndex: 'id', 
      key: 'id', 
      render: (text, record, index) => (
        <Tooltip title={`Ligne ${index + 1}`}>
          <Tag color="blue">{index + 1}</Tag>
        </Tooltip>
      ),
      width: "4%" 
    },
    {
      title: 'Image',
      dataIndex: 'img',
      key: 'img',
      render: (text, record) => (
        <div className="userList">
          <Image
            className="userImg"
            src={ record.img ? `${DOMAIN}/${record.img}` : vehiculeImg}
            width={40}
            height={40}
            style={{ borderRadius: '50%' }}
            alt="Profil vehicule"
          />
        </div>
      ),
    },
    {
        title: 'Matricule',
        dataIndex: 'immatriculation',
        render: (text) => (
            <div className="vehicule-matricule">
                <span className="car-wrapper">
                    <span className="car-boost" />
                        <CarOutlined className="car-icon-animated" />
                    <span className="car-shadow" />
                </span>
                <Tag color="geekblue">{text}</Tag>
            </div>
        )
    }, 
    {
        title: 'Marque',
        dataIndex: 'nom_marque',
            render: (text, record) => (
                <Tag icon={<CarOutlined />} color="cyan">
                    {text}
                </Tag>
            )
    },
    {
      title: 'Modèle',
      dataIndex: 'modele',
      render : (text) => (
        <Tag icon={<CarOutlined />} color="green">
            {text ?? 'Aucun'}
        </Tag>
      )

    },
    {
        title: 'Categorie',
        dataIndex: 'nom_cat',
        render : (text) => (
          <Tag icon={<CarOutlined />} color="geekblue">
              {text ?? 'Aucun'}
          </Tag>
        )
  
    },
    {
      title: 'Année de fab.',
      dataIndex: 'annee_fabrication',
      render: text => (
        <Tooltip title="Annee fabrication">
            <Tag icon={<CalendarOutlined />} color="magenta">
                {text}
            </Tag>
        </Tooltip>
      )
    },
    {
      title: 'Année circu.',
      dataIndex: 'annee_circulation',
      render: text => (
        <Tooltip title="annee circulation'">
          <Tag icon={<CalendarOutlined />} color="magenta">
                {text}
            </Tag>
        </Tooltip>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle" style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <Tooltip title="Voir les détails">
                <Button
                icon={<EyeOutlined />}
                aria-label="Voir les détails de la tâche"
                style={{ color: 'blue' }}
                onClick={()=> handleDetail(record.id_vehicule)}
                />
            </Tooltip>
            <Tooltip title="Supprimer">
                <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer ce véhicule ?"
                    onConfirm={() => handleDelete(record.id_vehicule)}
                    okText="Oui"
                    cancelText="Non"
                >
                    <Button
                        icon={<DeleteOutlined />}
                        style={{ color: 'red' }}
                        aria-label="Delete client"
                    />
                </Popconfirm>
            </Tooltip>
        </Space>
      ),
    }
  ];

  const filteredData = data.filter(item =>
    item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase())
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
              <span style={{display:'flex', alignItems:'center'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#007BFF" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3v13h2a3 3 0 1 0 6 0h2a3 3 0 1 0 6 0h1a1 1 0 0 0 1-1v-4l-3-4ZM6 18a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm10-1a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-4-2H5V6h11v9Zm1-3V9h2.2l2 3H13Z"/>
                </svg>

                <span>
                  Véhicule
                </span>
              </span>
            }
            key="1"
          >
            <div className="client">
              <div className="client-wrapper">
                <div className="client-row">
                  <div className="client-row-icon">
                    <TruckOutlined className='client-icon'/>
                  </div>
                  <h2 className="client-h2">Liste des vehicules</h2>
                </div>
                <div className="client-actions">
                  <div className="client-row-left">
                    <Search placeholder="Recherche..." 
                      enterButton 
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                  <div className="client-rows-right">
                    <Button
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      onClick={handleAddClient}
                    >
                      Ajouter un véhicule
                    </Button>
                    <Dropdown overlay={menu} trigger={['click']} className='client-export'>
                      <Button icon={<ExportOutlined />}>Export</Button>
                    </Dropdown>
                    <Button
                      icon={<PrinterOutlined />}
                      onClick={handlePrint}
                      className='client-export'
                    >
                      Print
                    </Button>
                  </div>
                </div>
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  onChange={(pagination)=> setPagination(pagination)}
                  rowKey="id_vehicule"
                  rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                  bordered
                  size="small" 
                  scroll={scroll}
                  loading={loading}
                />
              </div>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span style={{display:'flex', alignItems:'center', gap:'2px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="yellow" viewBox="0 0 24 24" stroke-width="1.5" stroke="red">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>

                <span>
                  Modèle
                </span>
              </span>
            }
            key="2"
          >
            <Modele/>
          </TabPane>

          <TabPane
            tab={
              <span style={{display:'flex', alignItems:'center', gap:'2px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgb(255, 100, 50)">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>

                <span>
                  Marque
                </span>
              </span>
            }
            key="3"
          >
            <Marque/>
          </TabPane>
      </Tabs>
 
      <Modal
        title=""
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <CharroiForm idVehicule={''} closeModal={() => setModalType(null)} fetchData={fetchData}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'Detail'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <VehiculeDetail idVehicule={idVehicule} closeModal={() => setModalType(null)} fetchData={fetchData}/>
      </Modal>
    </>
  );
};

export default Charroi;