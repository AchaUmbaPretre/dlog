import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Tag, Select } from 'antd';
import { ExportOutlined, ShoppingOutlined, DollarOutlined, UserOutlined, PrinterOutlined, PlusOutlined } from '@ant-design/icons';
import { getOffreArticle } from '../../services/offreService';

const { Search } = Input;
const { Option } = Select;

const ListePrix = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Nouveau état pour données filtrées
  const [selectedArticle, setSelectedArticle] = useState(null); // État pour l'article sélectionné
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getOffreArticle();
        setData(data);
        setFilteredData(data); // Initialement, les données filtrées sont les mêmes que les données complètes
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
  }, []);

  // Fonction pour gérer la sélection d'un article
  const handleArticleFilter = (value) => {
    setSelectedArticle(value);
    if (value) {
      const filtered = data.filter(item => item.nom_article === value);
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Réinitialiser si aucun filtre n'est sélectionné
    }
  };

  const handleAddClient = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting to PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async (id) => {
    try {
      // Uncomment when delete function is available
      // await deleteClient(id);
      setData(data.filter((item) => item.id !== id));
      message.success('Client deleted successfully');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        <Tag icon={<ExportOutlined />} color="green">Export to Excel</Tag>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        <Tag icon={<ExportOutlined />} color="blue">Export to PDF</Tag>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
    },
    {
      title: 'Nom',
      dataIndex: 'nom_fournisseur',
      key: 'nom',
      render: (text) => (
        <Tag icon={<UserOutlined />} color="green">{text}</Tag>
      ),
    },
    {
      title: 'Article',
      dataIndex: 'nom_article',
      key: 'article',
      render: (text) => (
        <Tag icon={<ShoppingOutlined />} color="purple">{text}</Tag>
      ),
    },
    {
      title: 'Prix',
      dataIndex: 'prix',
      key: 'prix',
      render: (text) => (
        <Tag icon={<DollarOutlined />} color="gold">{text}</Tag>
      ),
    }
  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <DollarOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste des prix</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." enterButton />
            </div>
            <div className="client-row-right">
              <Select
                placeholder="Filtrer par article"
                style={{ width: 200, marginRight: 16 }}
                onChange={handleArticleFilter}
                allowClear
              >
                {data.map((item) => (
                  <Option key={item.nom_article} value={item.nom_article}>
                    {item.nom_article}
                  </Option>
                ))}
              </Select>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Ajouter un fournisseur
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
            dataSource={filteredData} // Utiliser les données filtrées
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            size="middle"
            scroll={scroll}
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
        {/* <FournisseurForm modalOff={setIsModalVisible} /> */}
      </Modal>
    </>
  );
};

export default ListePrix;
