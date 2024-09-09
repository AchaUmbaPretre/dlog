import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Dropdown, Menu, notification, Tag, Space, Tooltip, Popconfirm, Modal, Collapse } from 'antd';
import { ExportOutlined, PrinterOutlined,PlusCircleOutlined, ClockCircleOutlined, HourglassOutlined, WarningOutlined, CheckSquareOutlined, DollarOutlined, RocketOutlined, ApartmentOutlined, UserOutlined, CalendarOutlined, CheckCircleOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import { deletePutTache, getTacheControleOne } from '../../../services/tacheService';
import SuiviTache from '../../taches/suiviTache/SuiviTache';
import { getSuiviTacheOne } from '../../../services/suiviService';

const { Search } = Input;
const { Panel } = Collapse;

const ListeSuivi = ({ idControle }) => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [idTache, setIdTache] = useState('');
  const [modalState, setModalState] = useState(null);
  const [suivi, setSuivi] = useState([]);
  const scroll = { x: 400 };
  
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
        const response = await getSuiviTacheOne();
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
  }, []);

  const handleDelete = async (id) => {
    try {
       await deletePutTache(id);
      setData(data.filter((item) => item.id_tache !== id));
      message.success('La tache a été supprimée avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression de tache.',
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
          <Tooltip title="Contrôler">
            <Button
              icon={<PlusCircleOutlined />}
              style={{ color: 'blue' }}
              onClick={() => handleAddSuivi(record.id_tache)}
              aria-label="Faire un suivi"
            />
          </Tooltip>
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

  const renderSuivi = (idTache) => {
    const suiviData = suivi.filter(item => item.id_tache === idTache);
    console.log('Suivi pour idTache', idTache, ':', suiviData)
    return (
      <Collapse accordion>
  {suiviData.length ? (
    suiviData.map((item) => (
      <Panel header={`Suivi du #${moment(item.date_suivi).format('DD-MM-yyyy')} description : ${item.commentaire} Pourcentage : ${item.pourcentage_avancement}% Statut : ${item.nom_type_statut}`} key={item.id_suivi}>
        <p><strong>Description :</strong>  {item.commentaire}</p>
        <p><strong>Pourcentage d'avancement :</strong>  {item.pourcentage_avancement}%</p>
        <p><strong>Terminé :</strong>  {item.est_termine}</p>
        <p><strong>Statut :</strong>  {item.nom_type_statut}</p>
      </Panel>
    ))
  ) : (
    <p>Aucun suivi disponible pour cette tâche.</p>
  )}
</Collapse>

    );
  };

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
        rowKey="id_tache"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => renderSuivi(record.id_tache),
          rowExpandable: record => record.id_tache !== null,
        }}
        scroll={scroll}
      />
        </div>
      </div>

      {modalState && idTache && (
        <Modal
          title={modalState === 'suivi' ? 'Ajouter un suivi' : ''}
          visible={true}
          onCancel={closeModal}
          footer={null}
          width={800}
        >
          {modalState === 'suivi' && (
            <SuiviTache idTache={idTache} />
          )} 
        </Modal>
      )}
    </>
  );
};

export default ListeSuivi;
