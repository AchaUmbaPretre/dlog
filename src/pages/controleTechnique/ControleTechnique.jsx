import { useEffect, useState } from 'react'
import { Input, Button, notification, Table, Tag, Tabs, Modal } from 'antd';
import { RetweetOutlined, CarOutlined, AuditOutlined, FileSearchOutlined, ShopOutlined, ScanOutlined, WarningOutlined, CloseCircleOutlined, CheckCircleOutlined,  ToolOutlined,UserOutlined,  CalendarOutlined, PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import ControleTechniqueForm from './controleTechniqueForm/ControleTechniqueForm';
import { getControleTechnique } from '../../services/charroiService';
import TabPane from 'antd/es/tabs/TabPane';
import Reparation from './reparation/Reparation';
import InspectionGen from '../inspectionGen/InspectionGen';
import TrackingGen from './trackingGen/TrackingGen';
import AuditLogInspection from './auditLogInspection/AuditLogInspection';
import { useSelector } from 'react-redux';

const { Search } = Input;

const ControleTechnique = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 'max-content' };
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);
    const [activeKey, setActiveKey] = useState(['1', '2']);
    const role = useSelector((state) => state.user?.currentUser?.role);
    
    
    const fetchData = async() => {
        try {
             const { data } = await getControleTechnique();
            setData(data.data);
            setLoading(false);

        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
              });
              setLoading(false);
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=> {
        fetchData()
    }, [])

    const handleTabChange = (key) => {
        setActiveKey(key);
      };

    const closeAllModals = () => {
        setModalType(null);
      };
      
    const openModal = (type) => {
        closeAllModals();
        setModalType(type);
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
            width: "4%"
        },
        {
            title: 'Matricule',
            dataIndex: 'immatriculation',
            render: (text, record) => (
                <Tag icon={<CarOutlined />} color="green">
                    {text}
                </Tag>
            )
        },
        {
            title: 'Marque',
            dataIndex: 'nom_marque',
            render: (text, record) => (
                <Tag icon={<CarOutlined />} color="orange">
                    {text}
                </Tag>
            )
        },
        {
          title: 'Date controle',
          dataIndex: 'date_controle',
          render: (text) => (
            <span>
              <CalendarOutlined style={{ marginRight: 5, color: '#13c2c2' }} />
              {moment(text).format('DD-MM-yyyy')}
            </span>
          ),
        },
        {
          title: 'Date validité',
          dataIndex: 'date_validite',
          render: (text) => (
            <span>
              <CalendarOutlined style={{ marginRight: 5, color: '#13c2c2' }} />
              {moment(text).format('DD-MM-yyyy')}
            </span>
          ),
        },
        {
          title: 'Statut',
          dataIndex: 'statut',
          key: 'statut',
          render: (statut) => {
              let icon;
              let color;
              let label;
  
              switch (statut) {
                  case 'En cours':
                      icon = <CheckCircleOutlined />;
                      color = 'green';
                      label = 'En cours';
                      break;
                  case 'Expire dans 3 mois':
                      icon = <WarningOutlined />;
                      color = 'orange';
                      label = 'Expire dans 3 mois';
                      break;
                  case 'Expiré':
                      icon = <CloseCircleOutlined />;
                      color = 'red';
                      label = 'Expiré';
                      break;
                  default:
                      icon = null;
                      color = 'default';
                      label = statut;
              }
  
              return (
                  <Tag color={color} icon={icon} style={{ fontSize: '14px' }}>
                      {label}
                  </Tag>
              );
          },
        },
        {
            title: 'Type Réparation',
            dataIndex: 'type_rep',
            render: (text) => (
              <span>
                <ToolOutlined style={{ marginRight: 5, color: '#000' }} />
                {text}
              </span>
            ),
        },
        {
            title: 'Chauffeur',
            dataIndex: 'nom_chauffeur',
            render: (text) => (
              <span>
                <UserOutlined style={{ marginRight: 4, color: '#d46b08' }} />
                {text}
              </span>
            ),
        },
        {
            title: 'Fournisseur',
            dataIndex: 'nom_fournisseur',
            render: (text) => (
              <span>
                <ShopOutlined style={{ marginRight: 5, color: '#52c41a' }} />
                {text}
              </span>
            ),
        }
      ];

    const handleAddAffectation = () => openModal('Add')
    const filteredData = data.filter(item => 
        item.immatriculation?.toLowerCase().includes(searchValue.toLocaleLowerCase()) || 
        item.nom_marque?.toLowerCase().includes(searchValue.toLocaleLowerCase()) || 
        item.type_rep?.toLowerCase().includes(searchValue.toLocaleLowerCase())
    )

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
                        <FileSearchOutlined
                            style={{
                                color: 'green',
                                fontSize: '18px',
                                marginRight: '8px',
                            }}
                        />
                            Inspection
                    </span>
                }
                key="1"
            >
                <InspectionGen/>
            </TabPane>

            <TabPane
                tab={
                    <span>
                        <ScanOutlined
                            style={{
                               color: '#1890ff',
                                fontSize: '18px',
                                marginRight: '8px',
                            }}
                        />
                        Controle technique
                    </span>
                }
                key="2"
            >
                <div className="client">
                    <div className="client-wrapper">
                        <div className="client-row">
                            <div className="client-row-icon">
                                <RetweetOutlined className='client-icon'/>
                            </div>
                            <h2 className="client-h2">Controle technique</h2>
                        </div>
                        <div className="client-actions">
                            <div className="client-row-left">
                                <Search 
                                    placeholder="Recherche..." 
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    enterButton
                                />
                            </div>
                            <div className="client-rows-right">
                                <Button
                                    type="primary"
                                    icon={<PlusCircleOutlined />}
                                    onClick={handleAddAffectation}
                                >
                                    Faire un controle technique
                                </Button>
                            </div>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={filteredData}
                            rowKey="id_controle_technique"
                            loading={loading}
                            scroll={scroll}
                            size="small"
                            onChange={(pagination)=> setPagination(pagination)}
                            bordered
                            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                        />
                    </div>
                </div>
            </TabPane>

            <TabPane
                tab={
                    <span>
                        <ToolOutlined
                            style={{
                                color: '#faad14',
                                fontSize: '18px',
                                marginRight: '8px',
                            }}
                        />
                            Réparations
                    </span>
                }
                key="3"
            >
                <Reparation/>
            </TabPane>
            
            { 
                role === 'Admin' && (
                    <TabPane
                        tab={
                            <span>
                                <FileSearchOutlined
                                    style={{
                                        color: 'chocolate',
                                        fontSize: '18px',
                                        marginRight: '8px',
                                    }}
                                />
                                    Tracking
                            </span>
                        }
                        key="4"
                    >
                        <TrackingGen/>
                    </TabPane>
                )
            }

            { 
                role === 'Admin' && (
            <TabPane
                tab={
                    <span>
                        <AuditOutlined 
                            style={{
                                color: 'purple',
                                fontSize: '18px',
                                marginRight: '8px',
                            }}
                        />
                        Audit Logs
                    </span>
                }
                key="5"
            >
                <AuditLogInspection/>
            </TabPane>
            )
            }
        </Tabs>

        <Modal
            title=""
            visible={modalType === 'Add'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
             <ControleTechniqueForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>
    </>
  )
}

export default ControleTechnique;