import { useEffect, useState } from 'react'
import { Table, Tag, Popconfirm, message, Dropdown, Space, Menu, Modal, Tooltip, Button, Typography, Input, notification } from 'antd';
import { CarOutlined, StockOutlined, ExclamationCircleOutlined, DeleteOutlined, ApartmentOutlined, AppstoreOutlined, FieldTimeOutlined, EnvironmentOutlined, FileTextOutlined, CloseOutlined, MenuOutlined, DownOutlined, TrademarkOutlined, ExportOutlined, CheckCircleOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { statusIcons } from '../../../../utils/prioriteIcons';
import { getBandeSortie, putAnnulereBandeSortie, putEstSupprimeBandeSortie } from '../../../../services/charroiService';
import ValidationDemandeForm from '../../demandeVehicule/validationDemande/validationDemandeForm/ValidationDemandeForm';
import ReleveBonDeSortie from './releveBonDeSortie/ReleveBonDeSortie';
import BandeSortieDetail from './bandeSortieDetail/BandeSortieDetail';
import { useSelector } from 'react-redux';
import UpdateTime from './updateTime/UpdateTime';
import RapportBs from './rapportBs/RapportBs';
import { useBandeColumns } from './hooks/useBandeColumns';

const { Search } = Input;
const { Text } = Typography;
const { confirm } = Modal;

const BandeSortie = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
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

    const handleDelete = async(id, idVehicule) => {
      try {
        await putEstSupprimeBandeSortie(id, idVehicule, userId);
        setData((prevData) => prevData.filter((item) => item.id_bande_sortie  !== id));
        message.success("Le bon de sortie a été supprimée avec succès.");
      } catch (error) {
          notification.error({
          message: 'Erreur de suppression',
          description: 'Une erreur est survenue lors de la suppression du bon.',
        });
      }
    }

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

    const fetchData = async() => {
      try {
        const { data } = await  getBandeSortie(userId)
        setData(data)
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          escription: 'Une erreur est survenue lors du chargement des données.',
        });
                
      } finally{
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData();
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, [userId]);

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

    const handleAnnuler = (id_bande_sortie, id_vehicule) => {
      confirm({
        title: "Voulez-vous vraiment annuler ce bon ?",
        icon: <ExclamationCircleOutlined style={{ color: "#faad14" }} />,
        content: `Le bon de sortie n°${id_bande_sortie} sera définitivement annulé.`,
        okText: "Oui, annuler",
        cancelText: "Non, garder",
        okType: "danger",
        centered: true,
        async onOk() {
          const loadingKey = "loadingAnnuler";

          message.loading({
            content: "Traitement en cours, veuillez patienter...",
            key: loadingKey,
            duration: 0,
          });

          setLoading(true);

          try {
            await putAnnulereBandeSortie(id_bande_sortie, id_vehicule, userId);

            message.success({
              content: `Le bon de sortie ${id_bande_sortie} a été annulé avec succès.`,
              key: loadingKey,
            });

            fetchData();
          } catch (error) {
            console.error("Erreur lors de l'annulation :", error);

            message.error({
              content: "Une erreur est survenue lors de l'annulation.",
              key: loadingKey,
            });
          } finally {
            setLoading(false);
          }
        },
      });
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
              loading={loading}
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