import { useEffect, useState } from 'react'
import { Table, Tag, message, Dropdown, Menu, Modal, Tooltip, Button, Input, notification } from 'antd';
import { StockOutlined, ExclamationCircleOutlined, MenuOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { statusIcons } from '../../../../utils/prioriteIcons';
import { getBandeSortie, putAnnulereBandeSortie, putEstSupprimeBandeSortie } from '../../../../services/charroiService';
import ValidationDemandeForm from '../../demandeVehicule/validationDemande/validationDemandeForm/ValidationDemandeForm';
import ReleveBonDeSortie from './releveBonDeSortie/ReleveBonDeSortie';
import BandeSortieDetail from './bandeSortieDetail/BandeSortieDetail';
import { useSelector } from 'react-redux';
import UpdateTime from './updateTime/UpdateTime';
import RapportBs from './rapportBs/RapportBs';
import { useBandeColumns } from './hooks/useBandeColumns';
import { useBandeData } from './hooks/useBandeData';

const { Search } = Input;
const { confirm } = Modal;

const BandeSortie = () => {
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const scroll = { x: 'max-content' };
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);
    const [bonId, setBonId] = useState('');
    const [columnsVisibility, setColumnsVisibility] = useState({
      "#" : true,
      "Service" : true,
      "Chauffeur" : true,
      "Destination" : true,
      "Retour effectif" : true,
      "Depart" : true,
      "Véhicule" : true,
      "Immatriculation": true,
      "Marque" : false,
      "Preuve" : true,
      "Retour" : true,
      "Statut" : true,
      "Client" : false,
      "Demandeur" : true,
      "Agent" : false,
      "Créé par" : false
    });
    const { data,
            fetchData,
            handleDelete,
            handleAnnuler,
             } = useBandeData(userId)
    const columnStyles = {
      title: {
        maxWidth: '160px',
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

    const handlSortie = (id) => openModal('validation', id);
    const handleReleve = (id) => openModal('releve', id);
    const handleDetail = (id) => openModal('detail', id);
    const handleUpdateTime = (id) => openModal('dateTime', id);
    const handleRapportBs = () => openModal('rapport');

    const closeAllModals = () => {
      setModalType(null);
    };

    const openModal = (type, id = '') => {
      closeAllModals();
      setModalType(type);
      setBonId(id)
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

    const columns = useBandeColumns({
      pagination,
      columnsVisibility ,
      columnStyles,
      statusIcons,
      handleDetail,
      handleUpdateTime,
      handleReleve,
      handlSortie,
      handleAnnuler,
      handleDelete,
    });

    const filteredData = data.filter(item =>
      item.nom?.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.nom_destination?.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <>
        <div className="client">
          <div className="client-wrapper">
            <div className="client-row">
              <div className="client-row-icon">
                <ExportOutlined className='client-icon' style={{color:'blue'}} />
              </div>
              <h2 className="client-h2"> Tableau des bons de sortie</h2>
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

                <Tooltip title="Cliquez pour voir le rapport complet">
                  <Button
                    type="primary"
                    icon={<StockOutlined />}
                    onClick={handleRapportBs}
                    style={{
                      backgroundColor: '#6a8bff',
                      borderColor: '#6a8bff',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '8px 20px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                    aria-label="Générer le rapport des stocks"
                  >
                    Générer Rapport
                  </Button>
                </Tooltip>

                <Dropdown overlay={menus} trigger={['click']}>
                  <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                    Colonnes <DownOutlined />
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
              pagination={pagination}
              onChange={(pagination) => setPagination(pagination)}
              rowKey="id"
              bordered
              size="small"
              scroll={scroll}
              rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
            />
          </div>
        </div>

        <Modal
            title=""
            visible={modalType === 'validation'}
            onCancel={closeAllModals}
            footer={null}
            width={1020}
            centered
        >
            <ValidationDemandeForm closeModal={() => setModalType(null)} fetchData={fetchData} id_bon={bonId} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'releve'}
            onCancel={closeAllModals}
            footer={null}
            width={800}
            centered
        >
            <ReleveBonDeSortie closeModal={() => setModalType(null)} fetchData={fetchData} id_bon={bonId} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'detail'}
            onCancel={closeAllModals}
            footer={null}
            width={1100}
            centered
        >
          <BandeSortieDetail closeModal={() => setModalType(null)} fetchData={fetchData} id_bon={bonId} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'dateTime'}
          onCancel={closeAllModals}
          footer={null}
          width={800}
          centered
        >
          <UpdateTime closeModal={() => setModalType(null)} fetchData={fetchData} id_bon={bonId} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'rapport'}
          onCancel={closeAllModals}
          footer={null}
          width={1150}
          centered
        >
          <RapportBs />
        </Modal>
    </>
  )
}

export default BandeSortie;