import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tag, Tooltip, Popover, Tabs, Popconfirm } from 'antd';
import { 
  ExportOutlined, FileOutlined, WarningOutlined, ApartmentOutlined, RocketOutlined, DollarOutlined, 
  CheckSquareOutlined, HourglassOutlined,EditOutlined, ClockCircleOutlined, PrinterOutlined, CheckCircleOutlined, 
  CalendarOutlined, TeamOutlined,DeleteOutlined,PlusCircleOutlined, EyeOutlined, UserOutlined, FileTextOutlined, PlusOutlined, FileDoneOutlined 
} from '@ant-design/icons';
import TacheForm from './tacheform/TacheForm';
import { deletePutTache, getTache } from '../../services/tacheService';
import { Link } from 'react-router-dom';
import ListeDocTache from './listeDocTache/ListeDocTache';
import TacheDoc from './tacheDoc/TacheDoc';
import FormatCalendar from './formatCalendar/FormatCalendar';
import moment from 'moment';
import DetailTache from './detailTache/DetailTache';
import SuiviTache from './suiviTache/SuiviTache';
import ListeTracking from './listeTracking/ListeTracking';

const { Search } = Input;

const Taches = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [idTache, setIdTache] = useState('');
  const scroll = { x: 400 };


  const handleDelete = async (id) => {
    try {
       await deletePutTache(id);
      setData(data.filter((item) => item.id_tache !== id));
      message.success('Tache supprimée avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du budget.',
      });
    }
  };

    const fetchData = async () => {
      try {
        const response = await getTache();
        setData(response.data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };

    useEffect(() => {
    fetchData();
  }, []);

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, idTache = '') => {
    closeAllModals();
    setIdTache(idTache);
    setModalType(type);
  };

  const handleEdit = (idTache) => {
    setIdTache(idTache);
    setIsModalVisible(true);

  };

  const handleViewDetails = (idTache) => {
    message.info(`Affichage des détails de la tâche : ${idTache}`);
    openModal('detail', idTache);
  };

  const handleDetailDoc = (idTache) => {
    openModal('ListeDoc', idTache);
  };

  const handleAjouterDoc = (idTache) => {
    openModal('DocumentTacheForm', idTache);
  };

  const handleTracking = (idTache) => {
    openModal('suivi', idTache);
  };

  const handleListeTracking = (idTache) => {
    openModal('listeTracking', idTache);
  };

  const handleAddTask = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleExportExcel = () => {
    message.success('Exportation vers Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exportation au format PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        Exporter vers Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        Exporter au format PDF
      </Menu.Item>
    </Menu>
  );

  const statusIcons = {
    'En attente': { icon: <ClockCircleOutlined />, color: 'orange' },
    'En cours': { icon: <HourglassOutlined />, color: 'blue' },
    'Point bloquant': { icon: <WarningOutlined />, color: 'red' },
    'En attente de validation': { icon: <CheckSquareOutlined />, color: 'purple' },
    'Validé': { icon: <CheckCircleOutlined />, color: 'green' },
    'Budget': { icon: <DollarOutlined />, color: 'gold' },
    'Executé': { icon: <RocketOutlined />, color: 'cyan' },
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
    },
    { 
      title: 'DPT', 
      dataIndex: 'departement', 
      key: 'nom_departement',
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    {   
      title: 'Nom',
      dataIndex: 'nom_tache', 
      key: 'nom_tache', 
      render: text => (
        <Space>
          <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
        </Space>
      )
    },
    {   
      title: 'Client', 
      dataIndex: 'nom_client', 
      key: 'nom_client',
      render: text => (
        <Space>
          <Tag icon={<UserOutlined />} color='green'>{text ?? 'Aucun'}</Tag>
        </Space>
      )
    },
    { 
      title: 'Statut', 
      dataIndex: 'statut', 
      key: 'statut',
      render: text => {
        const { icon, color } = statusIcons[text] || {};
        return (
          <Space>
            <Tag icon={icon} color={color}>{text}</Tag>
          </Space>
        );
      }
    },
    {
      title: 'Date debut & fin',
      dataIndex: 'date_debut',
      key: 'date_debut',
      sorter: (a, b) => moment(a.date_debut) - moment(b.date_debut),
      sortDirections: ['descend', 'ascend'],
      render: (text,record) => 
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')} & {moment(record.date_fin).format('DD-MM-yyyy')}
        </Tag>
    },
    { 
      title: 'Fréquence', 
      dataIndex: 'frequence', 
      key: 'frequence',
      render: text => (
        <Space>
          <Tag icon={<CalendarOutlined />} color='blue'>{text}</Tag>
        </Space>
      )
    },
    {
      title: 'Owner', 
      dataIndex: 'owner', 
      key: 'owner',
      render: text => (
        <Space>
          <Tag icon={<TeamOutlined />} color='purple'>{text}</Tag>
        </Space>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render : (text, record) => (
        <Space size="middle">
            <Tooltip title="Modifier">
              <Button
                icon={<EditOutlined />}
                style={{ color: 'green' }}
                onClick={() => handleEdit(record.id_tache)}
                aria-label="Edit tache"
              />
          </Tooltip>
          <Tooltip title="Voir les détails">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record.id_tache)}
              aria-label="Voir les détails de la tâche"
              style={{color: 'green'}}
            />
          </Tooltip>
          <Popover
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link onClick={() => handleTracking(record.id_tache)} >
                  <FileTextOutlined /> Tracking
                </Link>
                <Link onClick={()=>handleListeTracking(record.id_tache)}>
                  <FileTextOutlined /> Liste de tracking
                </Link>
              </div>
            }
            title=""
            trigger="click"
          >
            <Tooltip title="Menu">
              <Button
                icon={<PlusCircleOutlined />}
                style={{ color: 'blue' }}
                aria-label="Contrôler"
              />
            </Tooltip>
          </Popover>
          <Popover
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link onClick={() => handleDetailDoc(record.id_tache)} >
                  <FileTextOutlined /> Liste des docs
                </Link>
                <Link onClick={() => handleAjouterDoc(record.id_tache)} >
                  <FileTextOutlined /> Ajouter un doc
                </Link>
              </div>
            }
            title=""
            trigger="click"
          >
            <Tooltip title="Documents">
              <Button
                icon={<FileOutlined />}
                style={{ color: 'green' }}
                aria-label="Documents"
              />
            </Tooltip>
          </Popover>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cette tache ?"
              onConfirm={() => handleDelete(record.id_tache)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Delete"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const filteredData = data.filter(item =>
    item.departement?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_tache?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.statut?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.frequence?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.owner?.toLowerCase().includes(searchValue.toLowerCase())

  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileDoneOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Tâches</h2>
          </div>
          <Tabs defaultActiveKey="0">
            <Tabs.TabPane tab='Liste de tache' key="0">
              <div className="client-actions">
                <div className="client-row-left">
                  <Search 
                    placeholder="Rechercher des tâches..." 
                    enterButton 
                    onChange={(e) => setSearchValue(e.target.value)} 
                    />
                </div>
                <div className="client-rows-right">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddTask}
                  >
                    Ajouter une tâche
                  </Button>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon={<ExportOutlined />}>Exporter</Button>
                  </Dropdown>
                  <Button
                    icon={<PrinterOutlined />}
                    onClick={handlePrint}
                  >
                    Imprimer
                  </Button>
                </div>
              </div>
              <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={{ pageSize: 15 }}
                rowKey="id"
                bordered
                size="middle"
                scroll={scroll}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Vue calendrier' key="1">
              <FormatCalendar/>
            </Tabs.TabPane>

          </Tabs>
        </div>
      </div>

      <Modal
        title="Ajouter une nouvelle tâche"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={850}
        centered
      >
        <TacheForm idTache={idTache} closeModal={()=>setIsModalVisible(false)} fetchData={fetchData}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'DocumentTacheForm'}
        onCancel={closeAllModals}
        footer={null}
        centered
      >
        <TacheDoc idTache={idTache} />
      </Modal>

      <Modal
        title="Liste des documents"
        visible={modalType === 'ListeDoc'}
        onCancel={closeAllModals}
        footer={null}
        width={850}
        centered
      >
        <ListeDocTache idTache={idTache} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'detail'}
        onCancel={closeAllModals}
        footer={null}
        width={850}
        centered
      >
        <DetailTache idTache={idTache} />
      </Modal>

      <Modal
        title="Tracking"
        visible={modalType === 'suivi'}
        onCancel={closeAllModals}
        footer={null}
        width={850}
        centered
      >
        <SuiviTache idTache={idTache} closeModal={() => setModalType(null)} fetchData={fetchData} />
      </Modal>

      <Modal
        title="Liste de tracking"
        visible={modalType === 'listeTracking'}
        onCancel={closeAllModals}
        footer={null}
        width={850}
        centered
      >
        <ListeTracking idTache={idTache} />
      </Modal>
    </>
  );
};

export default Taches;
