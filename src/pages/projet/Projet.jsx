import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Form, Popover } from 'antd';
import { ExportOutlined,MoreOutlined, CalendarOutlined, BarsOutlined,CheckSquareOutlined,SolutionOutlined,RocketOutlined,HourglassOutlined,WarningOutlined,CheckCircleOutlined,ClockCircleOutlined,InfoCircleOutlined, FileTextOutlined, DollarOutlined,PlusCircleOutlined,UserOutlined, PrinterOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/fr';
import ProjetForm from './projetForm/ProjetForm';
import { deletePutProjet, getProjet } from '../../services/projetService';
import TacheForm from '../taches/tacheform/TacheForm';
import { Link } from 'react-router-dom';
import BudgetForm from '../budget/budgetForm/BudgetForm';
import ProjetBesoin from './projetBesoin/ProjetBesoin';
import ProjetBesoinLimit from './projetBesoin/projetBesoinLimit/ProjetBesoinLimit';
import DetailProjetsGlobal from './detailProjet/DetailProjetsGlobal';
import ListeTacheProjet1 from './listeTacheProjet/ListeTacheProjet1';
import ProjetDoc from './projetDoc/ProjetDoc';
import ProjetDocForm from './projetDoc/ProjetDocForm';
import { useSelector } from 'react-redux';
moment.locale('fr');

const { Search } = Input;

const Projet = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isBudgetVisible, setIsBudgetVisible] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [idProjet, setIdProjet] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [form] = Form.useForm();
  const scroll = { x: 400 };
  const role = useSelector((state) => state.user?.currentUser?.role);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const handleEdit = (id) => {
    openModal('edit', id)
  };

  const handleListeTache = (id) => {
    openModal('list_tache', id)
  };

  const handleViewDetails = (id) => {
    openModal('Detail', id)
  };

  const handleAddBesoin = (id) => {
    openModal('Add_besoin', id)
  };

  const handleAddBesoinLimit = (id) => {
    setIdProjet(id)
    setIsUpdateVisible(true)
  };

  const handleAddTache = (id) => {
    openModal('AddTache', id)
  };

  const handleAddBudget = (id) => {
   openModal('AddBudget', id)
  };

  const handleAddClient = () => {
    openModal('AddProjet')
    form.resetFields(); 
  };

  const handleDetailDoc = (id) => {
    openModal('ListeDoc', id);
  };

  const handleAjouterDoc = (id) => {
    openModal('DocumentProjetForm', id);
  };

  const closeAllModals = () => {
    setModalType(null);
    form.resetFields();
  };
  
  const openModal = (type, idProjet = '') => {
    closeAllModals();
    setModalType(type);
    setIdProjet(idProjet);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsBudgetVisible(false);
    setIsUpdateVisible(false)
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
        const { data } = await getProjet(role, userId);
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

    const columnStyles = {
      title: {
        maxWidth: '220px',
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

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: "4%"
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
      render: (text, record) => (
        <Space style={columnStyles.title} className={columnStyles.hideScroll}>
          <Tag onClick={() => handleViewDetails(record.id_projet)} icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
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
      title: 'Date création',
      dataIndex: 'date_creation',
      key: 'date_creation',
        sorter: (a, b) => moment(a.date_creation) - moment(b.date_creation),
        sortDirections: ['descend', 'ascend'],
        render: (text,record) => 
          <Tag icon={<CalendarOutlined />} color="blue">
            {moment( text).format('DD-MM-yyyy')}
          </Tag>,
    
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        
          <Space>
            <Tooltip title="Voir détails">
              <Button
                disabled={ role == 'Admin' ? false : record.can_view === 0}
                icon={<EyeOutlined />}
                onClick={() => handleViewDetails(record.id_projet)}
                aria-label="View budget details"
                style={{ color: 'blue' }}
            />
            </Tooltip>
            <Popover
              content={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link onClick={() => handleListeTache(record.id_projet)} >
                    <FileTextOutlined /> Liste de tâche
                  </Link>
                  <Link onClick={() => handleAddTache(record.id_projet)} >
                    <FileTextOutlined /> Créer une tâche
                  </Link>
                  <Link onClick={() => handleAddBudget(record.id_projet)} >
                    <DollarOutlined /> Créer un budget
                  </Link>
                  <Link onClick={() => handleDetailDoc(record.id_projet)} >
                    <FileTextOutlined /> Liste des docs
                  </Link>
                  <Link onClick={() => handleAjouterDoc(record.id_projet)} >
                    <FileTextOutlined /> Ajouter un doc
                  </Link>
                  <Link onClick={() => handleAddBesoin(record.id_projet)} >
                    <SolutionOutlined /> Ajouter besoins
                  </Link>
                  <Link onClick={() => handleAddBesoinLimit(record.id_projet)} >
                    <SolutionOutlined /> Limiter besoins
                  </Link>
                </div>
              }
              title=""
              trigger="click"
            >
              <Tooltip title="Menu">
                <Button
                  icon={<MoreOutlined />}
                  style={{ color: 'black' }}
                  aria-label="Créer une tâche"
                />
              </Tooltip>
            </Popover>

            <Tooltip title="Modifier">
              <Button
                disabled={ role == 'Admin' ? false : record.can_edit === 0}
                icon={<EditOutlined />}
                style={{ color: 'green' }}
                onClick={() => handleEdit(record.id_projet)}
                aria-label="Edit department"
              />
            </Tooltip>

            <Tooltip title="Supprimer">
              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer ce budget ?"
                onConfirm={() => handleDelete(record.id_projet)}
                okText="Oui"
                cancelText="Non"
              >
                <Button
                  disabled={role == 'Admin' ? false : record.can_delete === 0}
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
                icon={<PlusCircleOutlined />}
                onClick={handleAddClient}
              >
                Projet
              </Button>
              <Dropdown overlay={menu} trigger={['click']} className='client-export'>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Dropdown>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                className='client-export'
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
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'AddProjet'}
        onCancel={closeAllModals}
        footer={null}
        width={950}
        centered
      >
        <ProjetForm idProjet={idProjet} fetchData={fetchData} closeModal={()=>setModalType(null)} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'AddTache'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <TacheForm idProjet={idProjet} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'Detail'}
        onCancel={closeAllModals}
        footer={null}
        width={1055}
        centered
      >
        <DetailProjetsGlobal idProjet={idProjet} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'AddBudget'}
        onCancel={closeAllModals}
        footer={null}
        width={1100}
        centered
      >
        <BudgetForm idProjet={idProjet} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'Add_besoin'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <ProjetBesoin idProjet={idProjet} fetchData={fetchData} closeModal={()=>setModalType(null)}/>
      </Modal>

      <Modal
        title=""
        visible={isUpdateVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        <ProjetBesoinLimit idProjet={idProjet} fetchData={fetchData} closeModal={handleCancel}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'list_tache'}
        onCancel={closeAllModals}
        footer={null}
        width={1095}
        centered
      >
        <ListeTacheProjet1 idProjet={idProjet} fetchData={fetchData} closeModal={()=>setModalType(null)}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'DocumentProjetForm'}
        onCancel={closeAllModals}
        footer={null}
        centered
      >
        <ProjetDocForm idProjet={idProjet} fetchData={fetchData} closeModal={()=>setModalType(null)} />
      </Modal>

      <Modal
        title="Liste des documents"
        visible={modalType === 'ListeDoc'}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        centered
      >
        <ProjetDoc idProjet={idProjet} />
      </Modal>
    </>
  );
};

export default Projet;
