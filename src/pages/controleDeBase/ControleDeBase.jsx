import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Input, message, notification, Tag, Space, Tooltip,
  Popover, Popconfirm, Dropdown, Menu, Tabs
} from 'antd';
import {
  ExportOutlined, PrinterOutlined, TagOutlined, PlusCircleOutlined,
  ApartmentOutlined,EyeOutlined, UserOutlined, CalendarOutlined, CheckCircleOutlined,
  PlusOutlined,DeleteOutlined, FileSearchOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import config from '../../config';
import ControleForm from './controleForm/ControleForm';
import { getControle } from '../../services/controleService';
import SuiviControle from './suiviControle/SuiviControle';
import ListeSuivi from './listeSuivi/ListeSuivi';
import TacheForm from '../taches/tacheform/TacheForm';
import ListeControler from './listeControler/ListeControler';

const { Search } = Input;

const ControleDeBase = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [idControle, setIdControle] = useState('');
  const [modalState, setModalState] = useState(null);
  const scroll = { x: 400 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getControle();
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
  }, [DOMAIN]);

  const openModal = (modalType, id = '') => {
    setIdControle(id);
    setModalState(modalType);
  };

  const closeModal = () => setModalState(null);

  const handleDelete = async (id) => {
    try {
      // Fonction de suppression commentée
      // await deleteClient(id);
      setData(data.filter((item) => item.id !== id));
      message.success('Client supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

  const handleViewDetails = (id) => openModal('controle', id)

  const handleAddSuiviList = (id) => openModal('liste', id);

  const handleAddSuiviListControler = (id) => openModal('listeControler', id);

  const handleAddCreerTache = (id) => openModal('creer', id);

  const handleAddSuivi = (id) => openModal('suivi', id);

  const handleAddClient = () => openModal('controle');

  const handleExportExcel = () => message.success('Exportation vers Excel...');

  const handleExportPDF = () => message.success('Exportation vers PDF...');

  const handlePrint = () => window.print();

  const exportMenu = (
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
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      render: text => (
        <Space>
          <Tag icon={<TagOutlined />} color='blue'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Contrôle de base',
      dataIndex: 'controle_de_base',
      key: 'controle_de_base',
      render: text => (
        <Space>
          <Tag icon={<CheckCircleOutlined />} color='orange'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Fréquence',
      dataIndex: 'frequence',
      key: 'frequence',
      render: text => (
        <Tag color='blue'>
          <CalendarOutlined /> {text}
        </Tag>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'responsable',
      key: 'responsable',
      render: text => (
        <Space>
          <Tag icon={<UserOutlined />} color='purple'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
           <Tooltip title="Voir les détails">
            <Button
              icon={<EyeOutlined />}
              style={{ color: 'blue' }}
              onClick={() => handleViewDetails(record.id_controle)}
              aria-label="Voir les détails du client"
            />
          </Tooltip>
          <Popover
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link onClick={() => handleAddSuiviList(record?.id_controle)} >
                  <FileTextOutlined /> Liste des Tâches
                </Link>
                <Link onClick={() => handleAddCreerTache(record?.id_controle)} >
                  <FileTextOutlined /> Créer une Tâche
                </Link>
                <Link onClick={() => handleAddSuiviListControler(record?.id_controle)}>
                  <FileTextOutlined /> Liste des controles
                </Link>
                <Link onClick={() => handleAddSuivi(record.id_controle)}>
                  <FileSearchOutlined /> Contrôler
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
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce client ?"
              onConfirm={() => handleDelete(record.id_controle)}
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

  const filteredData = data.filter(item =>
    item.departement?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.format?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.controle_de_base?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.responsable?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <CheckCircleOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Contrôle de base</h2>
          </div>
          <Tabs defaultActiveKey="0">
            <Tabs.TabPane tab='Liste de contrôle de base' key="0">
              <div className="client-actions">
                <div className="client-row-left">
                  <Search
                    placeholder="Recherche..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    enterButton
                  />
                </div>
                <div className="client-row-right" style={{display:'flex', gap:'10px'}}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddClient}
                  >
                    Ajouter contrôle de base
                  </Button>
                  <Dropdown overlay={exportMenu} trigger={['click']}>
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
              <div className="tableau_client">
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  loading={loading}
                  rowKey="id_controle"
                  pagination={{ defaultPageSize: 15 }}
                  scroll={scroll}
                  className='tableau_x'
                  style={{ fontSize: '12px' }}
                  bordered
                  size="small"
                />
              </div>
            </Tabs.TabPane>
{/*              <Tabs.TabPane tab='Vue calendrier' key="1">
              <ControleBigCalendar data={data} />
            </Tabs.TabPane> */}
          </Tabs>
        </div>
      </div>
      <Modal
        visible={modalState === 'controle'}
        title="Ajouter un contrôle"
        footer={null}
        onCancel={closeModal}
        destroyOnClose
        width={850}
      >
        <ControleForm idControle={idControle} closeModal={closeModal} />
      </Modal>
      <Modal
        visible={modalState === 'liste'}
        title="Liste des tâches"
        footer={null}
        onCancel={closeModal}
        destroyOnClose
        width={1050}
        centered
      >
        <ListeSuivi idControle={idControle} closeModal={closeModal} />
      </Modal>

      <Modal
        visible={modalState === 'listeControler'}
        title="Liste des controles"
        footer={null}
        onCancel={closeModal}
        destroyOnClose
        width={800}
        centered
      >
        <ListeControler idControle={idControle} closeModal={closeModal} />
      </Modal>

      <Modal
        visible={modalState === 'suivi'}
        title="Créer un suivi de controle de base"
        footer={null}
        onCancel={closeModal}
        destroyOnClose
        width={900}
        centered
      >
        <SuiviControle idControle={idControle} closeModal={closeModal} />
      </Modal>

      <Modal
        visible={modalState === 'creer'}
        title="Créer une tâche"
        footer={null}
        onCancel={closeModal}
        destroyOnClose
        width={1050}
        centered
      >
        <TacheForm idControle={idControle} closeModal={closeModal} />
      </Modal>
    </>
  );
};

export default ControleDeBase;
