import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag } from 'antd';
import { ExportOutlined,FileTextOutlined, PrinterOutlined,EditOutlined, PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import { deleteCat_inspection, getCat_inspection } from '../../services/batimentService';
import CatInspectionForm from './catInspectionForm/CatInspectionForm';

const { Search } = Input;

const CatInspection = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);
  const [idCatInspection, setIdCatInspection] = useState('')
  const scroll = { x: 400 };

  const handleDelete = async (id) => {
    try {
        await deleteCat_inspection(id);
      setData(data.filter((item) => item.id_cat_inspection !== id));
      message.success('Cat inspection supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  }

    const fetchData = async () => {
      try {
        const { data } = await getCat_inspection();
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

  const handleAddCat = (idCatInspection) => {
    openModal('addCatInspection', idCatInspection)
  };

  const handleEditCat = (idCatInspection) => {
    openModal('editCatInspection', idCatInspection)
  };

  const openModal = (type, idCatInspection = '') => {
    setIdCatInspection(idCatInspection);
    setModalType(type);
  };

  const closeAllModals = () => {
    setModalType(null);
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
      dataIndex: 'nom_cat_inspection', 
      key: 'nom_cat_inspection',
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
            <Tooltip title="Modifier">
                <Button
                icon={<EditOutlined />}
                style={{ color: 'green' }}
                onClick={() => handleEditCat(record.id_cat_inspection)}
                aria-label="Edit department"
                />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cette categorie?"
              onConfirm={() => handleDelete(record.id_cat_inspection)}
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
    item.nom_cat_inspection?.toLowerCase().includes(searchValue.toLowerCase())
  );


  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Liste de categorie Inspection</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search
                placeholder="Recherche..." 
                onChange={(e) => setSearchValue(e.target.value)}
                enterButton 
               />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddCat}
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
            scroll={scroll}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'addCatInspection'}
        onCancel={closeAllModals}
        footer={null}
        width={600}
      >
        <CatInspectionForm closeModal={closeAllModals} fetchData={fetchData} idCatInspection={''} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'editCatInspection'}
        onCancel={closeAllModals}
        footer={null}
        width={600}
      >
        <CatInspectionForm closeModal={closeAllModals} fetchData={fetchData} idCatInspection={idCatInspection}/>
      </Modal>
    </>
  );
};

export default CatInspection;
