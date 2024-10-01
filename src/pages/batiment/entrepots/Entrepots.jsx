import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag } from 'antd';
import { ExportOutlined, PrinterOutlined,MoreOutlined, ContainerOutlined, MailOutlined ,ApartmentOutlined,EditOutlined, PlusCircleOutlined,DeleteOutlined} from '@ant-design/icons';
import { getEntrepot } from '../../../services/batimentService';
import BinForm from '../bins/binsForm/BinForm';
import Bins from '../bins/Bins';

const { Search } = Input;

const Entrepots = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [idEntrepot, setIdEntrepot] = useState('');
  const scroll = { x: 400 };

  const handleEdit = (record) => {
    message.info(`Modifier departement: ${record.nom}`);
    setIdEntrepot(record)

  };

  const closeAllModals = () => {
    setModalType(null);
  };

  const handleAddBin = (id) => {
    openModal('AddBin', id)
  }

  const handleListBin = (id) => {
    openModal('ListBin', id)
  }

  const openModal = (type, idEntrepot = '') => {
    closeAllModals();
    setIdEntrepot(idEntrepot);
    setModalType(type);
  };

  const handleDelete = async (id) => {
    try {
      setData(data.filter((item) => item.id_departement !== id));
      message.success('Departement supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

    const fetchData = async () => {
      try {
         const { data } = await getEntrepot();
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

  const handleAddClient = () => {
    
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
      dataIndex: 'nom', 
      key: 'nom',
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Description', 
      dataIndex: 'description', 
      key: 'description',
      render: text => (
        <Tag color='blue'>{text ?? "Aucun"}</Tag>
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
              aria-label="Edit entrepot"
            />
          </Tooltip>
          <Dropdown
        overlay={(
          <Menu>
            {/* Actions Équipement */}
            <Menu.Item onClick={() => handleListBin(record.id)}>
              <ContainerOutlined /> Liste des bins
            </Menu.Item>
            <Menu.Item onClick={() => handleAddBin(record.id)}>
              <ContainerOutlined /> Nouveau Bin
            </Menu.Item>
            <Menu.Divider />
          </Menu>
        )}
        trigger={['click']}
      >
        <Button
          icon={<MoreOutlined />}
          style={{ color: 'black', padding: '0' }}
          aria-label="Menu actions"
        />
          </Dropdown>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Etes-vous sûr de vouloir supprimer ?"
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
    item.nom_departement?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.code?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ContainerOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Entrepot</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." 
                enterButton 
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="client-rows-right">
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
        visible={modalType === 'ListBin'}
        onCancel={closeAllModals}
        footer={null}
        width={1030}
        centered
      >
        <Bins id_entrepot={idEntrepot} closeModal={()=>setModalType(null)} fetchData={fetchData}/>
     </Modal>

      <Modal
        title=""
        visible={modalType === 'AddBin'}
        onCancel={closeAllModals}
        footer={null}
        width={650}
        centered
      >
        <BinForm id_entrepot={idEntrepot} closeModal={()=>setModalType(null)} fetchData={fetchData}/>
     </Modal>
    </>
  );
};

export default Entrepots;
