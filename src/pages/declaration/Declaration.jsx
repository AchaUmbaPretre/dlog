import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Tag, Space, Tooltip, Popconfirm, Skeleton, Tabs } from 'antd';
import { MenuOutlined,EditOutlined,PieChartOutlined,EyeOutlined, DeleteOutlined, CalendarOutlined,DownOutlined,EnvironmentOutlined, HomeOutlined, FileTextOutlined, ToolOutlined, DollarOutlined, BarcodeOutlined,ScheduleOutlined,PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import { deletePutDeclaration, getDeclaration } from '../../services/templateService';
import DeclarationForm from './declarationForm/DeclarationForm';
import DeclarationFiltre from './declarationFiltre/DeclarationFiltre';
import moment from 'moment';
import DeclarationDetail from './declarationDetail/DeclarationDetail';
import DeclarationOneAll from './declarationOneAll/DeclarationOneAll';
import { useSelector } from 'react-redux';
import TabPane from 'antd/es/tabs/TabPane';
import RapportDeclaration from './rapportDeclaration/RapportDeclaration';

const { Search } = Input;

const Declaration = () => {
  const [loading, setLoading] = useState(true);
  const [columnsVisibility, setColumnsVisibility] = useState({
    '#': true,
    'Template': true,
    'Desc man': false,
    'Periode': false,
    'M² occupe': false,
    "M² facture": true,
    "Tarif Entr": true,
    'Debours Entr': true,
    'Total Entr': true,
    "TTC Entr": true,
    "Ville": true,
    "Client": true,
    "Bâtiment": false,
    "Manutention": true,
    "Tarif Manu": true,
    "Total Manu": true,
    "TTC Manu": true
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredDatas, setFilteredDatas] = useState(null);
  const [data, setData] = useState([]);
  const scroll = { x: 400 };
  const [idDeclaration, setidDeclaration] = useState('');
  const [idClient, setidClient] = useState('');
  const [modalType, setModalType] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const role = useSelector((state) => state.user?.currentUser.role);
  const [statistique, setStatistique] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
  });
  const [activeKey, setActiveKey] = useState(['1', '2']);

  const columnStyles = {
    title: {
      maxWidth: '220px',
      whiteSpace: 'nowrap',
      overflowX: 'scroll', 
      overflowY: 'hidden',
      textOverflow: 'ellipsis',
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none', 
    },
    titleClient: {
      maxWidth: '150px',
      whiteSpace: 'nowrap',
      overflowX: 'scroll', 
      overflowY: 'hidden',
      textOverflow: 'ellipsis',
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none', 
    },
    hideScroll: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  };

  const fetchData = async () => {
    try {
      const { data } = await getDeclaration(filteredDatas, searchValue);
  
      setData(data.declarations);
      setStatistique(data.totals);
      setLoading(false);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Gérer l'erreur 404
            notification.error({
                message: 'Erreur',
                description: `${error.response.data.message}`,
            });
        } else {
            notification.error({
                message: 'Erreur',
                description: 'Une erreur est survenue lors de la récupération des données.',
            });
        }
        setLoading(false);
      }
  };
          
    const handFilter = () => {
      fetchData()
      setFilterVisible(!filterVisible)
    }

    useEffect(() => {
      fetchData();
    }, [filteredDatas, searchValue]);

  const handleAddTemplate = (idDeclaration) => {
    openModal('Add', idDeclaration);
  };

  const handleDetails = (idDeclaration) => {
    openModal('Detail', idDeclaration);
  }

  const handleAddDecl = (idDeclaration, idClient) => {
    openModal('AddDecl', idDeclaration,idClient );
  };

  const handleDeclarationOneAll = (idDeclaration, idClient) => {
    openModal('OneAll', idDeclaration,idClient );
  };

  const handleUpdateTemplate = (idDeclaration) => {
    openModal('Update', idDeclaration);
  };

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, idDeclaration = '', idClient='') => {
    closeAllModals();
    setModalType(type);
    setidDeclaration(idDeclaration);
    setidClient(idClient)
  };

  const handleDelete = async (id) => {
    try {
      await deletePutDeclaration(id)
      setData(data.filter((item) => item.id_declaration_super !== id));
      message.success('Déclaration deleted successfully');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

  const menus = (
    <Menu>
      {Object.keys(columnsVisibility).map(columnName => (
        <Menu.Item key={columnName}>
          <span onClick={(e) => toggleColumnVisibility(columnName,e)}>
            <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
            <span style={{ marginLeft: 8 }}>{columnName}</span>
          </span>
        </Menu.Item>
      ))}
    </Menu>
  ); 

  const toggleColumnVisibility = (columnName, e) => {
    e.stopPropagation();
    setColumnsVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };


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

      ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' })
    },
    
    // Groupe Entreposage
    {
      title: 'Entreposage',
      children: [
        {
          title: 'Template',
          dataIndex: 'desc_template',
          key: 'desc_template',
          render: (text, record) => (
            <Space style={columnStyles.title} className={columnStyles.hideScroll} onClick={() => handleAddDecl(record.id_declaration_super, record.id_client)}>
              <Tag icon={<FileTextOutlined />} color="geekblue">{text ?? 'Aucun'}</Tag>
            </Space>
          ),
          ...(columnsVisibility['Template'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Client',
          dataIndex: 'nom',
          key: 'nom',
          render: (text, record) => (
            <Space style={columnStyles.titleClient} className={columnStyles.hideScroll} onClick={() => handleDeclarationOneAll(record.id_declaration_super, record.id_client)}>
              <Tag icon={<UserOutlined />} color="orange">
                {text ?? 'Aucun'}
              </Tag>
            </Space>
          ),
          ...(columnsVisibility['Client'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Periode',
          dataIndex: 'periode',
          key: 'periode',
          sorter: (a, b) => moment(a.periode) - moment(b.periode),
          sortDirections: ['descend', 'ascend'],
          render: (text) => {
            const date = text ? new Date(text) : null;
            const formattedDate = date 
              ? date.toLocaleString('default', { month: 'long', year: 'numeric' })
              : 'Aucun';
            return (
              <Tag icon={<CalendarOutlined />} color="purple">{formattedDate}</Tag>
            );
          },
          ...(columnsVisibility['Periode'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'M² occupe',
          dataIndex: 'm2_occupe',
          key: 'm2_occupe',
          sorter: (a, b) => a.m2_occupe - b.m2_occupe,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<BarcodeOutlined />} color="cyan">{text ?? 'Aucun'}</Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['M² occupe'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'M² facture',
          dataIndex: 'm2_facture',
          key: 'm2_facture',
          sorter: (a, b) => a.m2_facture - b.m2_facture,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<BarcodeOutlined />} color="cyan">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['M² facture'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Tarif Entr',
          dataIndex: 'tarif_entreposage',
          key: 'tarif_entreposage',
          sorter: (a, b) => a.tarif_entreposage - b.tarif_entreposage,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['Tarif Entr'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Debours Entr',
          dataIndex: 'debours_entreposage',
          key: 'debours_entreposage',
          sorter: (a, b) => a.debours_entreposage - b.debours_entreposage,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['Debours Entr'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Total Entr',
          dataIndex: 'total_entreposage',
          key: 'total_entreposage',
          sorter: (a, b) => a.total_entreposage - b.total_entreposage,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="gold">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['Total Entr'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'TTC Entr',
          dataIndex: 'ttc_entreposage',
          key: 'ttc_entreposage',
          sorter: (a, b) => a.ttc_entreposage - b.ttc_entreposage,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="volcano">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['TTC Entr'] ? {} : { className: 'hidden-column' }),
        },
      ]
    },
  
    // Groupe Manutention
    {
      title: 'Manutention',
      children: [
        {
          title: 'Desc Man',
          dataIndex: 'desc_manutation',
          key: 'desc_manutation',
          render: (text) => (
            <Tag icon={<FileTextOutlined />} color="geekblue">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Desc man'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Ville',
          dataIndex: 'capital',
          key: 'capital',
          render: (text) => (
            <Tag icon={<EnvironmentOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Ville'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Bâtiment',
          dataIndex: 'nom_batiment',
          key: 'nom_batiment',
          render: (text) => (
            <Tag icon={<HomeOutlined />} color="purple">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Bâtiment'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Objet fact',
          dataIndex: 'nom_objet_fact',
          key: 'nom_objet_fact',
          render: (text) => (
            <Tag icon={<FileTextOutlined />} color="magenta">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Objet fact'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Manutention',
          dataIndex: 'manutation',
          key: 'manutation',
          render: (text) => (
            <Tag icon={<ToolOutlined />} color="cyan">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['Manutention'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Tarif Manu',
          dataIndex: 'tarif_manutation',
          key: 'tarif_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['Tarif Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Debours Manu',
          dataIndex: 'debours_manutation',
          key: 'debours_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['Debours Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Total Manu',
          dataIndex: 'total_manutation',
          key: 'total_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="gold">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          align: 'right',
          ...(columnsVisibility['Total Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'TTC Manu',
          dataIndex: 'ttc_manutation',
          key: 'ttc_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="volcano">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['TTC Manu'] ? {} : { className: 'hidden-column' }),
        },
      ]
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
                style={{ color: 'green' }}
                onClick={() => handleUpdateTemplate(record.id_declaration_super)}
              />
          </Tooltip>
          <Tooltip title="Voir les détails">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleDetails(record.id_declaration_super)}
              aria-label="Voir les détails de la tâche"
              style={{ color: 'blue' }}
            />
          </Tooltip>
            <Tooltip title="Supprimer">
              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer cette déclaration ?"
                onConfirm={() => handleDelete(record.id_declaration_super)}
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
    },
  ];
  
  const handleFilterChange = (newFilters) => {
    setFilteredDatas(newFilters); 
  };

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const filteredData = data.filter(item =>
    item.desc_template?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom?.toLowerCase().includes(searchValue.toLowerCase()));
  
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
              <FileTextOutlined
                style={{
                  color: '#1890ff',
                  fontSize: '18px',
                  marginRight: '8px',
                }}
              />
              Liste des déclarations
            </span>
          }
          key="1"
        >
            <div className="client">
              <div className="client-wrapper">
                <div className="client-rows">
                  <div className="client-row">
                    <div className="client-row-icon">
                      <ScheduleOutlined className='client-icon' />
                    </div>
                    <h2 className="client-h2">Déclarations</h2>
                  </div>
                  {
                    role === 'Admin' &&
                    <div className='client-row-lefts'>
                    <span className='client-title'>
                    Resumé :
                    </span>
                    <div className="client-row-sou">
                      {loading ? (
                        <Skeleton active paragraph={{ rows: 1 }} />
                      ) : (
                          <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'10px'}}>
                            <span style={{fontSize:'.8rem',  fontWeight:'200'}}>Nbre de client : <strong>{statistique.nbre_client}</strong></span>
                            <span style={{fontSize:'.8rem',  fontWeight:'200'}}>Total de M2 Facture : <strong>{statistique.total_m2_facture?.toLocaleString()}</strong></span>
                            <span style={{fontSize:'.8rem',  fontWeight:'200'}}>Total entreposage : <strong>{statistique.total_entreposage?.toLocaleString()} $</strong></span>
                            <span style={{fontSize:'.8rem',  fontWeight:'200'}}>Total TTC Entreposage : <strong>{statistique.total_ttc_entreposage?.toLocaleString()} $</strong></span>
                            <span style={{fontSize:'.8rem',  fontWeight:'200'}}>Total Manutention : <strong>{statistique.total_manutation?.toLocaleString() || 0} $</strong></span>
                            <span style={{fontSize:'.8rem',  fontWeight:'200'}}>Total TTC Manutention : <strong>{statistique.total_ttc_manutation?.toLocaleString() || 0} $</strong></span>
                          </div>
                      )}
                    </div>
                  </div>
                  }
                </div>
                {filterVisible && <DeclarationFiltre onFilter={handleFilterChange} />}
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
                      onClick={handleAddTemplate}
                    >
                      Ajouter une déclaration
                    </Button>

                    <Button
                      type="default"
                      onClick={handFilter}
                    >
                      {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
                    </Button>

                    <Dropdown overlay={menus} trigger={['click']}>
                      <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                        Colonnes <DownOutlined />
                      </Button>
                    </Dropdown>

                  </div>
                </div>

                <Table
                  columns={columns}
                  dataSource={filteredData}
                  loading={loading}
                  pagination={pagination}
                  onChange={(pagination) => setPagination(pagination)}
                  rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                  rowKey="id"
                  bordered
                  size="small"
                  scroll={scroll}
                />
              </div>
            </div>

            <Modal
              title=""
              visible={modalType === 'Add'}
              onCancel={closeAllModals}
              footer={null}
              width={1200}
              centered
            >
              <DeclarationForm closeModal={() => setModalType(null)} fetchData={fetchData} />
          </Modal>

          <Modal
              title=""
              visible={modalType === 'Update'}
              onCancel={closeAllModals}
              footer={null}
              width={1200}
              centered
            >
              <DeclarationForm closeModal={() => setModalType(null)} fetchData={fetchData} idDeclaration={idDeclaration} />
          </Modal>

          <Modal
              title=""
              visible={modalType === 'Detail'}
              onCancel={closeAllModals}
              footer={null}
              width={900}
              centered
            >
              <DeclarationDetail idDeclaration={idDeclaration} />
          </Modal>

          <Modal
              title=""
              visible={modalType === 'AddDecl'}
              onCancel={closeAllModals}
              footer={null}
              width={1250}
              centered
            >
              <DeclarationForm closeModal={() => setModalType(null)} fetchData={fetchData} idDeclaration={''} idDeclarationss={idDeclaration} idClients={idClient} />
          </Modal>

          <Modal
              title=""
              visible={modalType === 'OneAll'}
              onCancel={closeAllModals}
              footer={null}
              width={1250}
              centered
            >
              <DeclarationOneAll idClients={idClient} />
          </Modal>
        </TabPane>

        <TabPane
          tab={
            <span>
              <PieChartOutlined
                style={{
                  color: '#faad14',
                  fontSize: '18px',
                  marginRight: '8px',
                }}
              />
              Rapport
            </span>
          }
          key="2"
        >
          <RapportDeclaration/>
        </TabPane>
        
      </Tabs>
    </>
  );
};

export default Declaration;