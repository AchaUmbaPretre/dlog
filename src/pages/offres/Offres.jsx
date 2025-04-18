import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Popover } from 'antd';
import { ExportOutlined, DollarOutlined,BankOutlined, FileTextOutlined,UserOutlined, FileOutlined, PlusOutlined, PlusCircleOutlined, CalendarOutlined, PrinterOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '../../config';
import moment from 'moment';
import 'moment/locale/fr';
import FormOffres from './formOffres/FormOffres';
import { estSupprimeOffre, getOffre } from '../../services/offreService';
import DetailOffre from './detailOffre/DetailOffre';
import DocumentOffreForm from './documentOffreForm/DocumentOffreForm';
import { Link } from 'react-router-dom';
import ListeDoc from './listeDoc/ListeDoc';

moment.locale('fr');

const { Search } = Input;

const Offres = () => {
  const [searchValue, setSearchValue] = useState('');
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [idOffre, setIdOffre] = useState('');
  const scroll = { x: 400 };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });


  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, idOffre = '') => {
    closeAllModals();
    setIdOffre(idOffre);
    setModalType(type);
  };

  const handleDetailDoc = (idOffre) => {
    openModal('ListeDoc', idOffre);
  };

  const handleVoirDetails = (idOffre) => {
    message.info(`Visualisation des détails de l'offre : ${idOffre}`);
    openModal('DetailOffre', idOffre);
  };

  const handleAjouterDoc = (idOffre) => {
    openModal('DocumentOffreForm', idOffre);
  };

  const handleAjouterOffre = () => {
    openModal('FormOffres');
  };

  const handleAjouterArticle = (idOffre) => {
    openModal('ArticleForm', idOffre);
  };

  const handleExporterExcel = () => {
    message.success('Exportation vers Excel...');
  };

  const handleExporterPDF = () => {
    message.success('Exportation au format PDF...');
  };

  const handleSupprimer = async (id) => {
    console.log(id)
    try {
       await estSupprimeOffre(id);
      setData(data.filter((item) => item.id_offre !== id));
      message.success('Offre supprimée avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression de l\'offre.',
      });
    }
  };

  const handleImprimer = () => {
    window.print();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getOffre();
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
      <Menu.Item key="1" onClick={handleExporterExcel}>
        Exporter vers Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExporterPDF}>
        Exporter au format PDF
      </Menu.Item>
    </Menu>
  );

  const colonnes = [
    { 
      title: '#', 
      dataIndex: 'id_offre', 
      key: 'id_offre', 
      render: (text, record, index) => (
        <Space>
          <Tag color='blue'>{index + 1}</Tag>
        </Space>
      ), 
      width: "8%" 
    },
    { 
      title: 'Titre', 
      dataIndex: 'nom_offre', 
      key: 'nom_offre',
      render: text => (
        <Space>
          <Tag icon={<FileTextOutlined />} color='blue'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Fournisseur', 
      dataIndex: 'nom_fournisseur', 
      key: 'nom_fournisseur',
      render: text => (
        <Space>
          <Tag icon={<UserOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Entité', 
      dataIndex: 'nom_batiment', 
      key: 'nom_batiment',
      render: text => (
        <Space>
          <Tag icon={<BankOutlined />} color='orange'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Date', 
      dataIndex: 'date_creation', 
      key: 'date_creation',
      sorter: (a, b) => moment(a.date_creation).unix() - moment(b.date_creation).unix(), // tri par date
      render: text => (
        <Tag icon={<CalendarOutlined />} color='purple'>{moment(text).format('LL')}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Voir détails">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleVoirDetails(record.id_offre)}
              aria-label="Voir les détails de l'offre"
              style={{color:'green'}}
            />
          </Tooltip>
          <Popover
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link onClick={() => handleDetailDoc(record.id_offre)} >
                  <FileTextOutlined /> Liste des docs
                </Link>
                <Link onClick={() => handleAjouterDoc(record.id_offre)} >
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
{/*           <Tooltip title="Ajouter des articles">
            <Button
              icon={<PlusCircleOutlined />}
              style={{ color: 'blue' }}
              onClick={() => handleAjouterArticle(record.id_offre)}
            />
          </Tooltip> */}
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cette offre ?"
              onConfirm={() => handleSupprimer(record.id_offre)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Supprimer l'offre"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
  

  const filteredData = data.filter(item =>
    item.nom_offre?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_fournisseur?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_batiment?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <DollarOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Offres</h2>
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
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAjouterOffre}
              >
                Ajouter une Offre
              </Button>
              <Dropdown overlay={menu} trigger={['click']} className='client-export'>
                <Button icon={<ExportOutlined />}>Exporter</Button>
              </Dropdown>
              <Button
                icon={<PrinterOutlined />}
                onClick={handleImprimer}
                className='client-export'
              >
                Imprimer
              </Button>
            </div>
          </div>
          <Table
            columns={colonnes}
            dataSource={filteredData}
            onChange={(pagination) => setPagination(pagination)}
            pagination={pagination}
            rowKey="id_offre"
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
        visible={modalType === 'FormOffres'}
        onCancel={closeAllModals}
        footer={null}
        width={750}
        centered
      >
        <FormOffres/>
      </Modal>

{/*       <Modal
        title=""
        visible={modalType === 'ArticleForm'}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        centered
      >
        <ArticleForm idOffre={idOffre}/>
      </Modal> */}

      <Modal
        title=""
        visible={modalType === 'DetailOffre'}
        onCancel={closeAllModals}
        footer={null}
        width={700}
        centered
      >
        <DetailOffre idOffre={idOffre}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'DocumentOffreForm'}
        onCancel={closeAllModals}
        footer={null}
        width={600}
        centered
      >
        <DocumentOffreForm idOffre={idOffre}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'ListeDoc'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <ListeDoc idOffre={idOffre}/>
      </Modal>
    </>
  );
};

export default Offres;
