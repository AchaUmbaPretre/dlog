import React, { useEffect, useRef, useState } from 'react'
import { ToolOutlined, CarOutlined, FileTextOutlined, ShopOutlined, MenuOutlined, DownOutlined, EyeOutlined, SyncOutlined, CloseCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, MoreOutlined, PlusCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { Input, Button, Dropdown, Menu, Space, notification, Table, Tag, Modal } from 'antd';
import moment from 'moment';
import ReparationForm from './reparationForm/ReparationForm';
import { getReparation } from '../../../services/charroiService';
import SuiviReparationForm from './suiviReparation/suiviReparationForm/SuiviReparationForm';
import SuiviReparation from './suiviReparation/SuiviReparation';
import ReparationDetail from './reparationDetail/ReparationDetail';
import DocumentReparation from './documentReparation/DocumentReparation';
import getColumnSearchProps from '../../../utils/columnSearchUtils';

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
    const [columnsVisibility, setColumnsVisibility] = useState({
      '#': true,
      'Matricule': true,
      'Marque': true,
      'Type réparation': true,
      'Date entree': true,
      "Date réparation": false,
      "Jour": false,
      'Fournisseur':true,
      'Statut': true,
      'Etat': true,
      'Budget' : true,
      "Main d'oeuvre" : false,
      'Date sortie' : false,
      "commentaire": false
    });
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

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
        fetchData();
        const intervalId = setInterval(() => {
          fetchData();
        }, 5000); // 5000 ms = 5 secondes
    
        return () => clearInterval(intervalId);
    }, [])

    const getActionMenu = (record, openModal) => {
        const handleClick = ({ key }) => {
          switch (key) {
            case 'voirDetail':
                openModal('Detail', record.id_reparation)
              break;
            case 'Document':
              openModal('Document', record.id_sud_reparation);
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
            <Menu.Item key="Document">
              <FileTextOutlined style={{ color: 'blue' }} /> Document
            </Menu.Item>

{/*           <Menu.SubMenu
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
            </Menu.SubMenu> */}
          </Menu>
        );
    };

    const toggleColumnVisibility = (columnName, e) => {
      e.stopPropagation();
      setColumnsVisibility(prev => ({
        ...prev,
        [columnName]: !prev[columnName]
      }));
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
          ...getColumnSearchProps(
              'immatriculation',
                searchText,
                setSearchText,
                setSearchedColumn,
                searchInput
            ),
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
            title: 'Marque',
            dataIndex: 'nom_marque',
            ...getColumnSearchProps(
                'nom_marque',
                searchText,
                setSearchText,
                setSearchedColumn,
                searchInput
            ),
            render: (text, record) => (
                <Tag icon={<CarOutlined />} color="orange">
                    {text}
                </Tag>
            ),
            ...(columnsVisibility['Marque'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: 'Type réparation',
            dataIndex: 'type_rep',
            ...getColumnSearchProps(
              'type_rep',
              searchText,
              setSearchText,
              setSearchedColumn,
              searchInput
            ),
            render: (text) => (
              <Tag icon={<ToolOutlined spin />} color='volcano' bordered={false}>
                {text}
              </Tag>
            ),
          ...(columnsVisibility['Type réparation'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Date Entrée',
          dataIndex: 'date_entree',
          render: (text) => (
            <Tag icon={<CalendarOutlined />} color="blue">
                {moment(text).format('DD-MM-YYYY')}
            </Tag>
          ),
          ...(columnsVisibility['Date entree'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Date Sortie',
          dataIndex: 'date_sortie',
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
          ...(columnsVisibility['Date sortie'] ? {} : { className: 'hidden-column' }),
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
          },
          ...(columnsVisibility['Date réparation'] ? {} : { className: 'hidden-column' }),
        },  
        {
            title: '#Jour',
            dataIndex: 'nb_jours_au_garage',
            render: (text) => (
              <Tag color='orange'>
                {text ?? 'Aucun'}
              </Tag>
            ),
            ...(columnsVisibility['Jour'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: "Budget",
          dataIndex: 'montant',
          key: 'montant',
          sorter: (a, b) => a.montant - b.montant,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
              <Space>
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
          ...(columnsVisibility['Budget'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: "Main d'oeuvre",
          dataIndex: 'cout',
          key: 'cout',
          sorter: (a, b) => a.cout - b.cout,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
              <Space>
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
          ...(columnsVisibility["Main d'oeuvre"] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Fournisseur',
          dataIndex: 'nom_fournisseur',
          ...getColumnSearchProps(
              'nom_fournisseur',
              searchText,
              setSearchText,
              setSearchedColumn,
              searchInput
          ),
          render: (text) => (
              <Tag>
                <ShopOutlined style={{ marginRight: 5, color: '#52c41a' }} />
                {text}
              </Tag>
            ),
          ...(columnsVisibility['Fournisseur'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: "Commentaire",
          dataIndex: 'commentaire',
          render: (text) => (
            <div style={columnStyles.title} className={columnStyles.hideScroll}>
              {text}
            </div>
          ),
          ...(columnsVisibility['Commentaire'] ? {} : { className: 'hidden-column' }),
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
            },
            ...(columnsVisibility['Etat'] ? {} : { className: 'hidden-column' }),

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

    const handleAddReparation = () => openModal('Add');

    
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

                      <Dropdown overlay={menus} trigger={['click']}>
                        <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                          Colonnes <DownOutlined />
                        </Button>
                      </Dropdown>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
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
          visible={modalType === 'Document'}
          onCancel={closeAllModals}
          footer={null}
          width={950}
          centered
        >
          <DocumentReparation closeModal={() => setModalType(null)} fetchData={fetchData} id_sud_reparation={idReparation} />
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