import { useEffect, useState } from 'react';
import { Table, Button, Tabs, Space, Tooltip, Popconfirm, Modal, Typography, Input, message, Dropdown, Menu, notification, Tag } from 'antd';
import { ExportOutlined,  MoreOutlined, RightCircleOutlined, CloseCircleOutlined, FileTextOutlined, EyeOutlined, PlusOutlined, FileSyncOutlined, CheckCircleOutlined, CalendarOutlined, UserOutlined, CarOutlined, DeleteOutlined, LogoutOutlined, PlusCircleOutlined, AimOutlined, PrinterOutlined, EditOutlined } from '@ant-design/icons';
import DemandeVehiculeForm from './demandeVehiculeForm/DemandeVehiculeForm';
import { getDemandeVehicule, putDemandeVehiculeVu } from '../../../services/charroiService';
import moment from 'moment';
import { statusIcons } from '../../../utils/prioriteIcons';
import { useSelector } from 'react-redux';
import AffectationDemandeForm from '../affectationDemande/affectationDemandeForm/AffectationDemandeForm';
import DemandeVehiculeDetail from './demandeVehiculeDetail/DemandeVehiculeDetail';
import { vehiculeUpdateAnnuler } from '../../../utils/modalUtils';
import VehiculeOccupe from './vehiculeOccupe/VehiculeOccupe';
import TabPane from 'antd/es/tabs/TabPane';
import DemandeVehiculeDispo from './demandeVehiculeDispo/DemandeVehiculeDispo';
import AffectationDemande from '../affectationDemande/AffectationDemande';
import RetourVehiculeForm from '../retourVehicule/retourVehiculeForm/RetourVehiculeForm';
import DemandeurVehicule from '../demandeurVehicule/DemandeurVehicule';
import ValidationDemandeForm from './validationDemande/validationDemandeForm/ValidationDemandeForm';
import BandeSortie from '../affectationDemande/bandeSortie/BandeSortie';

const { Search } = Input;
const { Text } = Typography;

const DemandeVehicule = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const scroll = { x: 'max-content' };
  const [activeKey, setActiveKey] = useState(['1', '2']);
  const [demandeId, setDemandeId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 15,
    });
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const role = useSelector((state) => state.user?.currentUser?.role);
  
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
                case 'retourDemande': 
/*                     vehiculeRetour(record.id_demande_vehicule, fetchData)
 */                    
                openModal('retour', record.id_demande_vehicule)
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
                <Menu.Item key="retourDemande">
                    <RightCircleOutlined style={{ color: '#17a2b8' }} /> Retour
                </Menu.Item>
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
                        <PlusOutlined style={{ color: 'orange' }} /> Affectater
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

    const columnStyles = {
        title: {
          maxWidth: '220px',
          whiteSpace: 'nowrap',
          overflowX: 'scroll', 
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
        render : (text) => (
            <Tag color="green">{text}</Tag>
        )
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
        render: (text) => <Text type="secondary">{text}</Text>,
    },
    /*   {
        title: (
        <Space>
            <InfoCircleOutlined style={{ color: '#13c2c2' }} />
            <Text strong>Motif</Text>
        </Space>
        ),
        dataIndex: 'nom_motif_demande',
        key: 'nom_motif_demande',
        align: 'center',
        render: (text) => <Text type="secondary">{text}</Text>,
    }, */
    {
        title: (
        <Space>
            <UserOutlined style={{ color: '#fa541c' }} />
            <Text strong>Demandeur</Text>
        </Space>
        ),
        dataIndex: 'nom_service',
        key: 'nom_service',
        align: 'center',
        render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
        title: (
        <Space>
            <CheckCircleOutlined style={{ color: '#1890ff' }} />
            <Text strong>Statut</Text>
        </Space>
        ),
        dataIndex: 'nom_type_statut',
        key: 'nom_type_statut',
        align: 'center',
        render: text => {
            const { icon, color } = statusIcons[text] || {};
            return (
                    <Space>
                        <div style={columnStyles.title} className={columnStyles.hideScroll}>
                            <Tag icon={icon} color={color}>{text}</Tag>
                        </div>
                    </Space>
                );
        },
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
            width: '80px',
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
        width : '120px',
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
            activeKey={activeKey[0]}
            onChange={handleTabChange}
            type="card"
            tabPosition="top"
            renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} />}
        >
            <TabPane
                tab={
                    <span>
                      📅 Réservations
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

            { role === 'Admin' &&
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
            }

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
                    🚗 Véhicule en course
                    </span>
                }
                key="4"
            >
                <BandeSortie/>
            </TabPane>

            { role === 'Admin' &&
            <TabPane
                tab={
                    <span>
                    🚗 Les vehicules occupés
                    </span>
                }
                key="5"
            >
                <VehiculeOccupe/>
            </TabPane>
            }

            { role === 'Admin' &&
            <TabPane
                tab={
                    <span>
                    🚙 Les vehicules disponibles
                    </span>
                }
                key="6"
            >
                <DemandeVehiculeDispo/>
            </TabPane>
            }

            { role === 'Admin' &&
            <TabPane
                tab={
                    <span>
                    💼 Services
                    </span>
                }
                key="7"
            >
                <DemandeurVehicule/>
            </TabPane>
            }
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

        <Modal
            title=""
            visible={modalType === 'retour'}
            onCancel={closeAllModals}
            footer={null}
            width={700}
            centered
        >
            <RetourVehiculeForm closeModal={() => setModalType(null)} fetchData={fetchData} id_demande_vehicule={demandeId} />
        </Modal>

    </>
  );
};

export default DemandeVehicule;