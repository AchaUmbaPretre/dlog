import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Popover } from 'antd';
import { ExportOutlined, TagOutlined, FileTextOutlined,UserOutlined, FileOutlined, PlusOutlined, PlusCircleOutlined, CalendarOutlined, PrinterOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '../../config';
import moment from 'moment';
import 'moment/locale/fr';
import ArticleForm from '../offres/articleForm/ArticleForm';
import { getArticle } from '../../services/typeService';

moment.locale('fr');

const { Search } = Input;

const Article = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [idOffre, setIdOffre] = useState('');

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


  const handleAjouterOffre  = (idOffre) => {
    openModal('ArticleForm', idOffre);
  };

  const handleExporterExcel = () => {
    message.success('Exportation vers Excel...');
  };

  const handleExporterPDF = () => {
    message.success('Exportation au format PDF...');
  };

  const handleSupprimer = async (id) => {
    try {
      // Fonction de suppression commentée
      // await deleteOffre(id);
      setData(data.filter((item) => item.id_budget !== id));
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
        const { data } = await getArticle();
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
      title: 'Nom', 
      dataIndex: 'nom_article', 
      key: 'nom_article',
      render: text => (
        <Space>
          <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Categorie', 
      dataIndex: 'nom_cat', 
      key: 'nom_cat',
      render: text => (
        <Space>
          <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
        </Space>
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
              style={{ color: 'green' }}
              onClick={() => handleVoirDetails(record.id_article)}
              aria-label="Voir les détails de l'offre"
            />
          </Tooltip>
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

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <TagOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Articles</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Rechercher une offre..." enterButton />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAjouterOffre}
              >
                Ajouter article
              </Button>
              <Dropdown overlay={menu} trigger={['click']}>
                <Button icon={<ExportOutlined />}>Exporter</Button>
              </Dropdown>
              <Button
                icon={<PrinterOutlined />}
                onClick={handleImprimer}
              >
                Imprimer
              </Button>
            </div>
          </div>
          <Table
            columns={colonnes}
            dataSource={data}
            rowKey="id_budget"
            loading={loading}
            bordered
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'ArticleForm'}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        centered
      >
        <ArticleForm/>
      </Modal>
    </>
  );
};

export default Article;
