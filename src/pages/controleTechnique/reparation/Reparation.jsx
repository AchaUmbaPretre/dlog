import React, { useEffect, useState } from 'react'
import { ToolOutlined, CarOutlined, ShopOutlined, PlusOutlined, EyeOutlined, SyncOutlined, CloseCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, MoreOutlined, PlusCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { Input, Button, Dropdown, Menu, notification, Table, Tag, Modal } from 'antd';
import moment from 'moment';
import ReparationForm from './reparationForm/ReparationForm';
import { getReparation } from '../../../services/charroiService';
import SuiviReparationForm from './suiviReparation/suiviReparationForm/SuiviReparationForm';
import SuiviReparation from './suiviReparation/SuiviReparation';
import ReparationDetail from './reparationDetail/ReparationDetail';

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
    const [idReparation, setIdReparation] = useState('')

    
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
                openModal('Detail', record.id_reparation)
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
            <Menu.Item key="voirDetail">
                <EyeOutlined style={{ color: 'green' }} /> Voir Détail
            </Menu.Item>
            <Menu.Divider />

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
            title: 'Type réparation',
            dataIndex: 'type_rep',
            render: (text) => (
                <Tag color="green">
                    {text}
                </Tag>
            )
        },
        {
          title: 'Date Entrée',
          dataIndex: 'date_entree',
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
            title: '#Jour',
            dataIndex: 'nb_jours_au_garage',
            render: (text) => (
                <Tag color='orange'>
                    {text ?? 'Aucun'}
                </Tag>
            )
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
        },
        {
            title: 'Etat',
            dataIndex: 'nom_type_statut',
            render: (status) => {
              let color = 'default';
              let icon = null;
          
              switch (status) {
                case 'En attente':
                  color = 'orange';
                  icon = <ClockCircleOutlined />;
                  break;
                case 'En cours':
                  color = 'blue';
                  icon = <SyncOutlined spin />;
                  break;
                case 'Terminé':
                  color = 'green';
                  icon = <CheckCircleOutlined />;
                  break;
                case 'Annulé':
                  color = 'red';
                  icon = <CloseCircleOutlined />;
                  break;
                default:
                  color = 'default';
              }
          
              return (
                <Tag icon={icon} color={color} style={{ fontWeight: 500 }}>
                  {status}
                </Tag>
              );
            }
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
      
    const openModal = (type, id='') => {
        closeAllModals();
        setModalType(type);
        setIdReparation(id)
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
            visible={modalType === 'DetailSuivi'}
            onCancel={closeAllModals}
            footer={null}
            width={950}
            centered
        >
            <SuiviReparation closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'AddSuivi'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
            <SuiviReparationForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'Detail'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
            <ReparationDetail closeModal={() => setModalType(null)} fetchData={fetchData} idReparation={idReparation} />
        </Modal>
    </>
  )
}

export default Reparation