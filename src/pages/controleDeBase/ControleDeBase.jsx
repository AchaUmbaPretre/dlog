import { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Input, message, notification, Tag, Space, Tooltip,
  Popover, Popconfirm, Dropdown, Menu, Tabs
} from 'antd';
import {
  ExportOutlined, PrinterOutlined, TagOutlined, PlusCircleOutlined,
  ApartmentOutlined,EditOutlined, UserOutlined, CalendarOutlined, CheckCircleOutlined,DeleteOutlined, FileSearchOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ControleForm from './controleForm/ControleForm';
import { deletePutControle, getControle } from '../../services/controleService';
import SuiviControle from './suiviControle/SuiviControle';
import ListeSuivi from './listeSuivi/ListeSuivi';
import TacheForm from '../taches/tacheform/TacheForm';
import ListeControler from './listeControler/ListeControler';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import { getSubMenuAccessByUrl } from '../../utils/tacheGroup';
import { useSelector } from 'react-redux';
import Frequence from '../frequence/Frequence';
import Format from '../format/Format';

const { Search } = Input;

const ControleDeBase = ({datas}) => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [idControle, setIdControle] = useState('');
  const [modalState, setModalState] = useState(null);
  const scroll = { x: 400 };
  const currentUrl = window.location.pathname;
  const role = useSelector((state) => state.user?.currentUser.role);


  const access = getSubMenuAccessByUrl(currentUrl, datas);
  
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

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (modalType, id = '') => {
    setIdControle(id);
    setModalState(modalType);
  };

  const closeModal = () => setModalState(null);

  const handleDelete = async (id) => {
    try {
         await deletePutControle(id);
      setData(data.filter((item) => item.id_controle !== id));
      message.success('Controle de base a été supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression de controle de base.',
      });
    }
  };

  const handleViewDetails = (id) => openModal('controle', id)

  const handleAddSuiviList = (id) => openModal('liste', id);

  const handleAddSuiviListControler = (id) => openModal('listeControler', id);

  const handleAddCreerTache = (id) => openModal('creer', id);

  const handleAddSuivi = (id) => openModal('suivi', id);

  const handleAddClient = () => openModal('controle');

  const handleExportExcel = () => {
    const dataToExport = filteredData.map(({ id_control, ...rest }) => rest);
      const ws = XLSX.utils.json_to_sheet(dataToExport);
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
    XLSX.writeFile(wb, "data.xlsx");
    message.success('Exportation vers Excel réussie.');
  };

  const handleExportPDF = () => {
    const element = document.getElementById('printableTable');
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'data.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

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

  const groupByControle = (data) => {
    const grouped = data.reduce((acc, current) => {
      const { id_controle, departement, nom_client, format, controle_de_base, frequence, responsable } = current;

      if (!acc[id_controle]) {
        acc[id_controle] = {
          id_controle,
          departement,
          nom_client,
          format,
          controle_de_base,
          frequence,
          responsables: new Set(),
          items: []
        };
      }
      acc[id_controle].responsables.add(responsable);
      acc[id_controle].items.push(current);
      return acc;
    }, {});

    return Object.values(grouped).map(group => ({
      ...group,
      responsables: Array.from(group.responsables).join(', '), // Convertir le Set en chaîne de caractères
      nom_client: group.items.length > 1 ? "ALL" : group.nom_client // Afficher "ALL" si plusieurs entrées
    }));
  };

  const groupedData = groupByControle(data);

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
      title: 'DPT',
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
        <Space style={columnStyles.title} className={columnStyles.hideScroll}>
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
      dataIndex: 'responsables',
      key: 'responsables',
      render: text => {
        if (!text) {
          return null; 
        }
    
        return (
          <Space>
            {text.split(', ').map((name, index) => (
              <Tag icon={<UserOutlined />} color='purple' key={index}>{name}</Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
           <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              disabled={role !== 'Admin' && access?.can_edit === 0}
              style={{ color: 'green' }}
              onClick={() => handleViewDetails(record.id_controle)}
              aria-label=""
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
                  <FileTextOutlined /> Liste des tracking
                </Link>
                <Link onClick={() => handleAddSuivi(record.id_controle)}>
                  <FileSearchOutlined /> Tracking
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
                disabled={ role !== 'Admin' && access?.can_comment === 0}
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
                disabled={role !== 'Admin' && access?.can_delete === 0}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredData = groupedData.filter(item =>
    item.departement?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.format?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.controle_de_base?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.responsables?.toLowerCase().includes(searchValue.toLowerCase())  // Utilisez 'responsables' ici
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
          <Tabs 
            defaultActiveKey="0"
            type="card"
            tabPosition="top"
          >
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
                    icon={<PlusCircleOutlined />}
                    onClick={handleAddClient}
                    disabled={role !== 'Admin' && access?.can_comment === 0}
                  >
                    Contrôle de base
                  </Button>

                  <Dropdown overlay={exportMenu} trigger={['click']} className='client-export'>
                    <Button icon={<ExportOutlined />} >Exporter</Button>
                  </Dropdown>
                  <Button
                    icon={<PrinterOutlined />}
                    onClick={handlePrint}
                    className='client-export'
                  >
                    Imprimer
                  </Button>
                </div>
              </div>
              <div className="tableau_client" id="printableTable">
              <Table
                  columns={columns}
                  dataSource={filteredData}
                  loading={loading}
                  rowKey="id_controle"
                  pagination={{ defaultPageSize: 15 }}
                  expandable={{
                    expandedRowRender: (record) => (
                      record.items.length > 1 ? (
                        <Table
                          columns={columns}
                          dataSource={record.items}
                          rowKey={(record, index) => `${record.id_controle}-${index}`}
                          showHeader={false}
                          size="small"
                          scroll={{scroll}}
                        />
                      ) : null
                    ),
                    rowExpandable: (record) => record.items.length > 1, // Activer l'expansion seulement si items.length > 1
                  }}
                  bordered
                  size="small"
                  rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab='Fréquence' key="1">
              <Frequence />
            </Tabs.TabPane>

            <Tabs.TabPane tab='Format' key="2">
              <Format />
            </Tabs.TabPane>

          </Tabs>
        </div>
      </div>
      <Modal
        visible={modalState === 'controle'}
        title=""
        footer={null}
        onCancel={closeModal}
        destroyOnClose
        width={850}
      >
        <ControleForm idControle={idControle} fetchData={fetchData} closeModal={closeModal} />
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
        title="Tracking de controle de base"
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
        title=""
        footer={null}
        onCancel={closeModal}
        destroyOnClose
        width={900}
        centered
      >
        <TacheForm idControle={idControle} closeModal={closeModal} fetchData={fetchData}/>
      </Modal>
    </>
  );
};

export default ControleDeBase;
