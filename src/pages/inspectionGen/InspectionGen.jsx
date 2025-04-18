import React, { useEffect, useState } from 'react'
import { Input, Button, Menu, Skeleton, Tag, Table, Space, Dropdown, Modal, notification } from 'antd';
import { FileSearchOutlined, UserOutlined, CloseCircleOutlined, ToolOutlined, MenuOutlined, DownOutlined, PlusOutlined, ClockCircleOutlined, HourglassOutlined, WarningOutlined, CheckSquareOutlined, CheckCircleOutlined, EyeOutlined, DollarOutlined, RocketOutlined, FileTextOutlined, MoreOutlined, CarOutlined, CalendarOutlined, PlusCircleOutlined } from '@ant-design/icons'
import InspectionGenForm from './inspectionGenForm/InspectionGenForm';
import { getInspectionGen, getInspectionResume } from '../../services/charroiService';
import moment from 'moment';
import InspectionGenDetail from './inspectionGenDetail/InspectionGenDetail';
import InspectionGenValider from './inspectionGenValider/InspectionGenValider';
import InspectionGenTracking from './inspectionGenTracking/InspectionGenTracking';
import InspectionGenFormTracking from './inspectionGenTracking/inspectionGenFormTracking/InspectionGenFormTracking';
import ReparationForm from '../controleTechnique/reparation/reparationForm/ReparationForm';
import './inspectionGen.css'
import { useSelector } from 'react-redux';
import { statusIcons } from '../../utils/prioriteIcons';

const { Search } = Input;

