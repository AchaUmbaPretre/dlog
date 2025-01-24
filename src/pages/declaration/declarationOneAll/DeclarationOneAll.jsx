import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, Dropdown, Menu, notification, Tag, Tooltip } from 'antd';
import { MenuOutlined, CalendarOutlined, LeftCircleFilled, RightCircleFilled, DownOutlined,EnvironmentOutlined, FileTextOutlined, DollarOutlined, BarcodeOutlined,ScheduleOutlined } from '@ant-design/icons';
import moment from 'moment';
import DeclarationDetail from '../declarationDetail/DeclarationDetail';
import DeclarationFiltre from '../declarationFiltre/DeclarationFiltre';
import DeclarationForm from '../declarationForm/DeclarationForm';
import { getDeclarationClientOneAll } from '../../../services/templateService';

const { Search } = Input;

const DeclarationOneAll = ({idClients}) => {
  const [loading, setLoading] = useState(true);
  const [columnsVisibility, setColumnsVisibility] = useState({
    '#': true,
    'Template': true,
    'Desc man': false,
    'Periode': true,
    'M² occupe': false,
    "M² facture": true,
    "Tarif Entr": true,
    'Debours Entr': true,
    'Total Entr': true,
    "TTC Entr": true,
    "Ville": true,
    "Client": true,
    "Bâtiment": false,
    "Objet fact": false,
    "Manutention": true,
    "Tarif Manu": true,
    "Debours Manu": true,
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
  const [titre, setTitre] = useState('');
  const [villeData, setVilleData] = useState([]);
  const [idClientss, setIdClientss] = useState(idClients); 


    const fetchData = async () => {
      try {
        const { data } = await getDeclarationClientOneAll(idClientss,filteredDatas);
        setTitre(data[0]?.nom)

        const groupedData = data.reduce((acc, curr) => {
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
        }, []); 

        setData(groupedData);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };

    const fetchDataVille = async () => {
      try {
        const { data } = await getDeclarationClientOneAll(idClientss, filteredDatas);
        
        // Vérification des données reçues
        if (!data || data.length === 0) {
          notification.warning({
            message: 'Aucune donnée disponible',
            description: 'Aucune déclaration n’a été trouvée pour le client sélectionné.',
          });
          setData([]);
          setLoading(false);
          return;
        }
    
        setTitre(data[0]?.nom);
    
        // Initialiser l'objet pour regrouper les données
        const grouped = {};
    
        // Regrouper et calculer les totaux
        data.forEach((curr) => {
          const capital = curr.capital;
    
          if (!grouped[capital]) {
            grouped[capital] = {
              capital,
              m2_occupe: 0,
              m2_facture: 0,
              tarif_entreposage: 0,
              total_entreposage: 0,
              debours_entreposage: 0,
              ttc_entreposage: 0,
              total_manutation: 0,
              ttc_manutation: 0,
              declarations_count: 0,
              rows: [],
            };
          }
    
          const existingClient = grouped[capital];
          existingClient.m2_occupe += curr.m2_occupe || 0;
          existingClient.m2_facture += curr.m2_facture || 0;
          existingClient.tarif_entreposage += curr.tarif_entreposage || 0;
          existingClient.total_entreposage += curr.total_entreposage || 0;
          existingClient.debours_entreposage += curr.debours_entreposage || 0;
          existingClient.ttc_entreposage += curr.ttc_entreposage || 0;
          existingClient.total_manutation += curr.total_manutation || 0;
          existingClient.ttc_manutation += curr.ttc_manutation || 0;
          existingClient.declarations_count += 1;
    
          // Ajouter la déclaration brute
          existingClient.rows.push(curr);
        });
    
        // Convertir l'objet en tableau
        const groupedData = Object.values(grouped);
    
        setVilleData(groupedData);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
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
    }, [filteredDatas, idClientss]);

    useEffect(() => {
      fetchDataVille();
    }, [filteredDatas, idClientss]);

/*   const handleDetails = (idDeclaration) => {
    openModal('Detail', idDeclaration);
  }

  const handleAddTemplate = (idDeclaration) => {
    openModal('Add', idDeclaration);
  }; */

  const handleAddDecl = (idDeclaration, idClient) => {
    openModal('AddDecl', idDeclaration,idClient );
  };

/*   const handleUpdateTemplate = (idDeclaration) => {
    openModal('Update', idDeclaration);
  }; */

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, idDeclaration = '', idClient='') => {
    closeAllModals();
    setModalType(type);
    setidDeclaration(idDeclaration);
    setidClient(idClient)
  };

  const goToNextTache = () => {
    setIdClientss((prevId) => prevId + 1);
  };

  const goToPreviousTache = () => {
    setIdClientss((prevId) => (prevId > 1 ? prevId - 1 : prevId));
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
          title: 'M² facture',
          dataIndex: 'm2_facture',
          key: 'm2_facture',
          sorter: (a, b) => a.m2_facture - b.m2_facture,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<BarcodeOutlined />} color="cyan">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['M² facture'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Total Entr',
          dataIndex: 'total_entreposage',
          key: 'total_entreposage',
          sorter: (a, b) => a.tarif_entreposage - b.tarif_entreposage,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="gold">{text ? text?.toLocaleString() : 'Aucun'}</Tag>
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
              {text ? text?.toLocaleString() : 'Aucun'}
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
            <Tag icon={<DollarOutlined />} color="green">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Tarif Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Total Manu',
          dataIndex: 'total_manutation',
          key: 'total_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="gold">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Total Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'TTC Manu',
          dataIndex: 'ttc_manutation',
          key: 'ttc_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="volcano">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['TTC Manu'] ? {} : { className: 'hidden-column' }),
        },
      ]
    }
  ];

  const columnsVille = [
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
          title: 'Ville',
          dataIndex: 'capital',
          key: 'capital',
          render: (text) => {
            return (
              <Tag icon={<EnvironmentOutlined />} color="blue">{text}</Tag>
            );
          },
          ...(columnsVisibility['Ville'] ? {} : { className: 'hidden-column' }),
        }, 
        {
          title: 'M² facture',
          dataIndex: 'm2_facture',
          key: 'm2_facture',
          sorter: (a, b) => a.m2_facture - b.m2_facture,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="cyan">{text?.toLocaleString() ?? 'Aucun'}</Tag>
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
            <Tag icon={<DollarOutlined />} color="green">{text?.toLocaleString() ?? 'Aucun'}</Tag>
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
            <Tag icon={<DollarOutlined />} color="gold">{text?.toLocaleString() ? parseFloat(text).toFixed(2) : 'Aucun'}</Tag>
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
              {text ? text?.toLocaleString() : 'Aucun'}
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
          title: 'Tarif Manu',
          dataIndex: 'tarif_manutation',
          key: 'tarif_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Tarif Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Total Manu',
          dataIndex: 'total_manutation',
          key: 'total_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="gold">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Total Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'TTC Manu',
          dataIndex: 'ttc_manutation',
          key: 'ttc_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="volcano">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['TTC Manu'] ? {} : { className: 'hidden-column' }),
        },
      ]
    }
  ];

  const columnsVilleSous = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
      ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: 'Template',
      dataIndex: 'desc_template',
      key: 'desc_template',
        render: (text, record) => (
            <Tag icon={<FileTextOutlined />} color="geekblue" onClick={() => handleAddDecl(record.id_declaration_super, record.id_client)}>{text ?? 'Aucun'}</Tag>
          ),
        ...(columnsVisibility['Template'] ? {} : { className: 'hidden-column' }),
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
            <Tag icon={<DollarOutlined />} color="cyan">{text?.toLocaleString() ?? 'Aucun'}</Tag>
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
            <Tag icon={<DollarOutlined />} color="green">{text?.toLocaleString() ?? 'Aucun'}</Tag>
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
            <Tag icon={<DollarOutlined />} color="gold">{text ? text?.toLocaleString() : 'Aucun'}</Tag>
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
              {text ? text?.toLocaleString() : 'Aucun'}
            </Tag>
          ),
          ...(columnsVisibility['TTC Entr'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: 'Manutention',
      children: [       
        {
          title: 'Tarif Manu',
          dataIndex: 'tarif_manutation',
          key: 'tarif_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Tarif Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Total Manu',
          dataIndex: 'total_manutation',
          key: 'total_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="gold">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Total Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'TTC Manu',
          dataIndex: 'ttc_manutation',
          key: 'ttc_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="volcano">{text?.toLocaleString() ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['TTC Manu'] ? {} : { className: 'hidden-column' }),
        },
      ]
    }
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
            <h2 className="client-h2">Déclarations {titre}</h2>
          </div>
          {filterVisible && <DeclarationFiltre onFilter={handleFilterChange} visible={true}/>}
          <div className="client-arrow">
            <Tooltip title="Précédent">
              <Button className="row-arrow" onClick={goToPreviousTache} disabled={idClientss === 1}>
                <LeftCircleFilled className='icon-arrow'/>
              </Button>
            </Tooltip>
            <Tooltip title="Suivant">
              <Button className="row-arrow" onClick={goToNextTache}>
                <RightCircleFilled className='icon-arrow' />
              </Button>
            </Tooltip>
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

          <div className="title_row_ville">
            <h2 className="title_h2" style={{ width:'100%', textAlign:'center', fontSize:'1.2rem', color:'#292929ee', fontWeight:'300'}}>Par ville :</h2>
          </div>
          <Table
            id="printableTable"
            columns={columnsVille}
            expandable={{
              expandedRowRender: (record) => (
                <Table
                  columns={columnsVilleSous}
                  dataSource={record.rows}
                  rowKey="id"
                  size="small"
                  bordered
                />
              ),
              rowExpandable: (record) => record.rows && record.rows.length > 0, // Si la ligne a des sous-lignes
            }}
            dataSource={villeData}
            rowKey="capital"
            size="small"
            bordered
            loading={loading}
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
    </>
  );
};

export default DeclarationOneAll;