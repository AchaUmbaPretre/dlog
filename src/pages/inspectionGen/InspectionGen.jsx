import React, { useEffect, useState } from 'react'
import { Input, Button, Menu, Tag, Table, Space, Dropdown, Modal, notification } from 'antd';
import { FileSearchOutlined, PlusOutlined, ClockCircleOutlined, HourglassOutlined, WarningOutlined, CheckSquareOutlined, CheckCircleOutlined, EyeOutlined, DollarOutlined, RocketOutlined, FileTextOutlined, MoreOutlined, CarOutlined, CalendarOutlined, PlusCircleOutlined } from '@ant-design/icons'
import InspectionGenForm from './inspectionGenForm/InspectionGenForm';
import { getInspectionGen } from '../../services/charroiService';
import moment from 'moment';
import InspectionGenDetail from './inspectionGenDetail/InspectionGenDetail';
import InspectionGenValider from './inspectionGenValider/InspectionGenValider';
import InspectionGenTracking from './inspectionGenTracking/InspectionGenTracking';
import InspectionGenFormTracking from './inspectionGenTracking/inspectionGenFormTracking/InspectionGenFormTracking';

const { Search } = Input;

const InspectionGen = () => {
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);
    const scroll = { x: 400 };
    const [inspectionId, setInspectionId] = useState('')

      const statusIcons = {
        'En attente': { icon: <ClockCircleOutlined />, color: 'orange' },
        'En cours': { icon: <HourglassOutlined />, color: 'blue' },
        'Point bloquant': { icon: <WarningOutlined />, color: 'red' },
        'En attente de validation': { icon: <CheckSquareOutlined />, color: 'purple' },
        'Validé': { icon: <CheckCircleOutlined />, color: 'green' },
        'Budget': { icon: <DollarOutlined />, color: 'gold' },
        'Executé': { icon: <RocketOutlined />, color: 'cyan' },
      };

    const fetchData = async() => {
        try {
            const { data } = await getInspectionGen();
            setData(data);
            setLoading(false);
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
            setLoading(false);
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
                openModal('DetailSuivi', record.id_inspection_gen)
                break;
            case 'ajouterSuivi':
                openModal('AddSuivi', record.id_inspection_gen)
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
    
          </Menu>
        );
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
            title: 'Date',
            dataIndex: 'date_inspection',
            render: (text) => (
              <Tag icon={<CalendarOutlined />} color="blue">
                  {moment(text).format('DD-MM-YYYY')}
              </Tag>
            )
        },
        {
            title: 'Date rep',
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
            }
          },          
        {
            title: 'Préoccupations',
            dataIndex: 'commentaire',
        },
        {
            title: "Avis d'expert",
            dataIndex: 'avis',
        },
        {
            title: "Cout",
            dataIndex: 'montant',
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
              }
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
                <div className="client-row">
                    <div className="client-row-icon">
                        <FileSearchOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Inspection</h2>
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
            <InspectionGenTracking closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'AddSuivi'}
            onCancel={closeAllModals}
            footer={null}
            width={800}
            centered
        >
            <InspectionGenFormTracking closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>
    </>
  )
}

export default InspectionGen