const InspectionGen = () => {
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);
    const scroll = { x: 'max-content' };
    const [inspectionId, setInspectionId] = useState('');
    const [statistique, setStatistique] = useState([]);
    const role = useSelector((state) => state.user?.currentUser?.role);
    const [columnsVisibility, setColumnsVisibility] = useState({
      '#': true,
      'Matricule': true,
      'Marque': true,
      'Date inspection': true,
      'type_rep': true,
      "Avis d expert": false,
      "Montant": false,
      'Date validation':true,
      'Statut': true,
      'Type rep': true,
      'Budget_valide' : true,
      'Nom chauffeur' : false
    });

    const fetchData = async() => {
        try {
            const [ inspectionData, resumeData] = await Promise.all([
              getInspectionGen(),
              getInspectionResume()
            ])
            setData(inspectionData.data);
            setStatistique(resumeData.data[0])
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

    const handleAddInspection = () => openModal('Add');

    const closeAllModals = () => {
        setModalType(null);
    };

    const openModal = (type, inspectionId = '') => {
        closeAllModals();
        setModalType(type);
        setInspectionId(inspectionId)
    };

    const getActionMenu = (record, openModal) => {
        const handleClick = ({ key }) => {
          switch (key) {
            case 'voirDetail':
                openModal('DetailInspection', record.id_inspection_gen)
              break;
            case 'validerInspection':
              openModal('AddValider', record.id_inspection_gen);
              break;
            case 'DetailSuivi':
                openModal('DetailSuivi', record.id_sub_inspection_gen)
                break;
            case 'ajouterSuivi':
                openModal('AddSuivi', record.id_sub_inspection_gen)
              break;
            case 'reparer':
                openModal('Reparer', record.id_sub_inspection_gen)
              break;
            default:
              break;
          }
        };
      
        return (
          <Menu onClick={handleClick}>
            <Menu.SubMenu
              key="inspection"
              title={
                <>
                  <FileTextOutlined style={{ color: '#1890ff' }} /> Inspection
                </>
              }
            >
              <Menu.Item key="voirDetail">
                <EyeOutlined style={{ color: 'green' }} /> Voir Détail
              </Menu.Item>
              <Menu.Item key="validerInspection">
                <PlusOutlined style={{ color: 'orange' }} /> Valider
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Divider />

            <Menu.SubMenu
              key="tracking"
              title={
                <>
                  <FileSearchOutlined style={{ color: 'green' }} /> Tracking
                </>
              }
            >
              <Menu.Item key="DetailSuivi">
                <EyeOutlined style={{ color: 'green' }} /> Voir Détail
              </Menu.Item>
              <Menu.Item key="ajouterSuivi">
                <PlusOutlined style={{ color: 'orange' }} /> Ajouter
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Divider />

            <Menu.Item key="reparer">
                <ToolOutlined style={{ color: 'orange' }} /> Réparer
            </Menu.Item>
          </Menu>
        );
      };

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
        hideScroll: {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
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
                    <Tag color="blue">{text}</Tag>
                </div>
            ),
            ...(columnsVisibility['Matricule'] ? {} : { className: 'hidden-column' }),

        }, 
        {
          title: 'Chauffeur',
          dataIndex: 'nom',
          render: (text, record) => (
              <Tag icon={<UserOutlined />} color="orange">
                  {text}
              </Tag>
          ),
          ...(columnsVisibility['Nom chauffeur'] ? {} : { className: 'hidden-column' }),

        },                       
        {
            title: 'Marque',
            dataIndex: 'nom_marque',
            render: (text, record) => (
                <Tag icon={<CarOutlined />} color="orange">
                    {text}
                </Tag>
            ),
            ...(columnsVisibility['Marque'] ? {} : { className: 'hidden-column' }),

        },
        {
            title: 'Date',
            dataIndex: 'date_inspection',
            render: (text) => (
              <Tag icon={<CalendarOutlined />} color="blue">
                  {moment(text).format('DD-MM-YYYY')}
              </Tag>
            ),
            ...(columnsVisibility['Date inspection'] ? {} : { className: 'hidden-column' }),

        },
        {
            title: 'Date rep.',
            dataIndex: 'date_reparation',
            render: (text) => {
              if (!text) {
                return (
                  <Tag icon={<CalendarOutlined />} color="red">
                    Aucune date
                  </Tag>
                );
              }
          
              const date = moment(text);
              const isValid = date.isValid();
          
              return (
                <Tag icon={<CalendarOutlined />} color={isValid ? "blue" : "red"}>
                  {isValid ? date.format('DD-MM-YYYY') : 'Date invalide'}
                </Tag>
              );
            },
            ...(columnsVisibility['Date réparation'] ? {} : { className: 'hidden-column' }),

        },          
        {
            title: 'Type de rep.',
            dataIndex: 'type_rep',
            render: (text) => (
                <Tag icon={<ToolOutlined spin />} color='volcano' bordered={false}>
                    {text}
                </Tag>
            ),
            ...(columnsVisibility['Type rep'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: "Avis d'expert",
            dataIndex: 'avis',
            ...(columnsVisibility['Avis d expert'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: "Budget",
            dataIndex: 'montant',
            key: 'montant',
            sorter: (a, b) => a.montant - b.montant,
            sortDirections: ['descend', 'ascend'],
            render: (text) => (
                <Space style={columnStyles.title} className={columnStyles.hideScroll} >
                    <Tag color="green">
                        {text
                            ? `${parseFloat(text)
                                .toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                })
                                .replace(/,/g, " ")} $`
                            : "0.00"}
                    </Tag>
                </Space>
            ),
            align: 'right', 
            ...(columnsVisibility['Montant'] ? {} : { className: 'hidden-column' }),

        },
        {
          title: "Budget validé",
          dataIndex: 'budget_valide',
          key: 'budget_valide',
          sorter: (a, b) => a.budget_valide - b.budget_valide,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Space style={columnStyles.title} className={columnStyles.hideScroll}>
              {text && parseFloat(text) !== 0 ? (
                <Tag color="blue">
                  {`${parseFloat(text)
                    .toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    .replace(/,/g, " ")} $`}
                </Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="red">Non validé</Tag>
              )}
            </Space>
          ),
          align: 'right',
          ...(columnsVisibility['Budget_valide'] ? {} : { className: 'hidden-column' }),
        },        
        {
            title: 'Date validation',
            dataIndex: 'date_validation',
            render: (text) => {
                if (!text) {
                  return (
                    <Tag icon={<CalendarOutlined />} color="red">
                      Aucune date
                    </Tag>
                  );
                }
            
                const date = moment(text);
                const isValid = date.isValid();
            
                return (
                  <Tag icon={<CalendarOutlined />} color={isValid ? "blue" : "red"}>
                    {isValid ? date.format('DD-MM-YYYY') : 'Date invalide'}
                  </Tag>
                );
              },
              ...(columnsVisibility['Date validation'] ? {} : { className: 'hidden-column' }),
        },
        { 
            title: 'Statut', 
            dataIndex: 'nom_type_statut', 
            key: 'nom_type_statut',
            render: text => {
                const { icon, color } = statusIcons[text] || {};
                return (
                  <Space>
                    <Tag icon={icon} color={color}>{text}</Tag>
                  </Space>
                );
            },
            ...(columnsVisibility['Statut'] ? {} : { className: 'hidden-column' }),

        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
              <Dropdown overlay={getActionMenu(record, openModal)} trigger={['click']}>
                <Button icon={<MoreOutlined />} style={{ color: 'blue' }} />
              </Dropdown>
            )
          }
    ]
    
    const filteredData = data.filter(item =>
        item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.commentaire?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.nom_type_statut?.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
              <div className="client-rows">
                <div className="client-row">
                    <div className="client-row-icon">
                        <FileSearchOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Inspection</h2>
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
                            <span style={{fontSize:'.8rem',  fontWeight:'200'}}>#Inspection : <strong>{statistique.nbre_inspection?.toLocaleString()}</strong></span>
                            <span style={{fontSize:'.8rem',  fontWeight:'200'}}>#Véhicule : <strong>{Math.round(parseFloat(statistique.nbre_vehicule)).toLocaleString() || 0}</strong></span>
                            <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                              Budget non validé : <strong>
                                {Number.isFinite(parseFloat(statistique.budget_total))
                                  ? Math.round(parseFloat(statistique.budget_total)).toLocaleString()
                                  : 0} $</strong>
                            </span>

                            <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                              Budget validé  : <strong>
                                {Number.isFinite(parseFloat(statistique.budget_valide))
                                  ? Math.round(parseFloat(statistique.budget_valide)).toLocaleString()
                                  : 0} $</strong>
                            </span>
                          </div>
                      )}
                    </div>
                  </div>
                  }
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
                            onClick={handleAddInspection}
                        >
                            Ajouter une inspection
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
                    rowKey="id_inspection"
                    loading={loading}
                    scroll={scroll}
                    size="small"
                    onChange={(pagination)=> setPagination(pagination)}
                    bordered
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />
            </div>
        </div>
        <Modal
            title=""
            visible={modalType === 'Add'}
            onCancel={closeAllModals}
            footer={null}
            width={1023}
            centered
        >
            <InspectionGenForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'DetailInspection'}
            onCancel={closeAllModals}
            footer={null}
            width={1023}
            centered
        >
            <InspectionGenDetail inspectionId={inspectionId} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'AddValider'}
            onCancel={closeAllModals}
            footer={null}
            width={1000}
            centered
        >
            <InspectionGenValider closeModal={() => setModalType(null)} fetchData={fetchData} inspectionId={inspectionId} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'DetailSuivi'}
            onCancel={closeAllModals}
            footer={null}
            width={1023}
            centered
        >
            <InspectionGenTracking idSubInspectionGen={inspectionId} closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'AddSuivi'}
          onCancel={closeAllModals}
          footer={null}
          width={800}
          centered
        >
          <InspectionGenFormTracking idSubInspectionGen={inspectionId} closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'Reparer'}
            onCancel={closeAllModals}
            footer={null}
            width={1000}
            centered
        >
            <ReparationForm closeModal={() => setModalType(null)} fetchData={fetchData} subInspectionId={inspectionId} />
       </Modal>
    </>
  )
}

export default InspectionGen