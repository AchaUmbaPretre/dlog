import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Popover } from 'antd';
import { ExportOutlined, DollarOutlined,FileTextOutlined, FileOutlined, PlusOutlined, PlusCircleOutlined, CalendarOutlined, PrinterOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '../../config';
import moment from 'moment';
import 'moment/locale/fr';
import FormOffres from './formOffres/FormOffres';
import { getOffre } from '../../services/offreService';
import ArticleForm from './articleForm/ArticleForm';
import DetailOffre from './detailOffre/DetailOffre';
import DocumentOffreForm from './documentOffreForm/DocumentOffreForm';
import { Link } from 'react-router-dom';
import ListeDoc from './listeDoc/ListeDoc';

moment.locale('fr');

const { Search } = Input;

const Offres = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isFormOffresVisible, setIsFormOffresVisible] = useState(false);
  const [isArticleFormVisible, setIsArticleFormVisible] = useState(false);
  const [isDetailFormVisible, setIsDetailFormVisible] = useState(false);
  const [isDocFormVisible, setIsDocFormVisible] = useState(false);
  const [isListeDocVisible, setIsListeDocVisible] = useState(false);
  const [idOffre, setIdOffre] = useState('');


  const handleDetailDoc = (idOffre) => {
    setIdOffre(idOffre);
    setIsListeDocVisible(true);
    setIsFormOffresVisible(false);
  };

  const handleVoirDetails = (idOffre) => {
    message.info(`Visualisation des détails de l'offre : ${idOffre}`);
    setIdOffre(idOffre);
    setIsDetailFormVisible(true);
    setIsFormOffresVisible(false);
  };

  const handleAjouterDoc = (idOffre) => {
    setIsArticleFormVisible(false);
    setIsDocFormVisible(true);
    setIdOffre(idOffre);
  };

  const handleAjouterOffre = () => {
    setIsArticleFormVisible(false);
    setIsFormOffresVisible(true);
  };

  const handleAjouterArticle = (idOffre) => {
    setIdOffre(idOffre);
    setIsFormOffresVisible(false);
    setIsArticleFormVisible(true);
  };

  const handleAnnuler = () => {
    setIsDetailFormVisible(false);
    setIsFormOffresVisible(false);
    setIsArticleFormVisible(false);
    setIsDocFormVisible(false);
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
      render: (text, record, index) => index + 1, 
      width: "3%" 
    },
    { 
      title: 'Nom de l\'offre', 
      dataIndex: 'nom_offre', 
      key: 'nom_offre',
      render: text => (
        <Space>
          <Tag color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Fournisseur', 
      dataIndex: 'nom_fournisseur', 
      key: 'nom_fournisseur',
      render: text => (
        <Space>
          <Tag color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Date', 
      dataIndex: 'date_creation', 
      key: 'date_creation',
      render: text => (
        <Tag icon={<CalendarOutlined />}  color='purple'>{moment(text).format('LL')}</Tag>
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
                />
            </Tooltip>
            <Popover
                content={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link onClick={()=> handleDetailDoc(record.id_offre)} >
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
                <Tooltip title="Doc">
                    <Button
                        icon={<FileOutlined />}
                        style={{ color: 'green' }}
                        aria-label="Doc"
                    />
                </Tooltip>
            </Popover>
          <Tooltip title="Ajouter des articles">
            <Button
              icon={<PlusCircleOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleAjouterArticle(record.id_offre)}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cette offre ?"
              onConfirm={() => handleSupprimer(record.id_budget)}
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
              <DollarOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Offres</h2>
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
                Offre
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
          />
        </div>
      </div>

      <Modal
        title="Ajouter une Offre"
        visible={isFormOffresVisible}
        onCancel={handleAnnuler}
        footer={null}
        width={700}
        centered
      >
        <FormOffres/>
      </Modal>

      <Modal
        title=""
        visible={isArticleFormVisible}
        onCancel={handleAnnuler}
        footer={null}
        width={900}
        centered
      >
        <ArticleForm idOffre={idOffre}/>
      </Modal>

      <Modal
        title="Détails de l'Offre"
        visible={isDetailFormVisible}
        onCancel={handleAnnuler}
        footer={null}
        width={700}
        centered
      >
        <DetailOffre idOffre={idOffre}/>
      </Modal>

      <Modal
        title=""
        visible={isDocFormVisible}
        onCancel={handleAnnuler}
        footer={null}
        width={600}
        centered
      >
        <DocumentOffreForm idOffre={idOffre}/>
      </Modal>

      <Modal
        title=""
        visible={isListeDocVisible}
        onCancel={handleAnnuler}
        footer={null}
        width={1000}
        centered
      >
        <ListeDoc idOffre={idOffre}/>
      </Modal>
    </>
  );
};

export default Offres;
