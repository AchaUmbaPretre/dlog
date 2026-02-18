import { useEffect, useState } from 'react';
import { Table, Button, Tabs, Space, Tooltip, Popconfirm, Modal, Typography, Input, message, Dropdown, Menu, notification, Tag, Badge } from 'antd';
import { ExportOutlined, DownOutlined, EnvironmentOutlined, MenuOutlined, MoreOutlined, CloseCircleOutlined, FileTextOutlined, EyeOutlined, PlusOutlined, FileSyncOutlined, CheckCircleOutlined, CalendarOutlined, UserOutlined, CarOutlined, DeleteOutlined, LogoutOutlined, PlusCircleOutlined, AimOutlined, EditOutlined } from '@ant-design/icons';
import DemandeVehiculeForm from './demandeVehiculeForm/DemandeVehiculeForm';
import { getDemandeVehicule, putDemandeVehiculeVu } from '../../../services/charroiService';
import moment from 'moment';
import { statusIcons } from '../../../utils/prioriteIcons';
import { useSelector } from 'react-redux';
import AffectationDemandeForm from '../affectationDemande/affectationDemandeForm/AffectationDemandeForm';
import DemandeVehiculeDetail from './demandeVehiculeDetail/DemandeVehiculeDetail';
import { vehiculeUpdateAnnuler } from '../../../utils/modalUtils';
import TabPane from 'antd/es/tabs/TabPane';
import AffectationDemande from '../affectationDemande/AffectationDemande';
import DemandeurVehicule from '../demandeurVehicule/DemandeurVehicule';
import BandeSortie from '../affectationDemande/bandeSortie/BandeSortie';
import Destination from './destination/Destination';
import SortieEntree from '../affectationDemande/sortieEntree/SortieEntree';
import SecuriteVisiteur from '../securite/securiteVisiteur/SecuriteVisiteur';
import VisiteurPieton from '../securite/securiteVisiteur/visiteurPieton/VisiteurPieton';
import BonSortiePerso from '../bonSortiePerso/BonSortiePerso';
import { getRapportCharroiVehicule } from '../../../services/rapportService';
import RapportVehiculeCourses from '../rapportCharroi/rapportVehiculeCourses/RapportVehiculeCourses';
import RapportVehiculeValide from '../rapportCharroi/rapportVehiculeValide/RapportVehiculeValide';
import RapportVehiculeUtilitaire from '../rapportCharroi/rapportVehiculeUtilitaire/RapportVehiculeUtilitaire';
import DemandevehiculeOccupe from './demandevehiculeOccupe/DemandevehiculeOccupe';

const { Search } = Input;
const { Text } = Typography;

