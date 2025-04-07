import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Dropdown, Menu, Space, Tooltip, Popconfirm, Tag, Modal } from 'antd';
import { ExportOutlined, TruckOutlined,ToolOutlined, PrinterOutlined, EditOutlined, PlusCircleOutlined,DeleteOutlined} from '@ant-design/icons';
import CharroiForm from './charroiForm/CharroiForm';

const { Search } = Input;

const Charroi = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const scroll = { x: 400 };

  const handleEdit = (id) => {
  };

  const handleDelete = async (id) => {
    /* try {
      await deletePutDepartement(id);
      setData(data.filter((item) => item.id_departement !== id));
      message.success('Departement supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    } */
  };

    const fetchData = async () => {
     /*  try {
        const { data } = await getStock();
        setData(data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      } */
    };

  useEffect(() => {
    fetchData();
  }, []);

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
    // Logic to export data to PDF
    message.success('Exporting to PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        Export to Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        Export to PDF
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { 
      title: '#', 
      dataIndex: 'id', 
      key: 'id', 
      render: (text, record, index) => index + 1, 
      width: "3%" 
    },
    { 
        title: 'Image', 
        dataIndex: 'image', 
        key: 'nom_article',
        render: text => (
            <div>
                {text}
            </div>
        ),
    },
    { 
        title: 'Matricule', 
        dataIndex: 'matricule', 
        key: 'matricule',
        render: text => (
          <div>
            {text}
          </div>
        ),
    },
    { 
      title: 'Marque', 
      dataIndex: 'nom_marque', 
      key: 'nom_marque',
      render: text => (
        <div>
            {text}
        </div>
      ),
    },
    { 
        title: 'Modèle', 
        dataIndex: 'nom_modele', 
        key: 'nom_modele',
        render: text => (
          <div>
              {text}
          </div>
        ),
    },
    {
      title: 'Année de fab',
      dataIndex: 'annee_fabrication',
      key: 'annee_fabrication',
      render: (text) => (
        <div>{text}</div>
      ),
    },
    {
        title: 'Année de circulation',
        dataIndex: 'annee_circulation',
        key: 'annee_circulation',
        render: (text) => (
          <div>{text}</div>
        ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
           <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record.id_stock)}
              aria-label="Edit department"
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Etes-vous sûr de vouloir supprimer ?"
              onConfirm={() => handleDelete(record.id_stock)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Delete department"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredData = data.filter(item =>
    item.nom_article?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <TruckOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Charroi</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." 
                enterButton 
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAddClient}
              >
                Ajouter un véhicule
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
            pagination={{ pageSize: 10 }}
            rowKey="key"
            bordered
            size="middle"
            scroll={scroll}
            loading={loading}
          />
        </div>
      </div>
 
      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
      >
        <CharroiForm closeModal={() => setIsModalVisible(false)} fetchData={fetchData}/>
      </Modal>
    </>
  );
};

export default Charroi;