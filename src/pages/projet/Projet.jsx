import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, InputNumber, Form, Popover } from 'antd';
import { ExportOutlined, BarsOutlined,InfoCircleOutlined, FileTextOutlined, DollarOutlined,PlusCircleOutlined,CalendarOutlined,UserOutlined, PrinterOutlined, EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '../../config';
import moment from 'moment';
import 'moment/locale/fr';
import ProjetForm from './projetForm/ProjetForm';
import { getProjet } from '../../services/projetService';
import TacheForm from '../taches/tacheform/TacheForm';
import DetailProjet from './detailProjet/DetailProjet';
import { Link } from 'react-router-dom';
import BudgetForm from '../budget/budgetForm/BudgetForm';
moment.locale('fr');

const { Search } = Input;

const Projet = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTacheVisible, setIsTacheVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isBudgetVisible, setIsBudgetVisible] = useState(false);
  const [idProjet, setIdProjet] = useState('');
  const [form] = Form.useForm();

  const handleViewDetails = (id) => {
    message.info(`Affichage des détails de la tache: ${id}`);
    setIsDetailVisible(true)
    setIdProjet(id)
  };

  const handleAddTache = (id) => {
    setIdProjet(id)
    setIsTacheVisible(true);
  };

  const handleAddBudget = (id) => {
    setIdProjet(id)
    setIsBudgetVisible(true);
  };

  const handleAddClient = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsTacheVisible(false);
    setIsDetailVisible(false)
    setIsBudgetVisible(false)
  };

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting to PDF...');
  };

  const handleDelete = async (id) => {
    try {
      // Fonction de suppression commentée
      // await deleteClient(id);
      setData(data.filter((item) => item.id_budget !== id));
      message.success('Budget supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du budget.',
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getProjet();
        setData(data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [DOMAIN]);

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

  const handleEdit = (record) => {
    setEditingRow(record.id_budget);
    form.setFieldsValue({ quantite_validee: record.quantite_validee });
  };


  const columns = [
    { 
      title: '#', 
      dataIndex: 'id_budget', 
      key: 'id_budget', 
      render: (text, record, index) => index + 1, 
      width: "3%" 
    },
    {
      title: 'Client',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => (
        <Tag icon={<UserOutlined />} color="blue">{text}</Tag>
      ),
    },
    { 
      title: 'Titre', 
      dataIndex: 'nom_projet', 
      key: 'nom_projet',
      render: text => (
        <Space>
          <Tag color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Chef projet ',
      dataIndex: 'responsable', 
      key: 'responsable',
      render: text => (
        <Tag icon={<UserOutlined />} color='purple'>{text}</Tag>
      ),
    },
    { 
      title: 'Statut', 
      dataIndex: 'nom_type_statut', 
      key: 'nom_type_statut',
      render: (text, record) => (
        <Tag icon={<InfoCircleOutlined />}  color='purple'>{text}</Tag>
      )
    },
    { 
      title: 'Budget', 
      dataIndex: 'montant', 
      key: 'montant',
      render: text => (
        <Space>
          <Tag icon={<DollarOutlined />}  color='purple'>
            {text} $
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space >
          <Tooltip title="Voir détails">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record.id_projet)}
              aria-label="View budget details"
            />
          </Tooltip>
          <Popover
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link onClick={() => handleAddTache(record.id_projet)} >
                  <FileTextOutlined /> Créer une tâche
                </Link>
                <Link onClick={() => handleAddBudget(record.id_projet)} >
                  <DollarOutlined /> Créer un budget
                </Link>
              </div>
            }
            title=""
            trigger="click"
          >
            <Tooltip title="Créer une tâche">
              <Button
                icon={<PlusCircleOutlined />}
                style={{ color: 'blue' }}
                aria-label="Créer une tâche"
              />
            </Tooltip>
          </Popover>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce budget ?"
              onConfirm={() => handleDelete(record.id_budget)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Delete budget"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <BarsOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Projet</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." enterButton />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Ajouter un projet
              </Button>
              <Dropdown overlay={menu} trigger={['click']}>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Dropdown>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id_projet"
            loading={loading}
            bordered
          />
        </div>
      </div>

      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        <ProjetForm/>
      </Modal>

      <Modal
        title=""
        visible={isTacheVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        <TacheForm idProjet={idProjet} />
      </Modal>

      <Modal
        title=""
        visible={isDetailVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        <DetailProjet idProjet={idProjet} />
      </Modal>

      <Modal
        title=""
        visible={isBudgetVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        centered
      >
        <BudgetForm idProjet={idProjet} />
      </Modal>
    </>
  );
};

export default Projet;
