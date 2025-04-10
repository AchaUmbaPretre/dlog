import React, { useEffect, useState } from 'react'
import { ToolOutlined, PlusOutlined, EyeOutlined, FileTextOutlined, MoreOutlined, PlusCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { Input, Button, Dropdown, Menu, notification, Space, Table, Tag, Modal } from 'antd';
import moment from 'moment';
import ReparationForm from './reparationForm/ReparationForm';
import { getReparation } from '../../../services/charroiService';
import InspectionReparationForm from './inspectionReparation/inspectionReparationForm/InspectionReparationForm';

const { Search } = Input;

const Reparation = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    }); 
    const [data, setData] = useState([]);
    const [modalType, setModalType] = useState(null);
    const scroll = { x: 'max-content' };

    
   const fetchData = async() => {
        try {
            const { data } = await getReparation();
            setData(data.data);
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

    const getActionMenu = (record, openModal) => {
        const handleClick = ({ key }) => {
          switch (key) {
            case 'voirDetail':
                openModal('DetailInspection', record.id_reparation)
              break;
            case 'ajouterInspection':
              openModal('AddInspection', record.id_reparation);
              break;
            case 'DetailSuivi':
                openModal('DetailSuivi', record.id_reparation)
                break;
            case 'ajouterSuivi':
                openModal('AddSuivi', record.id_reparation)
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
              <Menu.Item key="ajouterInspection">
                <PlusOutlined style={{ color: 'orange' }} /> Ajouter Inspection
              </Menu.Item>
            </Menu.SubMenu>
      
            <Menu.SubMenu
              key="suivi"
              title={
                <>
                  <FileTextOutlined style={{ color: '#722ed1' }} /> Suivi
                </>
              }
            >
              <Menu.Item key="DetailSuivi">
                <EyeOutlined style={{ color: 'green' }} /> Voir Détail
              </Menu.Item>
              <Menu.Item key="ajouterSuivi">
                <PlusOutlined style={{ color: 'red' }} /> Ajouter Suivi
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
            render: (text, record, index) => index + 1, 
            width: "3%" 
          },
        {
          title: 'Matricule',
          dataIndex: 'immatriculation',
        },
        {
            title: 'Marque',
            dataIndex: 'nom_marque',
        },
        {
          title: 'Date debut',
          dataIndex: 'date_reparation',
          render: (text) => (
            <Tag icon={<CalendarOutlined />} color="blue">
                {moment(text).format('DD-MM-YYYY')}
            </Tag>
          )
        },
        {
            title: 'Date prevue',
            dataIndex: 'date_prevu',
            render: (text) => (
                <Tag icon={<CalendarOutlined />} color="blue">
                    {moment(text).format('DD-MM-YYYY')}
                </Tag>
              )
        },
        {
          title: 'Date fin',
          dataIndex: 'date_sortie',
          render: (text) => (
            <Tag icon={<CalendarOutlined />} color="blue">
                {moment(text).format('DD-MM-YYYY')}
            </Tag>
          )
        },
        {
            title: 'Nbre Jour',
            dataIndex: 'nb_jours_au_garage'
        },
        {
            title: 'Description',
            dataIndex: 'commentaire'
        },
        {
            title: 'Fournisseur',
            dataIndex: 'nom_fournisseur'
        },
        {
            title: 'Etat',
            dataIndex: 'nom_type_statut'
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
          
      ];


    const handleAddReparation = () => openModal('Add')
    
    
    const closeAllModals = () => {
        setModalType(null);
      };
      
    const openModal = (type) => {
        closeAllModals();
        setModalType(type);
      };

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <ToolOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Liste des réparations</h2>
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
                            onClick={handleAddReparation}
                        >
                            Ajouter une réparation
                        </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
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
        <Modal
            title=""
            visible={modalType === 'Add'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
            <ReparationForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'AddInspection'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
            <InspectionReparationForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'AddInspection'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
            <InspectionReparationForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>
    </>
  )
}

export default Reparation