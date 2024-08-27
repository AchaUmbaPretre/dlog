import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag } from 'antd';
import { ExportOutlined, DollarOutlined, PlusCircleOutlined, CalendarOutlined, PrinterOutlined, EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '../../config';
import moment from 'moment';
import 'moment/locale/fr';
import FormOffres from './formOffres/FormOffres';
import { getOffre } from '../../services/offreService';
import ArticleForm from './articleForm/ArticleForm';

moment.locale('fr');

const { Search } = Input;

const Offres = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [isFormOffresVisible, setIsFormOffresVisible] = useState(false);
  const [isArticleFormVisible, setIsArticleFormVisible] = useState(false);

  const handleViewDetails = (record) => {
    message.info(`Viewing details of tache: ${record.article}`);
  };

  const handleAddClient = () => {
    // Close other modal if open
    setIsArticleFormVisible(false);
    setIsFormOffresVisible(true);
  };

  const handleAddArticle = () => {
    // Close other modal if open
    setIsFormOffresVisible(false);
    setIsArticleFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormOffresVisible(false);
    setIsArticleFormVisible(false);
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
      <Menu.Item key="1" onClick={handleExportExcel}>
        Exporter vers Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        Exporter au format PDF
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { 
      title: '#', 
      dataIndex: 'id_offre', 
      key: 'id_offre', 
      render: (text, record, index) => index + 1, 
      width: "3%" 
    },
    { 
        title: 'Nom offre', 
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
              onClick={() => handleViewDetails(record)}
              aria-label="View budget details"
            />
          </Tooltip>
          <Tooltip title="Ajoutez des articles">
            <Button
              icon={<PlusCircleOutlined />}
              style={{ color: 'green' }}
              onClick={handleAddArticle}
            />
          </Tooltip>
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
              <DollarOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Offres</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Search offre..." enterButton />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Offre
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
            rowKey="id_budget"
            loading={loading}
          />
        </div>
      </div>

      <Modal
        title="Ajouter Offre"
        visible={isFormOffresVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
        centered
      >
        <FormOffres/>
      </Modal>

      <Modal
        title="Ajouter Article"
        visible={isArticleFormVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        centered
      >
        <ArticleForm/>
      </Modal>
    </>
  );
};

export default Offres;