const DemandeVehicule = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const scroll = { x: 'max-content' };
  const [activeKey, setActiveKey] = useState('1');
  const [demandeId, setDemandeId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 15,
  });
  const [columnsVisibility, setColumnsVisibility] = useState({
    "Client" : false,
    "Date prévue" : true,
    "Date retour" : true,
    "T. véhicule" : true,
    "Demandeur" : true,
    "Motif": false,
    "Destination" : true,
    "Créé par" : true,
    "Statut" : true,
    "Vu" : true
  })
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const role = useSelector((state) => state.user?.currentUser?.role);
  const [count, setCount] = useState([]);
  const [countCourse, setCountCourse] = useState([]);
  const [datas, setDatas] = useState([]);
  const [course, setCourse] = useState([]);
  const [utilitaire, setUtilitaire] = useState([]);
  const [countAttente, setCountAttente] = useState([]);

    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    const updatedVu = async (id) => {
        try {
            await putDemandeVehiculeVu(id);
            fetchData();
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    const fetchData = async () => {
      try {
         const { data } = await getDemandeVehicule(userId, role);

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

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, []);

        const fetchDatas = async() => {
            try {
                const { data } = await getRapportCharroiVehicule();
    
                setDatas(data.listeEnAttente);
    
                setCourse(data.listeCourse);
                setUtilitaire(data.listeUtilitaire);
                setCountAttente(data?.countAttente[0]?.Count_enattente);
                setCountCourse(data?.countCourse[0]?.count_course);
                setCount(data?.countUtilitaire[0]?.count_utilitaire)
    
            } catch (error) {
                notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
                });
            }
        }
    
      useEffect(() => {
        fetchDatas()
        const interval = setInterval(fetchData, 5000);
    
        return () => clearInterval(interval);
      }, []);

    const getActionMenu = (record, openModal) => {
        const handleClick = ({ key }) => {
            switch (key) {
                case 'voirDetail': 
                    openModal('Detail', record.id_demande_vehicule)
                    break;
                case 'affectation': 
                    openModal('affectation', record.id_demande_vehicule)
                    break;
                case 'closeDemande': 
                    vehiculeUpdateAnnuler(record.id_demande_vehicule, fetchData)
                    break;
                case 'validation': 
                    openModal('validation', record.id_demande_vehicule)
                    break;
                default:
                    break
            }
        };
        return (
            <Menu onClick={handleClick}>
                <Menu.Item key="voirDetail">
                    <EyeOutlined style={{ color: '#2db7f5' }} /> Voir Détail
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="closeDemande">
                    <CloseCircleOutlined style={{ color: 'red' }} /> Annuler
                </Menu.Item>
                <Menu.Divider />
                <Menu.Divider />
                <Menu.SubMenu
                    key="inspection"
                    title={
                        <>
                        <FileTextOutlined style={{ color: '#1890ff' }} /> Affectation
                        </>
                    }
                >
                    <Menu.Item key="affectation">
                        <PlusOutlined style={{ color: 'orange' }} /> Affecter
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        )
    }

    const handleDelete = () => {

    }

    const handleEdit = (id) => openModal('Add', id)
    const handleAdd = () => openModal('Add')

    const closeAllModals = () => {
        setModalType(null);
    };

    const openModal = (type, demandeId = '') => {
        closeAllModals();
        setModalType(type);
        setDemandeId(demandeId)
    };

    const handleExportExcel = () => {
        message.success('Exporting to Excel...');
    };

    const handleExportPDF = () => {
        message.success('Exporting to PDF...');
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

    const columnStyles = {
        title: {
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
            width: "3%",
        },
        {
            title : "Client",
            dataIndex: 'nom',
            key:'nom',
            align: 'center',
            ellipsis: { showTitle: false },
            render : (text) => (
                <Tag color="green">{text}</Tag>
            ),
            ...(columnsVisibility['Client'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: (
            <Space>
                <LogoutOutlined style={{ color: '#52c41a' }} />
                <Text strong>Date prévue</Text>
            </Space>
            ),
            dataIndex: 'date_prevue',
            key: 'date_prevue',
            ellipsis: { showTitle: false },
            render: (text) => {
            const formattedDate = moment(text).format('DD-MM-YYYY HH:mm');
            return (
            <Tooltip placement="topLeft" title={formattedDate}>
                <div style={columnStyles.title} className={columnStyles.hideScroll}>
                    <Tag icon={<CalendarOutlined />} color="blue">{formattedDate}</Tag>
                </div>
            </Tooltip>
            );
        },
        ...(columnsVisibility['Date prévue'] ? {} : { className: 'hidden-column' }),
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
            ellipsis: { showTitle: false},
            render: (text) => {
                const formattedDate = moment(text).format('DD-MM-YYYY HH:mm');
                return (
                    <div style={columnStyles.title} className={columnStyles.hideScroll}>
                        <Tooltip placement="topLeft" title={formattedDate}>
                            <Tag icon={<CalendarOutlined />}  color="orange">{formattedDate}</Tag>
                        </Tooltip>
                    </div>
                );
            },
            ...(columnsVisibility['Date retour'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: (
            <Space>
                <CarOutlined style={{ color: '#eb2f96' }} />
                <Text strong>T. véhicule</Text>
            </Space>
            ),
            dataIndex: 'nom_type_vehicule',
            key: 'nom_type_vehicule',
            align: 'center',
            ellipsis: { showTitle: false},
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>
                    <div style={columnStyles.title} className={columnStyles.hideScroll}>
                        <Text type="secondary">{text}</Text>
                    </div>
                </Tooltip>
            ),
            ...(columnsVisibility['T. véhicule'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: (
            <Space>
                <Text strong>Demandeur</Text>
            </Space>
            ),
            dataIndex: 'nom_service',
            key: 'nom_service',
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => <Text type="secondary">{text}</Text>,
            ...(columnsVisibility['Demandeur'] ? {} : { className: 'hidden-column' })
        },
        {
            title: (
            <Space>
                <EnvironmentOutlined style={{ color: 'red' }} />
                <Text strong>Destination</Text>
            </Space>
            ),
            dataIndex: 'nom_destination',
            key: 'nom_destination',
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => <Text type="secondary">{text}</Text>,
            ...(columnsVisibility['Destination'] ? {} : { className: 'hidden-column' })
        },
        {
            title: (
            <Space>
                <Text strong>Motif</Text>
            </Space>
            ),
            dataIndex: 'nom_motif_demande',
            key: 'nom_motif_demande',
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => <Text type="secondary">{text}</Text>,
            ...(columnsVisibility['Motif'] ? {} : { className: 'hidden-column' })
        },
        {
            title: (
            <Space>
                <CheckCircleOutlined style={{ color: '#1890ff' }} />
                <Text strong>Statut</Text>
            </Space>
            ),
            dataIndex: 'nom_statut_bs',
            key: 'nom_statut_bs',
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            render: text => {
                const { icon, color } = statusIcons[text] || {};
                return (
                    <div style={columnStyles.title} className={columnStyles.hideScroll}>
                        <Tag icon={icon} color={color}>{text}</Tag>
                    </div>
                );
            },
            ...(columnsVisibility['Statut'] ? {} : { className: 'hidden-column' })
        },
                        {
            title: (
            <Space>
                <UserOutlined style={{ color: 'orange' }} />
                <Text strong>Créé par</Text>
            </Space>
            ),
            dataIndex: 'nom_user',
            key: 'nom_user',
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => <Text type="secondary">{text}</Text>,
            ...(columnsVisibility['Créé par'] ? {} : { className: 'hidden-column' })
        },
        ...(role === 'Admin'
            ? [
                {
                title: (
                    <Space>
                    <Text strong>Vu</Text>
                    </Space>
                ),
                dataIndex: 'vu',
                key: 'vu',
                align: 'center',
                ellipsis: {
                    showTitle: false,
                },
                render: (text, record) => (
                    <Tag
                        color={text === 1 ? 'green' : 'red'}
                        onClick={text === 1 ? undefined : () => updatedVu(record.id_demande_vehicule)}
                        style={{ cursor: text === 1 ? 'default' : 'pointer' }}
                    >
                        {text === 1 ? 'Vu' : 'Non vu'}
                    </Tag>
                ),
                },
            ]
            : []),
        {
            title: (
            <Text strong>Actions</Text>
            ),
            key: 'action',
            align: 'center',
            render: (text, record) => (
            <Space size="small">
                <Tooltip title="Modifier cette localisation">
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    style={{ color: '#1890ff' }}
                    onClick={() => handleEdit(record.id_demande_vehicule)}
                    aria-label="Modifier"
                />
                </Tooltip>
                <Dropdown overlay={getActionMenu(record, openModal)} trigger={['click']}>
                    <Button type='text' icon={<MoreOutlined />} style={{ color: 'blue' }} />
                </Dropdown>
                <Tooltip title="Supprimer définitivement">
                <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer cette localisation ?"
                    onConfirm={() => handleDelete(record.id_demande_vehicule)}
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
        item.nom_motif_demande?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.nom_service?.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <>
        <Tabs
            activeKey={activeKey}
            onChange={handleTabChange}
            type="card"
            tabPosition="top"
        >
            <TabPane
                tab={
                    <span>
                      📅 Réservations
                    </span>
                }
                key="1"
            >
                <Tabs defaultActiveKey="1">
                    <TabPane
                        tab={
                            <span>
                            📅 Liste des Réservations
                            </span>
                        }
                        key="1"
                    >
                        <div className="client">
                            <div className="client-wrapper">
                            <div className="client-row">
                                <div className="client-row-icon">
                                    <FileSyncOutlined className='client-icon' style={{color:'blue'}} />
                                    </div>
                                <h2 className="client-h2">Liste des réservations de véhicules</h2>
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

                                        <Dropdown overlay={menus} trigger={['click']}>
                                        <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                                            colonne<DownOutlined />
                                        </Button>
                                        </Dropdown>

                                        <Dropdown overlay={menu} trigger={['click']}>
                                            <Button icon={<ExportOutlined />}>Export</Button>
                                        </Dropdown>
                                        
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
                                ✅ Courses validées
                                </span>
                            }
                            key="2"
                        >
                            <AffectationDemande/>
                    </TabPane>

                    <TabPane
                            tab={
                                <span>
                                📤 Bon de sortie
                                </span>
                            }
                            key="3"
                        >
                            <BandeSortie/>
                    </TabPane>

                    <TabPane
                            tab={
                                <span>
                                🔴 Entrée / Sortie
                                </span>
                            }
                            key="4"
                        >
                            <SortieEntree/>
                    </TabPane>

                    <TabPane
                        tab={
                            <>
                                <span>
                                    <Badge count={countCourse} offset={[8, -2]}>
                                        🚗 Véhicule en course
                                    </Badge>
                                </span>
                            </>
                                
                        }
                        key="5"
                    >
                        <RapportVehiculeCourses course={course}/>
                    </TabPane>

                        <TabPane
                            tab={
                                <>
                                    <span>
                                        <Badge count={countAttente}  offset={[8, -2]}>
                                            🚗 Véhicule en attente de sortie
                                        </Badge>
                                    </span>
                                </>
                                    
                            }
                            key="6"
                        >
                            <RapportVehiculeValide data={datas} />
                        </TabPane>

                        <TabPane
                            tab={
                                <span>
                                🚗 Liste des utilitaires
                                </span>
                            }
                            key="7"
                        >
                            <RapportVehiculeUtilitaire utilitaire={utilitaire} />
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                🚗 Liste des occupés
                                </span>
                            }
                            key="8"
                        >
                            <DemandevehiculeOccupe utilitaire={utilitaire} />
                        </TabPane>
                    </Tabs>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                        📤 Bon de sortie du personnel
                        </span>
                    }
                    key="4"
                >
                    <BonSortiePerso/>
                </TabPane>

                <TabPane
                    tab={
                        <span>🪪 Les visiteurs</span>
                    }
                    key="7"
                >
                    <SecuriteVisiteur />
                </TabPane>

                <TabPane
                    tab={
                        <span>🪪 Les piétons</span>
                    }
                    key="8"
                >
                    <VisiteurPieton />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                        💼 Services
                        </span>
                    }
                    key="11"
                >
                    <DemandeurVehicule/>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                        🗺️ Destination
                        </span>
                    }
                    key="12"
                >
                    <Destination/>
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
                <DemandeVehiculeForm closeModal={() => setModalType(null)} fetchData={fetchData} demandeId={demandeId} />
            </Modal>

            <Modal
                title=""
                visible={modalType === 'affectation'}
                onCancel={closeAllModals}
                footer={null}
                width={1000}
                centered
            >
                <AffectationDemandeForm closeModal={() => setModalType(null)} fetchData={fetchData} id_demande_vehicule={demandeId} />
            </Modal>

            <Modal
                title=""
                visible={modalType === 'Detail'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
            >
                <DemandeVehiculeDetail closeModal={() => setModalType(null)} fetchData={fetchData} id_demande_vehicule={demandeId} />
            </Modal>
        </>
  );
};

export default DemandeVehicule;