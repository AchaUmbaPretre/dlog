import { useEffect, useState } from 'react';
import { Table, Button, Skeleton, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Tabs } from 'antd';
import { ExportOutlined, PrinterOutlined, EnvironmentOutlined, BankOutlined, ApartmentOutlined,EditOutlined, DeleteOutlined} from '@ant-design/icons';
import { getBins, putDeleteBins } from '../../services/batimentService';
import BinForm from '../batiment/bins/binsForm/BinForm';
import AdresseForm from '../adresse/adresseForm/AdresseForm';
import TabPane from 'antd/es/tabs/TabPane';
import Adresse from '../adresse/Adresse';

const { Search } = Input;

const ListBinGlobal = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [idBins, setIdBins] = useState('')
  const scroll = { x: 400 };
  const [modalType, setModalType] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });
  const [activeKey, setActiveKey] = useState(['1', '2']);
  const [statistique, setStatistique] = useState(null);


  const handleDelete = async (id) => {
    try {
      await putDeleteBins(id);
      setData(data.filter((item) => item.id !== id));
      message.success('Departement supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

    const fetchData = async () => {
      try {
         const { data } = await getBins();
        setData(data?.data);
        setStatistique(data?.statistiques)
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

  const handleAddresse = (idBin) => openModal('Addresse', idBin);
  const handleAdd = (idBin) => openModal('Add', idBin);


  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, idBin = '') => {
    setModalType(type);
    setIdBins(idBin)
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
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: "4%"
    },
    { 
        title: 'Batiment', 
        dataIndex: 'nom_batiment', 
        key: 'nom_batiment',
        render: (text, record) => (
          <Space onClick={()=>handleAddresse(record.id)}>
            <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
          </Space>
        ),
      },
    { 
      title: 'Nom', 
      dataIndex: 'nom', 
      key: 'nom',
      render: (text, record) => (
        <Tooltip title="Ajouter une adresse pour ce bin">
          <Space onClick={()=>handleAddresse(record.id)}>
            <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
        </Tooltip>
      ),
    },
    { 
      title: 'Superficie', 
      dataIndex: 'superficie', 
      key: 'superficie',
      render: text => (
        <Tag color='volcano'>{text ? `${text} m²` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Longueur', 
      dataIndex: 'longueur', 
      key: 'longueur',
      render: text => (
        <Tag color='geekblue'>{text ? `${text} L` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Largeur', 
      dataIndex: 'largeur', 
      key: 'largeur',
      render: text => (
        <Tag color='geekblue'>{text ? `${text} W` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Hauteur', 
      dataIndex: 'hauteur', 
      key: 'hauteur',
      render: text => (
        <Tag color='geekblue'>{text ? `${text} H` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Capacité', 
      dataIndex: 'capacite', 
      key: 'capacite',
      render: text => (
        <Tag color='gold'>{text ? `${text} m³` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Statut', 
      dataIndex: 'statut', 
      key: 'statut',
      render: text => (
        <Tag color='green'>{text || "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Type de Stockage', 
      dataIndex: 'type_stockage', 
      key: 'type_stockage',
      render: text => (
        <Tag color='purple'>{text || "Non spécifié"}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleAdd(record.id)}
              style={{ color: 'green' }}
              aria-label="Modifier entrepôt"
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cet entrepôt ?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Supprimer entrepôt"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveKey(key);
  };
  

  const filteredData = data.filter(item =>
    item.nom_batiment?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.statut?.toLowerCase().includes(searchValue.toLowerCase())
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
                <ApartmentOutlined style={{ color: '#722ed1' }} /> Liste des bins
              </span>
            }
            key="1"
          >
            <div className="client">
              <div className="client-wrapper">
                <div className="client-rows">
                  <div className="client-row">
                    <div className="client-row-icon">
                      <BankOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Bins</h2>
                  </div>

                      <div className='client-row-lefts'>
                        <span className='client-title'>
                        Resumé :
                        </span>
                        <div className="client-row-sou">
                          {loading ? (
                            <Skeleton active paragraph={{ rows: 1 }} />
                          ) : (
                              <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'10px'}}>
                                <span style={{fontSize:'.8rem',  fontWeight:'200'}}>#Bins : <strong>{statistique?.nbre_bin}</strong></span>
                                <span style={{fontSize:'.8rem',  fontWeight:'200'}}>#Superficie : <strong>{Math.round(parseFloat(statistique?.total_superficie)).toLocaleString() || 0}</strong></span>
                                <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                                  #Longueur : <strong>
                                    {Math.round(parseFloat(statistique?.total_longueur)).toLocaleString() || 0}</strong>
                                </span>

                                <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                                  #Largeur  : <strong>
                                    { Math.round(parseFloat(statistique?.total_largeur)).toLocaleString() || 0}</strong>
                                </span>

                                <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                                  #Hauteur : <strong>
                                    { Math.round(parseFloat(statistique?.total_hauteur)).toLocaleString() || 0}</strong>
                                </span>

                                <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                                  #Capacité : <strong>
                                    { Math.round(parseFloat(statistique?.total_capacite)).toLocaleString() || 0}</strong>
                                </span>
                              </div>
                          )}
                        </div>
                      </div>
                </div>

                <div className="client-actions">
                  <div className="client-row-left">
                    <Search placeholder="Recherche..." 
                      enterButton 
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                  <div className="client-rows-right">
        {/*               <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={handleAddClient}
                      >
                        Entrepot
                      </Button> */}
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
                    pagination={pagination}
                    onChange={(pagination) => setPagination(pagination)}
                    rowKey="key"
                    bordered
                    size="middle"
                    scroll={scroll}
                    loading={loading}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                  />
                </div>
            </div>

            <Modal
                title=""
                visible={modalType === 'Add'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
            >
              <BinForm idBatiment={''} closeModal={()=>setModalType(null)} fetchData={fetchData} idBins={idBins}/>
            </Modal>

            <Modal
              title=""
              visible={modalType === 'Addresse'}
              onCancel={closeAllModals}
              width={700}
              footer={null}
              centered
            >
              <AdresseForm closeModal={()=>setModalType(null)} fetchData={fetchData} idBin={idBins}  />
            </Modal> 
          </TabPane>

          <TabPane
            tab={
              <span>
                <EnvironmentOutlined style={{ color: 'red' }} /> Liste des adresses
              </span>
            }
            key="2"
          >
            <Adresse/>
          </TabPane>
        </Tabs>
    </>
  );
};

export default ListBinGlobal;
