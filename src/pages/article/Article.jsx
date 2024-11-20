import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, notification, Space, Tooltip, Popconfirm, Tag } from 'antd';
import { FileExcelOutlined, TagOutlined, FileTextOutlined,PlusCircleOutlined,PrinterOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/fr';
import ArticleForm from './articleForm/ArticleForm';
import { getArticle } from '../../services/typeService';
import FormArticleExcel from './formArticleExcel/FormArticleExcel';
import { estSupprimeArticle } from '../../services/offreService';
moment.locale('fr');

const { Search } = Input;

const Article = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [idOffre, setIdOffre] = useState('');
  const scroll = { x: 400 };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });


  const closeAllModals = () => {
    setModalType(null);
  };

  const handlExcelImport = () => {
    openModal('excelImport');
  };

  const openModal = (type, idOffre = '') => {
    closeAllModals();
    setIdOffre(idOffre);
    setModalType(type);
  };

  const handleAjouterOffre  = (idOffre) => {
    openModal('ArticleForm', idOffre);
  };

  const handleSupprimer = async (id) => {
    try {
       await estSupprimeArticle(id);
      setData(data.filter((item) => item.id_article !== id));
      message.success('Article supprimée avec succès');
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

  useEffect(() => {
    fetchData();
  }, []);


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
      width: "5%" 
    },
    { 
      title: 'Nom', 
      dataIndex: 'nom_article', 
      key: 'nom_article',
      render: text => (
        <Space>
          <Tag icon={<FileTextOutlined />} color='green'>{text}</Tag>
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
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ?"
              onConfirm={() => handleSupprimer(record.id_article)}
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
    item.nom_article?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase())
  );

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
              <Search 
                onChange={(e) => setSearchValue(e.target.value)} 
                placeholder="Recherche..." 
                enterButton
               />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAjouterOffre}
              >
                Article
              </Button>
              <Button
                    className="button-excel"
                    icon={<FileExcelOutlined />}
                    onClick={handlExcelImport}
               >
                    Exporter vers Excel
              </Button>
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
            rowKey="id_article"
            loading={loading}
            scroll={scroll}
            size="small"
            bordered
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
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
        <ArticleForm idOffre={''} closeModal={()=> setModalType(null)} fetchData={fetchData}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'excelImport'}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        centered
      >
        <FormArticleExcel/>
      </Modal>
    </>
  );
};

export default Article;
