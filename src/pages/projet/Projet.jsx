import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Form, Popover } from 'antd';
import { ExportOutlined, BarsOutlined,CheckSquareOutlined,SolutionOutlined,RocketOutlined,HourglassOutlined,WarningOutlined,CheckCircleOutlined,ClockCircleOutlined,InfoCircleOutlined, FileTextOutlined, DollarOutlined,PlusCircleOutlined,UserOutlined, PrinterOutlined, EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/fr';
import ProjetForm from './projetForm/ProjetForm';
import { deletePutProjet, getProjet } from '../../services/projetService';
import TacheForm from '../taches/tacheform/TacheForm';
import DetailProjet from './detailProjet/DetailProjet';
import { Link } from 'react-router-dom';
import BudgetForm from '../budget/budgetForm/BudgetForm';
import ProjetBesoin from './projetBesoin/ProjetBesoin';
moment.locale('fr');

const { Search } = Input;

const Projet = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTacheVisible, setIsTacheVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isBudgetVisible, setIsBudgetVisible] = useState(false);
  const [isBesoinVisible, setIsBesoinVisible] = useState(false);
  const [idProjet, setIdProjet] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [form] = Form.useForm();
  const scroll = { x: 400 };


  const handleEdit = (id) => {
    setIdProjet(id)
    setIsModalVisible(true);
  };

  const handleViewDetails = (id) => {
    message.info(`Affichage des détails de la tache: ${id}`);
    setIsDetailVisible(true)
    setIdProjet(id)
  };

  const handleAddBesoin = (id) => {
    setIdProjet(id)
    setIsBesoinVisible(true);
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
    setIdProjet(''); // Réinitialiser l'ID du projet
    form.resetFields(); // Réinitialiser les champs du formulaire
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields(); // Réinitialiser les champs à la fermeture du modal
    setIsModalVisible(false);
    setIsTacheVisible(false);
    setIsDetailVisible(false);
    setIsBudgetVisible(false);
    setIsBesoinVisible(false)
  };

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting to PDF...');
  };

  const handleDelete = async (id) => {
    try {
       await deletePutProjet(id);
      setData(data.filter((item) => item.id_projet !== id));
      message.success('Projet a été supprimé avec succès');
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

  useEffect(() => {
    fetchData();
  }, []);

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
        <Tag icon={<UserOutlined />} color="green">{text ?? 'Aucun'}</Tag>
      ),
    },
    { 
      title: 'Titre', 
      dataIndex: 'nom_projet', 
      key: 'nom_projet',
      render: text => (
        <Space>
          <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
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
          <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record.id_projet)}
              aria-label="Edit department"
            />
          </Tooltip>
          <Tooltip title="Voir détails">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record.id_projet)}
              aria-label="View budget details"
              style={{ color: 'green' }}
            />
          </Tooltip>
          <Popover
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link onClick={() => handleAddTache(record.id_projet)} >
                  <FileTextOutlined /> Liste de tâche
                </Link>
                <Link onClick={() => handleAddTache(record.id_projet)} >
                  <FileTextOutlined /> Créer une tâche
                </Link>
                <Link onClick={() => handleAddBudget(record.id_projet)} >
                  <DollarOutlined /> Créer un budget
                </Link>
                <Link onClick={() => handleAddBesoin(record.id_projet)} >
                  <SolutionOutlined /> Ajouter besoins
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
                aria-label="Créer une tâche"
              />
            </Tooltip>
          </Popover>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce budget ?"
              onConfirm={() => handleDelete(record.id_projet)}
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

  const filteredData = data.filter(item =>
    item.nom?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_projet?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_type_statut?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.responsable?.toLowerCase().includes(searchValue.toLowerCase())
  );

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
              <Search 
                placeholder="Recherche..." 
                onChange={(e) => setSearchValue(e.target.value)}
                enterButton
              />
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
            dataSource={filteredData}
            rowKey="id_projet"
            loading={loading}
            scroll={scroll}
            size="small"
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
        <ProjetForm idProjet={idProjet} fetchData={fetchData} closeModal={handleCancel} />
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
        width={1020}
        centered
      >
        <BudgetForm idProjet={idProjet} />
      </Modal>

      <Modal
        title="Ajouter un besoin"
        visible={isBesoinVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        <ProjetBesoin idProjet={idProjet} fetchData={fetchData} closeModal={handleCancel}/>
      </Modal>
    </>
  );
};

export default Projet;
