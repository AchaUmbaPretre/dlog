import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag } from 'antd';
import { ExportOutlined, PrinterOutlined,PlusCircleOutlined ,ApartmentOutlined,EditOutlined, DeleteOutlined} from '@ant-design/icons';
import { getCatTache } from '../../services/typeService';
import ListeCatTacheForm from './listeCatTacheForm/ListeCatTacheForm';

const { Search } = Input;

const ListCatTache = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [idCat, setIdCat] = useState('');
  const [modalType, setModalType] = useState(null);
  const scroll = { x: 400 };

  const handleEdit = (id) => {
    openModal('Edit', id);
  };

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, idCat= '') => {
    closeAllModals();
    setModalType(type);
    setIdCat(idCat);
  };

  const handleDelete = async (id) => {
    try {
      // Uncomment when delete function is available
      // await deleteClient(id);
      setData(data.filter((item) => item.id !== id));
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



    const fetchData = async () => {
      try {
        const { data } = await getCatTache();
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

  const handleAddClient = (id) => {
    openModal('Add', id);
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
      title: 'Categorie', 
      dataIndex: 'nom_cat_tache', 
      key: 'nom_cat_tache',
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
              onClick={() => handleEdit(record.id_cat_tache)}
              aria-label="Edit department"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Etes-vous sûr de vouloir supprimer ce département ?"
              onConfirm={() => handleDelete(record.id_cat_tache)}
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
    item.nom_cat_tache?.toLowerCase().includes(searchValue.toLowerCase()) );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ApartmentOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Categorie des taches</h2>
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
                Ajouter une cat tache
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
            loading={loading}
            scroll={scroll}
          />
        </div>
      </div>

       <Modal
        title=""
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={600}
        centered
      >
         <ListeCatTacheForm idCat={''} close={()=> setModalType(null)} fetchData={fetchData}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'Edit'}
        onCancel={closeAllModals}
        footer={null}
        width={600}
        centered
      >
        <ListeCatTacheForm idCat={idCat} close={()=> setModalType(null)} fetchData={fetchData}/>
      </Modal>
    </>
  );
};

export default ListCatTache;
