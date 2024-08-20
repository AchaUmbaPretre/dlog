import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popover, Popconfirm } from 'antd';
import { ExportOutlined, PrinterOutlined,ApartmentOutlined,EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import './departement.scss';
import DepartementForm from './departementForm/DepartementForm';
import config from '../../config';
import { getDepartement } from '../../services/departementService';

const { Search } = Input;

const Departement = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);


  const handleEdit = (record) => {
    message.info(`Editing client: ${record.nom}`);
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

  const handleViewDetails = (record) => {
    message.info(`Viewing details of client: ${record.nom}`);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getDepartement();
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
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    { title: 'Nom', dataIndex: 'nom_departement', key: 'nom_departement' },
    { title: 'description', dataIndex: 'description', key: 'description' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'telephone', dataIndex: 'telephone', key: 'telephone' },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    {
      title: 'Action',
      key: 'action',
      width: '15%',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              type="link"
              aria-label="View client details"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Popover title="Modifier" trigger="hover">
              <Button
                icon={<EditOutlined />}
                style={{ color: 'green' }}
                onClick={() => handleEdit(record)}
                type="link"
                aria-label="Edit client"
              />
            </Popover>
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce client?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Delete client"
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
              <ApartmentOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Département</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Search clients..." enterButton />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Département
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
            pagination={{ pageSize: 10 }}
            rowKey="key"
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      <Modal
        title="Ajouter Département"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <DepartementForm/>
      </Modal>
    </>
  );
};

export default Departement;
