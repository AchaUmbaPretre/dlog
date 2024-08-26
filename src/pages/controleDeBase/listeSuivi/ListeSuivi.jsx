import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Dropdown, Menu, notification, Tag, Space, Tooltip,Popconfirm, Modal } from 'antd';
import { ExportOutlined, PrinterOutlined,PlusCircleOutlined ,ClockCircleOutlined,HourglassOutlined,WarningOutlined,CheckSquareOutlined,DollarOutlined,RocketOutlined, ApartmentOutlined, UserOutlined, CalendarOutlined, CheckCircleOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getTacheControleOne } from '../../../services/tacheService';
import SuiviTache from '../../taches/suiviTache/SuiviTache';
import { getSuiviTacheOne } from '../../../services/suiviService';

const { Search } = Input;

const ListeSuivi = ({idControle}) => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [idTache, setIdTache] = useState('');
  const [modalState, setModalState] = useState(null);
  const [suivi, setSuivi] = useState('')

  const statusIcons = {
    'En attente': { icon: <ClockCircleOutlined />, color: 'orange' },
    'En cours': { icon: <HourglassOutlined />, color: 'blue' },
    'Point bloquant': { icon: <WarningOutlined />, color: 'red' },
    'En attente de validation': { icon: <CheckSquareOutlined />, color: 'purple' },
    'Validé': { icon: <CheckCircleOutlined />, color: 'green' },
    'Budget': { icon: <DollarOutlined />, color: 'gold' },
    'Executé': { icon: <RocketOutlined />, color: 'cyan' },
};

  const closeModal = () => setModalState(null);

  const handleAddSuivi = (id) => openModal('suivi', id);

  const openModal = (modalType, id = '') => {
    setIdTache(id);
    setModalState(modalType);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTacheControleOne(idControle);
        setData(response.data);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idControle]);

  useEffect(() => {
    const fetchSuivi = async () => {
      try {
        const response = await getSuiviTacheOne(idControle);
        setSuivi(response.data);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuivi();
  }, [idControle]);

  const handleDelete = async (id) => {
    try {
      // Uncomment when delete function is available
      // await deleteClient(id);
      setData(data.filter((item) => item.id !== id));
      message.success('Client deleted successfully');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

  const handleViewDetails = (record) => {
    message.info(`Viewing details of client: ${record.nom}`);
  };


  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting to PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        <ExportOutlined /> Exporter vers Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        <PrinterOutlined /> Exporter vers PDF
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "5%",
      align: 'center',
    },
    {
      title: 'Département',
      dataIndex: 'departement',
      key: 'departement',
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Nom',
      dataIndex: 'nom_tache',
      key: 'nom',
      render: text => (
        <Space>
          <Tag icon={<UserOutlined />} color='green'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: text => (
        <Space>
          <Tag icon={<UserOutlined />} color='green'>{text}</Tag>
        </Space>
      ),
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
      title: 'Frequence', 
      dataIndex: 'frequence', 
      key: 'frequence',
      render: text => (
          <Space>
            <Tag icon={<CalendarOutlined />} color='blue'>{text}</Tag>
          </Space>
      )
    },
    {
      title: 'Date debut',
      dataIndex: 'date_debut',
      key: 'date_debut',
      sorter: (a, b) => moment(a.date_debut) - moment(b.date_debut),
      sortDirections: ['descend', 'ascend'],
      render: (text) => 
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')}
        </Tag>
    },
    {
      title: 'Date fin',
      dataIndex: 'date_fin',
      key: 'date_fin',
      sorter: (a, b) => moment(a.date_fin) - moment(b.date_fin),
      sortDirections: ['descend', 'ascend'],
      render: (text) => 
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')}
        </Tag>
    },
    {
      title: 'Nbre jour',
      dataIndex: 'nbre_jour',
      key: 'nbre_jour',
      sorter: (a, b) => moment(a.nbre_jour) - moment(b.nbre_jour),
      sortDirections: ['descend', 'ascend'],
      render: (text) => 
        <Tag icon={<CalendarOutlined />} color="blue">
          {text}
        </Tag>
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Faire un suivi">
            <Button
              icon={<PlusCircleOutlined />}
              style={{ color: 'blue' }}
              onClick={() => handleAddSuivi(record.id_tache)}
              aria-label="Faire un suivi"
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce client ?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Supprimer le client"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredData = data?.filter((item) =>
    item.description?.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Liste des tâches </h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search
                placeholder="Recherche..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="client-rows-right">
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
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        visible={modalState === 'suivi'}
        title="Faire un suivi de tâche"
        footer={null}
        onCancel={closeModal}
        destroyOnClose
        width={800}
      >
        <SuiviTache idTache={idTache} closeModal={closeModal} />
      </Modal>
    </>
  );
};

export default ListeSuivi;
