import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popover, Popconfirm, Tag } from 'antd';
import { ExportOutlined, PrinterOutlined,MailOutlined ,ApartmentOutlined,EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined} from '@ant-design/icons';
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
    { 
      title: '#', 
      dataIndex: 'id', 
      key: 'id', 
      render: (text, record, index) => index + 1, 
      width: "3%" 
    },
    { 
      title: 'Nom Département', 
      dataIndex: 'nom_departement', 
      key: 'nom_departement',
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
        <Tag color='geekblue'>{text ?? 'Aucune'}</Tag>
      ),
    },
    { 
      title: 'Email', 
      dataIndex: 'email',
      key: 'email',
      render: text => (
        <Space>
          <Tag icon={<MailOutlined />} color='blue'>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Téléphone', 
      dataIndex: 'telephone', 
      key: 'telephone',
      render: text => (
        <Tag color='magenta'>{text ?? "Aucun"}</Tag>
      ),
    },
    { 
      title: 'Code', 
      dataIndex: 'code', 
      key: 'code',
      render: text => (
        <Tag color='purple'>{text}</Tag>
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
{/*           <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record)}
              aria-label="Edit department"
            />
          </Tooltip> */}
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
              <Search placeholder="Recherche..." enterButton />
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
            loading={loading}
          />
        </div>
      </div>

      <Modal
        title="Ajouter Département"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
      >
        <DepartementForm/>
      </Modal>
    </>
  );
};

export default Departement;
