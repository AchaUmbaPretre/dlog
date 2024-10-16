import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popover, Popconfirm, Tag } from 'antd';
import { ExportOutlined, PrinterOutlined,PlusCircleOutlined ,ApartmentOutlined,EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import config from '../../config';
import CatForm from './catForm/CatForm';
import { getCategorie } from '../../services/typeService';

const { Search } = Input;

const Categorie = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [idCat, setIdCat] = useState('');
  const [modalType, setModalType] = useState(null);


  const handleEdit = (id) => {
    openModal('edit', id);
  };

  const openModal = (type, id = '') => {
    closeAllModals();
    setModalType(type);
    setIdCat(id);
  };

  const closeAllModals = () => {
    setModalType(null);
  };

  const handleDelete = async (id) => {
    try {
      // Uncomment when delete function is available
      // await deleteClient(id);
      setData(data.filter((item) => item.id_categorie !== id));
      message.success('Departement supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

  const handleViewDetails = (record) => {
    message.info(`Viewing details of client: ${record.nom}`);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getCategorie();
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

  const handleAddClient = () => {
    openModal('add');
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
      title: 'Categorie', 
      dataIndex: 'nom_cat', 
      key: 'nom_cat',
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record.id_categorie)}
              aria-label="Edit department"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Etes-vous sûr de vouloir supprimer ?"
              onConfirm={() => handleDelete(record.id_categorie)}
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
    item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase()) );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ApartmentOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Categorie d'article</h2>
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
                Ajouter une categorie
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
            pagination={{ pageSize: 10 }}
            rowKey="key"
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'add'}
        onCancel={closeAllModals}
        footer={null}
        width={600}
        centered
      >
         <CatForm idCat= {idCat}/>
      </Modal>

      <Modal
        title="Editer"
        visible={modalType === 'edit'}
        onCancel={closeAllModals}
        footer={null}
        width={600}
        centered
      >
         <CatForm idCat= {idCat}/>
      </Modal>
    </>
  );
};

export default Categorie;
