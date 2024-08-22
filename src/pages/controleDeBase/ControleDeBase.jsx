import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, notification, Tag, Space, Tooltip, Popover, Popconfirm, Dropdown, Menu } from 'antd';
import { ExportOutlined, PrinterOutlined, TagOutlined, PlusCircleOutlined, ApartmentOutlined, UserOutlined, CalendarOutlined, CheckCircleOutlined, EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined, FileSearchOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import config from '../../config';
import ControleForm from './controleForm/ControleForm';
import { getControle } from '../../services/controleService';
import SuiviControle from './suiviControle/SuiviControle';
import ListeSuivi from './listeSuivi/ListeSuivi';

const { Search } = Input;

const ControleDeBase = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const scroll = { x: 400 };
  const [data, setData] = useState([]);
  const [idControle, setIdControle] = useState('');
  const [modalState, setModalState] = useState(null);

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

  const closeModal = () => {
    setModalState(null);
  };

  const handleEdit = (record) => {
    message.info(`Editing client: ${record.nom}`);
  };

  const handleDelete = async (id) => {
    try {
      // Uncomment when delete function is available
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

  const handleViewDetails = (record) => {
    message.info(`Viewing details of client: ${record.nom}`);
  };

  const handleAddSuiviList = (id) => {
    openModal('liste', id);
  };

  const handleAddSuivi = () => {
    openModal('suivi');
  };

  const handleAddClient = () => {
    openModal('controle');
  };

  const handleExportExcel = () => {
    message.success('Exportation vers Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exportation vers PDF...');
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
      title: 'Responsable',
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
      width: '20%',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Voir les détails">
            <Button
              icon={<EyeOutlined />}
              style={{ color: 'blue' }}
              onClick={() => handleViewDetails(record)}
              aria-label="Voir les détails du client"
            />
          </Tooltip>
          <Popover
            content={
              <div className='popOverSous' style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link onClick={() => handleAddSuiviList(record.id_control)}>
                  <FileTextOutlined /> Liste de suivi
                </Link>
                <Link onClick={handleAddSuivi}>
                  <FileSearchOutlined /> Faire un suivi
                </Link>
              </div>
            }
            title="Suivi de contrôle"
            trigger="click"
          >
            <Tooltip title="Suivi de contrôle">
              <Button
                icon={<PlusCircleOutlined />}
                style={{ color: 'blue' }}
                aria-label="Suivi de contrôle"
              />
            </Tooltip>
          </Popover>
          <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record)}
              aria-label="Modifier le client"
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
          <div className="client-actions">
            <div className="client-row-left">
              <Search
                placeholder="Recherche..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="client-row-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal('controle')}
              >
                Ajouter un contrôle
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
            pagination={{ pageSize: 15 }}
            loading={loading}
            rowKey="id"
            scroll={scroll}
          />
        </div>
      </div>
      <Modal
        title="Ajouter un contrôle"
        visible={modalState === 'controle'}
        onCancel={closeModal}
        footer={null}
        width={900}
      >
        <ControleForm />
      </Modal>
      <Modal
        title="Suivi du contrôle"
        visible={modalState === 'suivi'}
        onCancel={closeModal}
        footer={null}
        width={900}
      >
        <SuiviControle idControle={idControle} />
      </Modal>
      <Modal
        title="Liste de suivi"
        visible={modalState === 'liste'}
        onCancel={closeModal}
        footer={null}
        width={1000}
      >
        <ListeSuivi />
      </Modal>
    </>
  );
};

export default ControleDeBase;
