import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Tag, Space, Tooltip, Popconfirm } from 'antd';
import { MenuOutlined,EditOutlined,EyeOutlined, DeleteOutlined, CalendarOutlined,DownOutlined,EnvironmentOutlined, HomeOutlined, FileTextOutlined, ToolOutlined, DollarOutlined, BarcodeOutlined,ScheduleOutlined,PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import { deletePutDeclaration, getDeclaration } from '../../services/templateService';
import DeclarationForm from './declarationForm/DeclarationForm';
import DeclarationFiltre from './declarationFiltre/DeclarationFiltre';
import moment from 'moment';
import DeclarationDetail from './declarationDetail/DeclarationDetail';
import DeclarationOneClient from './declarationOneClient/DeclarationOneClient';

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

  const fetchData = async () => {
    try {
      const { data } = await getDeclaration(filteredDatas);
  
/*       const groupedData = data.reduce((acc, curr) => {
        const existingClient = acc.find(item => item.id_client === curr.id_client);
  
        if (existingClient) {
          if (curr.nom_batiment) {
            existingClient.nom_batiment = [...new Set([...existingClient.nom_batiment, curr.nom_batiment])];
          }
  
          if (curr.capital) {
            existingClient.capital = [...new Set([...existingClient.capital, curr.capital])];
          }
  
          existingClient.m2_occupe += curr.m2_occupe || 0;
          existingClient.m2_facture += curr.m2_facture || 0;
          existingClient.tarif_entreposage += curr.tarif_entreposage || 0;
          existingClient.total_entreposage += curr.total_entreposage || 0;
          existingClient.debours_entreposage += curr.debours_entreposage || 0;
          existingClient.ttc_entreposage += curr.ttc_entreposage || 0;
          existingClient.total_manutation += curr.total_manutation || 0;
          existingClient.ttc_manutation += curr.ttc_manutation || 0;
  
          existingClient.declarations_count += 1;
        } else {
          acc.push({
            id_client: curr.id_client,
            nom: curr.nom,
            nom_batiment: curr.nom_batiment ? [curr.nom_batiment] : [],
            capital: curr.capital ? [curr.capital] : [],
            m2_occupe: curr.m2_occupe || 0,
            m2_facture: curr.m2_facture || 0,
            tarif_entreposage: curr.tarif_entreposage || 0,
            debours_entreposage: curr.debours_entreposage || 0,
            total_entreposage: curr.total_entreposage || 0,
            ttc_entreposage: curr.ttc_entreposage || 0,
            total_manutation: curr.total_manutation || 0,
            ttc_manutation: curr.ttc_manutation || 0,
            desc_template: curr.desc_template,
            declarations_count: 1
          });
        }
  
        return acc;
      }, []); */
  
      setData(data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: "Erreur de chargement",
        description: "Une erreur est survenue lors du chargement des données.",
      });
      setLoading(false);
    }
  };
          
    const handFilter = () => {
      fetchData()
      setFilterVisible(!filterVisible)
    }

    useEffect(() => {
      fetchData();
    }, [filteredDatas]);

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
      render: (text, record, index) => index + 1,
      width: "3%",
      ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' }),
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
            <div>
              <Tooltip title={`Cliquez ici pour afficher les détails de ${record.nom}`}>
                <Tag icon={<FileTextOutlined />} color="geekblue" onClick={() => handleAddDecl(record.id_declaration_super, record.id_client)}>{text ?? 'Aucun'}</Tag>
              </Tooltip>
            </div>
          ),
          ...(columnsVisibility['Template'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Client',
          dataIndex: 'nom',
          key: 'nom',
          render: (text, record) => (
            <Tag icon={<UserOutlined />} color="orange" onClick={() => handleDeclarationOneAll(record.id_declaration_super, record.id_client)}>
              {text ?? 'Aucun'}
            </Tag>
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
          title: 'M² facture',
          dataIndex: 'm2_facture',
          key: 'm2_facture',
          sorter: (a, b) => a.m2_facture - b.m2_facture,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<BarcodeOutlined />} color="cyan">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['M² facture'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Tarif Entr',
          dataIndex: 'tarif_entreposage',
          key: 'tarif_entreposage',
          sorter: (a, b) => a.tarif_entreposage - b.tarif_entreposage,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Tarif Entr'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Total Entr',
          dataIndex: 'total_entreposage',
          key: 'total_entreposage',
          sorter: (a, b) => a.tarif_entreposage - b.tarif_entreposage,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="gold">{text ? parseFloat(text).toFixed(2) : 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Total Entr'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'TTC Entr',
          dataIndex: 'ttc_entreposage',
          key: 'ttc_entreposage',
          sorter: (a, b) => a.total_entreposage - b.total_entreposage,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="volcano">
              {text ? parseFloat(text).toFixed(2) : 'Aucun'}
            </Tag>
          ),
          ...(columnsVisibility['TTC Entr'] ? {} : { className: 'hidden-column' }),
        },        
        {
          title: 'Nbre',
          dataIndex: 'declarations_count',
          key: 'declarations_count',
          sorter: (a, b) => a.declarations_count - b.declarations_count,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<BarcodeOutlined />} color="cyan">{text ?? 'Aucun'}</Tag>
          ),
        },
      ]
    },
  
    // Groupe Manutention
    {
      title: 'Manutention',
      children: [
        {
          title: 'Ville',
          dataIndex: 'capital',
          key: 'capital',
          render: (capital) => {
            const formattedCapital = Array.isArray(capital) ? capital.join(', ') : 'Aucun'; // Joindre les villes par des virgules
            return (
              <Tag icon={<EnvironmentOutlined />} color="blue">{formattedCapital}</Tag>
            );
          },
          ...(columnsVisibility['Ville'] ? {} : { className: 'hidden-column' }),
        },        
        {
          title: 'Tarif Manu',
          dataIndex: 'tarif_manutation',
          key: 'tarif_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Tarif Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Total Manu',
          dataIndex: 'total_manutation',
          key: 'total_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="gold">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Total Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'TTC Manu',
          dataIndex: 'ttc_manutation',
          key: 'ttc_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="volcano">{text ?? 'Aucun'}</Tag>
          ),
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

  const filteredData = data.filter(item =>
    item.desc_template?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom?.toLowerCase().includes(searchValue.toLowerCase()));
  
  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ScheduleOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Déclarations</h2>
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
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            size="middle"
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
        <DeclarationOneClient closeModal={() => setModalType(null)} fetchData={fetchData} idDeclaration={''} idDeclarationss={idDeclaration} idClients={idClient} />
     </Modal>
    </>
  );
};

export default Declaration;