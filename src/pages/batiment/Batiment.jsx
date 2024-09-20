import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Popover } from 'antd';
import { ExportOutlined, PrinterOutlined,PlusCircleOutlined, FileTextOutlined, MailOutlined ,ApartmentOutlined, PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import config from '../../config';
import BatimentForm from './batimentForm/BatimentForm';
import { getBatiment } from '../../services/typeService';
import { Link } from 'react-router-dom';
import EquipementForm from './equipement/equipementForm/EquipementForm';

const { Search } = Input;

const Batiment = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);
  const [idBatiment, setIdBatiment] = useState('');
  const scroll = { x: 400 };

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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getBatiment();
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


  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, idBatiment = '') => {
    closeAllModals();
    setIdBatiment(idBatiment);
    setModalType(type);
  };

  const handleListeEquipement = ( idBatiment) =>{
    openModal('listeEquipement', idBatiment)
  }

  const handleAddEquipement = ( idBatiment) =>{
    openModal('addEquipement', idBatiment)
  }

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
      title: 'Nom', 
      dataIndex: 'nom_batiment', 
      key: 'nom_batiment',
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Site', 
      dataIndex: 'site',
      key: 'site',
      render: text => (
        <Space>
          <Tag icon={<MailOutlined />} color='blue'>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Ville', 
      dataIndex: 'name', 
      key: 'name',
      render: text => (
        <Tag color='magenta'>{text ?? "Aucun"}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
{/*           <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              aria-label="View department details"
            />
          </Tooltip> */}
           <Popover
                content={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <Link onClick={() => handleListeEquipement(record.id_batiment)}>
                            <FileTextOutlined /> Liste d'equipements
                          </Link>
                          <Link onClick={() => handleAddEquipement(record.id_batiment)}>
                            <FileTextOutlined /> Ajouter un équipement
                          </Link>
                    </div>
                }
                    title=""
                    trigger="click"
            >
            <Tooltip title="Menu">
                <Button
                icon={<PlusCircleOutlined />}
                style={{ color: 'blue' }}
                aria-label="Contrôler"
            />
            </Tooltip>
          </Popover> 
          <Tooltip title="Delete">
            <Popconfirm
              title="Etes-vous sûr de vouloir supprimer ce département ?"
              onConfirm={() => handleDelete(record.id)}
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
    item.nom_batiment?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ApartmentOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Bâtiment</h2>
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
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Ajouter Batiment
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
            pagination={{ pageSize: 15 }}
            rowKey="key"
            scroll={scroll}
            size="small"
            bordered
          />
        </div>
      </div>

      <Modal
        title="Ajouter un batiment"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
      >
        <BatimentForm/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'addEquipement'}
        onCancel={closeAllModals}
        footer={null}
        centered
      >
        <EquipementForm idEquipement = {idBatiment} />
      </Modal>

    </>
  );
};

export default Batiment;
